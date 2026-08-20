import Header from "./components/Header";
import RefundCalculator from "./components/RefundCalculator";

const features = [
  { title: "전국 대중교통 이용", description: "마을·시내·광역버스와 도시철도, 신분당선, GTX, 공항철도 등 다양한 대중교통 이용내역을 기준으로 환급 혜택이 적용됩니다.", icon: "🚌" },
  { title: "3가지 방식 자동 비교", description: "기본형(정률제), 일반형(정액제), 플러스형(정액제)을 비교해 가장 큰 환급 혜택이 자동 적용됩니다.", icon: "↔" },
  { title: "월 15회 이상 이용", description: "기본적으로 월 15회 이상 대중교통을 이용해야 환급 대상이 됩니다. 가입 첫 달에는 15회 미만이어도 환급이 적용될 수 있습니다.", icon: "15" },
];

const userTypes = [
  { name: "일반", rate: "기본형 20%", description: "청년, 다자녀, 어르신, 저소득층 우대 유형에 해당하지 않는 일반 이용자" },
  { name: "청년", rate: "기본형 30%", description: "기본 K-PASS 기준 만 19세~34세 청년" },
  { name: "2자녀", rate: "기본형 30%", description: "2자녀 다자녀 우대 기준이 확인된 이용자" },
  { name: "어르신", rate: "기본형 30%", description: "만 65세 이상 이용자" },
  { name: "3자녀 이상", rate: "기본형 50%", description: "3자녀 이상 다자녀 우대 기준이 확인된 이용자" },
  { name: "저소득층", rate: "기본형 53.3%", description: "K-PASS 저소득층 우대 기준이 확인된 이용자" },
];

const faqItems = [
  { question: "K-PASS·모두의카드는 누구나 이용할 수 있나요?", answer: "기본적으로 만 19세 이상 이용자가 모두의카드를 발급받고 K-PASS 앱 또는 누리집에서 회원가입과 카드 등록을 완료한 뒤 이용할 수 있습니다.\n\n실제 적용 자격은 회원가입 시 주소지 및 관련 정보 검증을 통해 확인됩니다." },
  { question: "어떤 대중교통이 환급 대상인가요?", answer: "마을·시내·광역버스, 도시·광역철도, 신분당선, GTX, 공항철도 등 일상적으로 이용하는 대중교통이 주요 대상입니다.\n\nKTX, SRT, 시외·고속버스, 공항버스 등 별도 승차권을 발권하고 다른 대중교통과 환승할인이 적용되지 않는 일부 교통수단은 대상에서 제외될 수 있습니다." },
  { question: "환급액은 어떻게 결정되나요?", answer: "2026년 모두의카드는 기본형(정률제), 일반형(정액제), 플러스형(정액제)을 비교하여 이용자에게 가장 큰 환급 혜택을 자동 적용합니다.\n\n이용자 유형과 거주 지역, 대중교통 이용금액 및 이용내역 등에 따라 환급 결과가 달라질 수 있습니다." },
  { question: "월 몇 회 이상 이용해야 하나요?", answer: "기본적으로 월 15회 이상 대중교통을 이용해야 환급 대상이 됩니다.\n\n다만 가입 첫 달은 15회 미만 이용하더라도 환급이 적용될 수 있습니다." },
  { question: "2026년 반값 모두의카드는 무엇인가요?", answer: "2026년 4월~9월 이용분에 한해 정액제 환급 기준금액을 낮추고, 지정된 시차시간 탑승분에 대해서는 기본형 환급률을 추가로 높이는 한시 지원입니다.\n\n본 계산기는 계산 기준 월을 선택하면 해당 기간의 기준을 자동으로 반영합니다." },
  { question: "다자녀와 어르신도 추가 혜택이 있나요?", answer: "네. 기본형 기준으로 2자녀와 어르신은 30%, 3자녀 이상은 50% 환급률이 적용됩니다.\n\n어르신 유형은 만 65세 이상을 대상으로 하며, 다자녀 혜택은 K-PASS의 자격 확인 절차를 거쳐 적용됩니다." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <main id="top">
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
          <div aria-hidden="true" className="absolute -top-20 right-[-8rem] h-80 w-80 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:py-32">
            <div>
              <p className="mb-5 inline-flex rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">2026 K-PASS · 모두의카드</p>
              <h1 className="text-4xl leading-[1.18] font-extrabold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">2026 K-PASS 환급액,<br /><span className="text-blue-600">미리 계산해보세요</span></h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">월 대중교통 이용금액과 이용 조건을 입력하면<br className="hidden sm:block" /> 2026년 K-PASS·모두의카드 기준으로<br className="hidden sm:block" /> 예상 환급액을 비교해볼 수 있습니다.</p>
              <a href="#calculator" className="mt-9 inline-flex min-h-13 items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">환급액 계산하기 <span aria-hidden="true" className="ml-2">↓</span></a>
            </div>
            <div className="relative mx-auto w-full max-w-md lg:justify-self-end">
              <div className="absolute inset-5 rotate-3 rounded-3xl bg-blue-200/60" />
              <div className="relative rounded-3xl border border-blue-100 bg-white p-7 shadow-[0_24px_70px_-28px_rgba(37,99,235,0.35)] sm:p-9">
                <div className="flex items-center justify-between"><span className="text-sm font-semibold text-blue-600">K-PASS</span><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">모두의카드 비교</span></div>
                <p className="mt-10 text-sm text-slate-500">이번 달 대중교통 이용금액</p>
                <div className="mt-3 h-10 w-3/4 rounded-lg bg-slate-100" />
                <div className="mt-8 grid grid-cols-3 gap-3"><div className="h-16 rounded-xl bg-blue-50" /><div className="h-16 rounded-xl bg-slate-50" /><div className="h-16 rounded-xl bg-slate-50" /></div>
                <div className="mt-7 flex items-end justify-between border-t border-slate-100 pt-6"><div><p className="text-xs text-slate-400">예상 환급액</p><p className="mt-2 text-lg font-bold text-slate-500">3가지 방식 자동 비교</p></div><div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white">₩</div></div>
              </div>
            </div>
          </div>
        </section>

        <section id="calculator" className="scroll-mt-28 px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-5xl"><SectionHeading eyebrow="REFUND CALCULATOR" title="예상 환급액 계산기" description="간단한 정보를 입력하고 예상 결과를 확인해보세요." /><RefundCalculator /></div>
        </section>

        <section id="about" className="scroll-mt-28 bg-slate-50 px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="ABOUT K-PASS" title="K-PASS·모두의카드란?" />
            <div className="mx-auto mt-5 max-w-3xl space-y-3 text-center leading-7 text-slate-600">
              <p>K-PASS는 대중교통 이용자의 교통비 부담을 줄이기 위한 대중교통비 환급 지원 제도입니다.</p>
              <p>2026년부터 혜택이 강화된 &lsquo;모두의카드&rsquo;가 도입되어 기존 정률 환급뿐 아니라 일정 기준금액을 초과한 교통비를 환급하는 정액제 방식도 함께 적용됩니다.</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {features.map((feature) => <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl font-bold text-blue-600">{feature.icon}</div><h3 className="mt-6 text-xl font-bold text-slate-950">{feature.title}</h3><p className="mt-3 leading-7 text-slate-600">{feature.description}</p></article>)}
            </div>
            <p className="mt-7 text-center text-sm text-slate-500">모두의카드 발급 후 K-PASS 앱 또는 누리집에서 회원가입 및 카드 등록이 필요합니다.</p>

            <aside className="mt-12 overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-sm">
              <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <span className="inline-flex rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700">2026년 4월~9월 한시 적용</span>
                  <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950">반값 모두의카드 혜택</h3>
                  <div className="mt-3 max-w-2xl space-y-2 leading-7 text-slate-600"><p>2026년 4월부터 9월 이용분까지 정액제 환급 기준금액이 한시적으로 낮아집니다.</p><p>또한 지정된 시차시간에 탑승한 이용금액은 기본형 환급률이 30%p 추가 적용됩니다.</p></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-sm font-bold text-blue-700 sm:grid-cols-4 lg:grid-cols-2">
                  {["05:30~06:30", "09:00~10:00", "16:00~17:00", "19:00~20:00"].map((time) => <span key={time} className="rounded-xl bg-blue-50 px-3 py-3">{time}</span>)}
                </div>
              </div>
              <p className="border-t border-blue-100 bg-blue-50/60 px-6 py-4 text-sm text-blue-800 sm:px-8">본 계산기는 선택한 계산 기준 월에 따라 해당 한시 혜택을 자동 반영합니다.</p>
            </aside>
          </div>
        </section>

        <section id="user-types" className="scroll-mt-28 px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="USER TYPE" title="이용자 유형 안내" description="기본형 환급률은 이용자 유형에 따라 다르게 적용됩니다." />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {userTypes.map((type, index) => <article key={type.name} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"><div className="flex items-center justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-extrabold text-blue-600">{String(index + 1).padStart(2, "0")}</span><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">{type.rate}</span></div><h3 className="mt-5 text-xl font-bold text-slate-950">{type.name}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{type.description}</p></article>)}
            </div>
            <p className="mt-7 text-center text-sm text-slate-500">실제 우대 유형 적용 여부는 K-PASS 회원정보 및 자격 검증 결과에 따라 결정됩니다.</p>
          </div>
        </section>

        <section className="bg-blue-600 px-5 py-20 text-white sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <SectionHeading eyebrow="HOW TO USE" title="이용 방법" description="세 단계로 간편하게 확인할 수 있습니다." inverted />
            <ol className="mt-12 grid gap-5 md:grid-cols-3 md:gap-8">
              {[["STEP 1", "교통비·이용조건 입력"], ["STEP 2", "이용자 유형 선택"], ["STEP 3", "예상 환급액 비교"]].map(([step, title], index) => <li key={step} className="rounded-2xl bg-white/10 p-7 text-center ring-1 ring-white/20 backdrop-blur-sm"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white font-extrabold text-blue-600">{index + 1}</span><p className="mt-5 text-xs font-bold tracking-[0.16em] text-blue-200">{step}</p><h3 className="mt-2 text-lg font-bold">{title}</h3></li>)}
            </ol>
          </div>
        </section>

        <section id="faq" className="scroll-mt-28 bg-slate-50 px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <SectionHeading eyebrow="FAQ" title="자주 묻는 질문" />
            <div className="mt-10 space-y-3">
              {faqItems.map((item, index) => <details key={item.question} className="group rounded-2xl border border-slate-200 bg-white open:border-blue-200 open:shadow-sm"><summary className="cursor-pointer list-none"><h3 className="flex items-center gap-4 px-5 py-5 font-bold text-slate-800 sm:px-6"><span className="text-sm font-extrabold text-blue-600">Q{index + 1}</span><span className="flex-1">{item.question}</span><span aria-hidden="true" className="text-xl font-normal text-slate-400 transition group-open:rotate-45">+</span></h3></summary><div className="border-t border-slate-100 px-5 py-5 text-sm leading-7 text-slate-600 sm:px-6">{item.answer.split("\n\n").map((paragraph) => <p key={paragraph} className="not-first:mt-4">{paragraph}</p>)}</div></details>)}
            </div>

            <aside className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
              <h2 className="text-sm font-bold text-slate-950">정책 기준</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">본 사이트는 2026년 8월 20일 기준 국토교통부·대도시권광역교통위원회의 공식 모두의카드 안내를 참고하여 제작되었습니다.</p>
              <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap">
                <a href="https://www.molit.go.kr/mta/USR/WPGE0201/m_37187/DTL.jsp" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-700 underline decoration-blue-200 underline-offset-4 hover:text-blue-800">대도시권광역교통위원회 모두의카드 안내 ↗</a>
                <span aria-hidden="true" className="hidden text-slate-300 sm:inline">|</span>
                <a href="https://korea-pass.kr/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-700 underline decoration-blue-200 underline-offset-4 hover:text-blue-800">K-PASS 공식 누리집 ↗</a>
              </div>
              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] text-blue-700">i</span>꼭 확인해주세요</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">본 사이트는 정부 또는 K-PASS 운영기관의 공식 사이트가 아닌 개인 편의용 예상 계산 서비스입니다.</p>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 px-5 py-10 text-slate-400 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl border-b border-slate-800 pb-8"><div className="flex items-center gap-2.5 text-white"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-extrabold">K</span><span className="font-bold">K-PASS 환급 계산기</span></div><div className="mt-5 space-y-1.5 text-sm leading-6"><p>K-PASS 환급 계산기는 이용자의 편의를 위한 예상 계산 서비스입니다.</p><p>실제 환급액 및 적용 기준은 공식 K-PASS·모두의카드 정책에 따라 달라질 수 있습니다.</p></div></div>
        <p className="mx-auto mt-6 max-w-6xl text-xs text-slate-500">© 2026 K-PASS 환급 계산기</p>
      </footer>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, inverted = false }: { eyebrow: string; title: string; description?: string; inverted?: boolean }) {
  return <div className="text-center"><p className={`text-sm font-bold tracking-wider ${inverted ? "text-blue-100" : "text-blue-600"}`}>{eyebrow}</p><h2 className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${inverted ? "text-white" : "text-slate-950"}`}>{title}</h2>{description && <p className={`mx-auto mt-4 max-w-2xl leading-7 ${inverted ? "text-blue-100" : "text-slate-600"}`}>{description}</p>}</div>;
}
