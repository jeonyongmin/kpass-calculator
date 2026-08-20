"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import {
  BENEFIT_LABELS,
  calculateKPassRefund,
  isHalfPriceMonth,
  REGION_LABELS,
  type RefundResult,
  type RegionType,
  USER_TYPE_LABELS,
  type UserType,
} from "@/lib/kpassPolicy";

const currentMonth = new Date().getFullYear() === 2026 ? new Date().getMonth() + 1 : 1;
const currency = new Intl.NumberFormat("ko-KR");
type FieldErrorKey = "totalAmount" | "rideCount" | "underAmount" | "offPeakAmount";

export default function RefundCalculator() {
  const [month, setMonth] = useState(currentMonth);
  const [totalAmount, setTotalAmount] = useState("");
  const [rideCount, setRideCount] = useState("");
  const [isFirstMonth, setIsFirstMonth] = useState(false);
  const [userType, setUserType] = useState<UserType>("general");
  const [region, setRegion] = useState<RegionType>("capital");
  const [hasExpensiveRide, setHasExpensiveRide] = useState(false);
  const [underThreeThousandAmount, setUnderThreeThousandAmount] = useState("");
  const [offPeakAmount, setOffPeakAmount] = useState("0");
  const [result, setResult] = useState<RefundResult | null>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldErrorKey, string>>>({});
  const resultRef = useRef<HTMLDivElement>(null);
  const calculatorStartRef = useRef<HTMLDivElement>(null);
  const totalAmountRef = useRef<HTMLDivElement>(null);
  const rideCountRef = useRef<HTMLDivElement>(null);
  const underAmountRef = useRef<HTMLDivElement>(null);
  const offPeakAmountRef = useRef<HTMLDivElement>(null);
  const halfPrice = isHalfPriceMonth(month);

  const amount = useMemo(() => Number(totalAmount || 0), [totalAmount]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const rides = Number(rideCount || 0);
    const underAmount = hasExpensiveRide ? Number(underThreeThousandAmount || 0) : amount;
    const offPeak = halfPrice ? Number(offPeakAmount || 0) : 0;

    const nextErrors: Partial<Record<FieldErrorKey, string>> = {};
    if (totalAmount === "") nextErrors.totalAmount = "월 대중교통 이용금액을 입력해주세요.";
    if (rideCount === "") nextErrors.rideCount = "월 대중교통 이용 횟수를 입력해주세요.";
    else if (rides < 0 || !Number.isInteger(rides)) nextErrors.rideCount = "월 대중교통 이용 횟수는 0 이상의 정수로 입력해주세요.";
    if (hasExpensiveRide && underThreeThousandAmount === "") nextErrors.underAmount = "3,000원 미만 이용금액을 입력해주세요.";
    else if (underAmount > amount) nextErrors.underAmount = "3,000원 미만 이용금액은 전체 교통비를 초과할 수 없습니다.";
    if (halfPrice && offPeakAmount === "") nextErrors.offPeakAmount = "시차시간 이용금액을 입력해주세요.";
    else if (offPeak > amount) nextErrors.offPeakAmount = "시차시간 이용금액은 전체 교통비를 초과할 수 없습니다.";

    const firstError = (Object.keys(nextErrors) as FieldErrorKey[])[0];
    if (firstError) {
      setErrors(nextErrors);
      const errorRefs = { totalAmount: totalAmountRef, rideCount: rideCountRef, underAmount: underAmountRef, offPeakAmount: offPeakAmountRef };
      window.requestAnimationFrame(() => scrollToField(errorRefs[firstError].current));
      return;
    }

    const nextResult = calculateKPassRefund({ month, totalAmount: amount, rideCount: rides, isFirstMonth, userType, region, underThreeThousandAmount: underAmount, offPeakAmount: offPeak });
    setErrors({});
    setResult(nextResult);

    if (window.matchMedia("(max-width: 767px)").matches) {
      window.requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function handleReset() {
    setMonth(currentMonth);
    setTotalAmount("");
    setRideCount("");
    setIsFirstMonth(false);
    setUserType("general");
    setRegion("capital");
    setHasExpensiveRide(false);
    setUnderThreeThousandAmount("");
    setOffPeakAmount("0");
    setResult(null);
    setErrors({});

    window.requestAnimationFrame(() => {
      const startElement = calculatorStartRef.current;
      if (!startElement) return;
      const rect = startElement.getBoundingClientRect();
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const isOutsideViewport = rect.top < 80 || rect.bottom > window.innerHeight;
      if (isMobile || isOutsideViewport) {
        startElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.3)] lg:grid lg:grid-cols-2">
      <form noValidate onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-10" aria-label="K-PASS 예상 환급액 입력">
        <Field label="계산 기준 월" htmlFor="month" fieldRef={calculatorStartRef}>
          <select id="month" value={month} onChange={(event) => { setMonth(Number(event.target.value)); setResult(null); }} className={inputClass}>
            {Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>2026년 {index + 1}월</option>)}
          </select>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="월 대중교통 이용금액" htmlFor="total-amount" fieldRef={totalAmountRef} error={errors.totalAmount}>
            <MoneyInput id="total-amount" value={totalAmount} onChange={(value) => { setTotalAmount(value); clearError("totalAmount", setErrors); }} error={Boolean(errors.totalAmount)} />
          </Field>
          <Field label="월 대중교통 이용 횟수" htmlFor="ride-count" fieldRef={rideCountRef} error={errors.rideCount}>
            <input id="ride-count" type="number" value={rideCount} onChange={(event) => { setRideCount(event.target.value); clearError("rideCount", setErrors); }} placeholder="이용 횟수" aria-invalid={Boolean(errors.rideCount)} aria-describedby={errors.rideCount ? "ride-count-error" : undefined} className={inputClass} />
          </Field>
        </div>

        <Choice label="가입 첫 달인가요?" value={isFirstMonth} onChange={setIsFirstMonth} name="first-month" />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="이용자 유형" htmlFor="user-type">
            <select id="user-type" value={userType} onChange={(event) => setUserType(event.target.value as UserType)} className={inputClass}>
              {Object.entries(USER_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <details className="group mt-2.5">
              <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-blue-600 underline decoration-blue-200 underline-offset-4 transition hover:text-blue-700">
                어떤 유형을 선택해야 하나요?
                <span aria-hidden="true" className="transition group-open:rotate-180">⌄</span>
              </summary>
              <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs leading-5 text-slate-600">
                <p className="font-bold text-slate-800">이용자 유형 안내</p>
                <dl className="mt-2 space-y-2">
                  <div><dt className="font-bold text-slate-700">일반</dt><dd>별도 우대 유형에 해당하지 않는 이용자</dd></div>
                  <div><dt className="font-bold text-slate-700">청년</dt><dd>청년 연령 기준에 해당하는 이용자</dd></div>
                  <div><dt className="font-bold text-slate-700">2자녀</dt><dd>다자녀 가구 중 2자녀 기준에 해당하는 이용자</dd></div>
                  <div><dt className="font-bold text-slate-700">어르신</dt><dd>어르신 연령 기준에 해당하는 이용자</dd></div>
                  <div><dt className="font-bold text-slate-700">3자녀 이상</dt><dd>다자녀 가구 중 3자녀 이상 기준에 해당하는 이용자</dd></div>
                  <div><dt className="font-bold text-slate-700">저소득층</dt><dd>K-PASS의 저소득층 우대 기준에 해당하는 이용자</dd></div>
                </dl>
                <p className="mt-3">연령, 자녀 및 저소득층 인정 기준은 실제 K-PASS·모두의카드 정책과 회원정보에 따라 적용됩니다.</p>
                <p className="mt-2">정확한 대상 여부는 공식 모두의카드 안내에서 확인해주세요.</p>
                <a href="https://www.molit.go.kr/mta/USR/WPGE0201/m_37187/DTL.jsp" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-800">공식 모두의카드 안내 보기 ↗</a>
              </div>
            </details>
          </Field>
          <Field label="거주 지역 구분" htmlFor="region">
            <select id="region" value={region} onChange={(event) => setRegion(event.target.value as RegionType)} className={inputClass}>
              {Object.entries(REGION_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <details className="group mt-2.5">
              <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-blue-600 underline decoration-blue-200 underline-offset-4 transition hover:text-blue-700">
                지역 구분이 헷갈리나요?
                <span aria-hidden="true" className="transition group-open:rotate-180">⌄</span>
              </summary>
              <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs leading-5 text-slate-600">
                <p className="font-bold text-slate-800">지역 구분 안내</p>
                <p className="mt-2">모두의카드는 지역에 따라 정액제 기준금액이 달라집니다.</p>
                <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-slate-700">
                  <li>• 수도권</li>
                  <li>• 일반 지방권</li>
                  <li>• 우대지원지역</li>
                  <li>• 특별지원지역</li>
                </ul>
                <p className="mt-3">우대지원지역과 특별지원지역은 인구감소 등 지역 여건을 고려하여 구분됩니다.</p>
                <p className="mt-2">정확한 지역 구분이 확실하지 않은 경우 공식 모두의카드 안내를 확인한 뒤 선택해주세요.</p>
                <a href="https://www.molit.go.kr/mta/USR/WPGE0201/m_37187/DTL.jsp" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-800">공식 모두의카드 안내 보기 ↗</a>
              </div>
            </details>
          </Field>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <Choice label={<>GTX·광역버스 등 1회 총 이용금액이<br className="hidden sm:block" /> 3,000원 이상인 이용내역이 있나요?</>} value={hasExpensiveRide} onChange={setHasExpensiveRide} name="expensive-ride" />
          {hasExpensiveRide && <div className="mt-5"><Field label="3,000원 미만 이용금액" htmlFor="under-amount" fieldRef={underAmountRef} error={errors.underAmount}><MoneyInput id="under-amount" value={underThreeThousandAmount} onChange={(value) => { setUnderThreeThousandAmount(value); clearError("underAmount", setErrors); }} error={Boolean(errors.underAmount)} /></Field></div>}
        </div>

        {halfPrice && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
            <Field label="시차시간 이용금액" htmlFor="off-peak" fieldRef={offPeakAmountRef} error={errors.offPeakAmount}><MoneyInput id="off-peak" value={offPeakAmount} onChange={(value) => { setOffPeakAmount(value); clearError("offPeakAmount", setErrors); }} error={Boolean(errors.offPeakAmount)} /></Field>
            <p className="mt-2 text-xs leading-5 text-blue-700">05:30~06:30 / 09:00~10:00 / 16:00~17:00 / 19:00~20:00 탑승분</p>
          </div>
        )}

        <div className="space-y-3">
          <button type="submit" className="h-14 w-full rounded-xl bg-blue-600 font-bold text-white shadow-md shadow-blue-600/15 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">예상 환급액 계산하기</button>
          <button type="button" onClick={handleReset} className="h-12 w-full rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">입력값 초기화</button>
        </div>
      </form>

      <div ref={resultRef} className="scroll-mt-28">
        <ResultPanel result={result} />
      </div>
    </div>
  );
}

function ResultPanel({ result }: { result: RefundResult | null }) {
  if (!result) {
    return <div className="flex min-h-80 items-center justify-center bg-slate-50 p-6 sm:p-10"><div className="text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl text-blue-600 shadow-sm ring-1 ring-slate-200">₩</div><p className="mt-6 text-lg leading-7 font-bold text-slate-700">교통비와 이용자 유형을 입력하면<br />예상 환급액이 표시됩니다.</p><p className="mt-3 text-sm text-slate-500">입력하신 정보는 저장되지 않습니다.</p></div></div>;
  }

  const refunds = [
    ["basic", "기본형 예상 환급", result.basicRefund],
    ["general", "일반형 예상 환급", result.generalRefund],
    ["plus", "플러스형 예상 환급", result.plusRefund],
  ] as const;

  return (
    <div className="bg-slate-50 p-6 sm:p-10">
      <div className="rounded-2xl bg-blue-600 p-6 text-white shadow-lg shadow-blue-600/15">
        <p className="text-sm font-medium text-blue-100">예상 환급액</p>
        <p className="mt-2 text-4xl font-extrabold tracking-tight">{currency.format(result.finalRefund)}원</p>
        <div className="mt-6 grid gap-4 border-t border-white/20 pt-5 sm:grid-cols-2">
          <div><p className="text-xs text-blue-100">적용 예상 혜택</p><p className="mt-1 font-bold">{BENEFIT_LABELS[result.bestBenefit]}</p></div>
          <div><p className="text-xs text-blue-100">예상 실제 부담 교통비</p><p className="mt-1 font-bold">{currency.format(result.actualCost)}원</p></div>
        </div>
      </div>

      {!result.eligible && <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">가입 첫 달이 아닌 경우 월 15회 이상 이용해야 환급 대상이 됩니다.</p>}
      {result.isHalfPricePeriod && <span className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">반값 모두의카드 한시 혜택 적용</span>}

      <div className="mt-5 space-y-2">
        {refunds.map(([type, label, value]) => (
          <div key={type} className={`flex items-center justify-between rounded-xl border bg-white px-4 py-4 ${result.eligible && type === result.bestBenefit ? "border-blue-300" : "border-slate-200"}`}>
            <div className="flex items-center gap-2"><span className="text-sm font-medium text-slate-600">{label}</span>{result.eligible && type === result.bestBenefit && <span className="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-bold text-blue-700">가장 유리</span>}</div>
            <strong className="text-slate-900">{currency.format(value)}원</strong>
          </div>
        ))}
      </div>

      <aside className="mt-6 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-5 text-sm leading-6 text-slate-700 sm:p-6">
        <h3 className="flex items-center gap-2 font-bold text-slate-900">
          <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs text-amber-700">i</span>
          계산 결과 확인사항
        </h3>
        <div className="mt-3 space-y-4">
          <p>본 계산 결과는 입력한 정보를 기준으로 한 예상 금액입니다. 실제 환급액은 이용내역, 환승 처리, 카드사 및 K-PASS·모두의카드 정책 적용 결과에 따라 달라질 수 있습니다.</p>
          <div className="border-t border-amber-200/70 pt-4">
            <p className="font-semibold text-slate-800">환급 대상 교통수단도 확인해주세요.</p>
            <p className="mt-1">KTX, SRT, 시외·고속버스, 공항버스 등 별도 승차권 발권 방식의 일부 교통수단은 K-PASS 환급 대상에서 제외될 수 있습니다.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

const inputClass = "mt-2.5 h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function Field({ label, htmlFor, children, fieldRef, error }: { label: string; htmlFor: string; children: React.ReactNode; fieldRef?: React.RefObject<HTMLDivElement | null>; error?: string }) {
  return <div ref={fieldRef} className="scroll-mt-28"><label htmlFor={htmlFor} className="block text-sm font-bold text-slate-800">{label}</label>{children}{error && <p id={`${htmlFor}-error`} role="alert" className="mt-2 text-sm font-medium leading-5 text-red-600">{error}</p>}</div>;
}

function MoneyInput({ id, value, onChange, error = false }: { id: string; value: string; onChange: (value: string) => void; error?: boolean }) {
  const displayValue = value === "" ? "" : currency.format(Number(value));

  return <div className="relative"><input id={id} type="text" inputMode="numeric" value={displayValue} onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))} placeholder="금액을 입력해주세요" aria-invalid={error} aria-describedby={error ? `${id}-error` : undefined} className={`${inputClass} pr-12 ${error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}`} /><span className="absolute top-[calc(50%+5px)] right-4 -translate-y-1/2 text-sm font-medium text-slate-500">원</span></div>;
}

function clearError(key: FieldErrorKey, setErrors: React.Dispatch<React.SetStateAction<Partial<Record<FieldErrorKey, string>>>>) {
  setErrors((current) => {
    if (!current[key]) return current;
    const next = { ...current };
    delete next[key];
    return next;
  });
}

function scrollToField(element: HTMLDivElement | null) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const isOutsideViewport = rect.top < 80 || rect.bottom > window.innerHeight;
  if (isMobile || isOutsideViewport) element.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Choice({ label, value, onChange, name }: { label: React.ReactNode; value: boolean; onChange: (value: boolean) => void; name: string }) {
  return <fieldset><legend className="text-sm leading-6 font-bold text-slate-800">{label}</legend><div className="mt-2.5 grid grid-cols-2 gap-2">{[[true, "예"], [false, "아니오"]] .map(([option, text]) => <label key={text as string} className={`flex h-12 cursor-pointer items-center justify-center rounded-xl border text-sm font-semibold transition ${value === option ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-300 bg-white text-slate-600"}`}><input type="radio" name={name} checked={value === option} onChange={() => onChange(option as boolean)} className="sr-only" />{text as string}</label>)}</div></fieldset>;
}
