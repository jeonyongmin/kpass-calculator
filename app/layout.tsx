import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2026 K-PASS 환급 계산기 | 모두의카드 예상 환급액 계산",
  description: "2026년 K-PASS·모두의카드 예상 환급액을 계산해보세요. 월 교통비, 이용자 유형, 거주 지역과 이용 조건을 입력하면 기본형·일반형·플러스형을 비교해 예상 환급액을 확인할 수 있습니다.",
  keywords: [
    "K-PASS",
    "K패스",
    "K-PASS 환급",
    "K패스 환급",
    "K-PASS 계산기",
    "K패스 계산기",
    "모두의카드",
    "모두의카드 계산기",
    "모두의카드 환급",
    "교통비 환급",
    "대중교통 환급",
    "2026 K-PASS",
    "2026 모두의카드",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "2026 K-PASS·모두의카드 환급 계산기",
    description: "월 교통비와 이용 조건을 입력하고 2026년 K-PASS·모두의카드 예상 환급액을 비교해보세요.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 K-PASS·모두의카드 환급 계산기",
    description: "월 교통비와 이용 조건을 입력하고 2026년 K-PASS·모두의카드 예상 환급액을 비교해보세요.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
