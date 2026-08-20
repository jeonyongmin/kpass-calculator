export type UserType =
  | "general"
  | "youth"
  | "twoChildren"
  | "senior"
  | "threeChildren"
  | "lowIncome";

export type RegionType = "capital" | "local" | "priority" | "special";
export type BenefitType = "basic" | "general" | "plus";

export interface RefundInput {
  month: number;
  totalAmount: number;
  rideCount: number;
  isFirstMonth: boolean;
  userType: UserType;
  region: RegionType;
  underThreeThousandAmount: number;
  offPeakAmount: number;
}

export interface RefundResult {
  eligible: boolean;
  basicRefund: number;
  generalRefund: number;
  plusRefund: number;
  finalRefund: number;
  actualCost: number;
  bestBenefit: BenefitType;
  isHalfPricePeriod: boolean;
}

export const USER_TYPE_LABELS: Record<UserType, string> = {
  general: "일반",
  youth: "청년",
  twoChildren: "2자녀",
  senior: "어르신",
  threeChildren: "3자녀 이상",
  lowIncome: "저소득층",
};

export const REGION_LABELS: Record<RegionType, string> = {
  capital: "수도권",
  local: "일반 지방권",
  priority: "우대지원지역",
  special: "특별지원지역",
};

export const BENEFIT_LABELS: Record<BenefitType, string> = {
  basic: "기본형",
  general: "일반형",
  plus: "플러스형",
};

export const BASE_REFUND_RATES: Record<UserType, number> = {
  general: 0.2,
  youth: 0.3,
  twoChildren: 0.3,
  senior: 0.3,
  threeChildren: 0.5,
  lowIncome: 0.533,
};

export const OFF_PEAK_REFUND_RATES: Record<UserType, number> = {
  general: 0.5,
  youth: 0.6,
  twoChildren: 0.6,
  senior: 0.6,
  threeChildren: 0.8,
  lowIncome: 0.833,
};

type Threshold = { general: number; plus: number };
type ThresholdGroup = "general" | "middle" | "highSupport";
type ThresholdTable = Record<RegionType, Record<ThresholdGroup, Threshold>>;

const STANDARD_THRESHOLDS: ThresholdTable = {
  capital: { general: { general: 62000, plus: 100000 }, middle: { general: 55000, plus: 90000 }, highSupport: { general: 45000, plus: 80000 } },
  local: { general: { general: 55000, plus: 95000 }, middle: { general: 50000, plus: 85000 }, highSupport: { general: 40000, plus: 75000 } },
  priority: { general: { general: 50000, plus: 90000 }, middle: { general: 45000, plus: 80000 }, highSupport: { general: 35000, plus: 70000 } },
  special: { general: { general: 45000, plus: 85000 }, middle: { general: 40000, plus: 75000 }, highSupport: { general: 30000, plus: 65000 } },
};

const HALF_PRICE_THRESHOLDS: ThresholdTable = {
  capital: { general: { general: 30000, plus: 50000 }, middle: { general: 25000, plus: 45000 }, highSupport: { general: 22000, plus: 40000 } },
  local: { general: { general: 27000, plus: 47000 }, middle: { general: 23000, plus: 42000 }, highSupport: { general: 20000, plus: 37000 } },
  priority: { general: { general: 25000, plus: 45000 }, middle: { general: 21000, plus: 40000 }, highSupport: { general: 17000, plus: 35000 } },
  special: { general: { general: 22000, plus: 42000 }, middle: { general: 20000, plus: 37000 }, highSupport: { general: 15000, plus: 32000 } },
};

export function isHalfPriceMonth(month: number) {
  return month >= 4 && month <= 9;
}

function getThresholdGroup(userType: UserType): ThresholdGroup {
  if (userType === "general") return "general";
  if (userType === "threeChildren" || userType === "lowIncome") return "highSupport";
  return "middle";
}

function validateInput(input: RefundInput) {
  if (!Number.isInteger(input.month) || input.month < 1 || input.month > 12) throw new RangeError("계산 기준 월은 1~12 사이여야 합니다.");
  if (input.totalAmount < 0 || input.rideCount < 0) throw new RangeError("이용금액과 이용횟수는 0 이상이어야 합니다.");
  if (input.underThreeThousandAmount < 0 || input.underThreeThousandAmount > input.totalAmount) throw new RangeError("3,000원 미만 이용금액은 전체 이용금액 이하여야 합니다.");
  if (input.offPeakAmount < 0 || input.offPeakAmount > input.totalAmount) throw new RangeError("시차시간 이용금액은 전체 이용금액 이하여야 합니다.");
}

export function calculateKPassRefund(input: RefundInput): RefundResult {
  validateInput(input);
  const halfPrice = isHalfPriceMonth(input.month);
  const eligible = input.isFirstMonth || input.rideCount >= 15;

  if (!eligible) {
    return { eligible, basicRefund: 0, generalRefund: 0, plusRefund: 0, finalRefund: 0, actualCost: input.totalAmount, bestBenefit: "basic", isHalfPricePeriod: halfPrice };
  }

  const group = getThresholdGroup(input.userType);
  const threshold = (halfPrice ? HALF_PRICE_THRESHOLDS : STANDARD_THRESHOLDS)[input.region][group];
  const normalAmount = input.totalAmount - (halfPrice ? input.offPeakAmount : 0);

  // 정률제 계산에서 발생하는 소수점은 예상 금액 표시를 위해 원 단위로 반올림한다.
  const basicRefund = Math.round(
    normalAmount * BASE_REFUND_RATES[input.userType] +
      (halfPrice ? input.offPeakAmount * OFF_PEAK_REFUND_RATES[input.userType] : 0),
  );
  const generalRefund = Math.max(0, input.underThreeThousandAmount - threshold.general);
  const plusRefund = Math.max(0, input.totalAmount - threshold.plus);
  const refundEntries: Array<[BenefitType, number]> = [
    ["basic", basicRefund],
    ["general", generalRefund],
    ["plus", plusRefund],
  ];
  const [bestBenefit, finalRefund] = refundEntries.reduce((best, current) => current[1] > best[1] ? current : best);

  return {
    eligible,
    basicRefund,
    generalRefund,
    plusRefund,
    finalRefund,
    actualCost: Math.max(0, input.totalAmount - finalRefund),
    bestBenefit,
    isHalfPricePeriod: halfPrice,
  };
}
