"use client";

import { useState } from "react";

const menuItems = [
  ["환급 계산기", "#calculator"],
  ["K-PASS 안내", "#about"],
  ["이용자 유형", "#user-types"],
  ["자주 묻는 질문", "#faq"],
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <a href="#top" onClick={() => setIsMenuOpen(false)} className="flex min-w-0 items-center gap-2.5 font-bold tracking-tight text-slate-950">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-extrabold text-white shadow-sm">K</span>
            <span className="truncate text-base whitespace-nowrap sm:text-xl">K-PASS 환급 계산기</span>
          </a>

          <nav aria-label="주요 메뉴" className="hidden items-center gap-6 text-sm font-medium whitespace-nowrap text-slate-600 md:flex">
            {menuItems.map(([label, href]) => <a key={href} href={href} className="transition hover:text-blue-600">{label}</a>)}
          </nav>

          <button type="button" aria-expanded={isMenuOpen} aria-controls="mobile-menu" aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"} onClick={() => setIsMenuOpen((open) => !open)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:hidden">
            <span aria-hidden="true" className="text-xl leading-none">{isMenuOpen ? "×" : "☰"}</span>
          </button>
        </div>

        {isMenuOpen && (
          <nav id="mobile-menu" aria-label="모바일 메뉴" className="border-t border-slate-100 pb-4 pt-2 md:hidden">
            <div className="grid gap-1">
              {menuItems.map(([label, href]) => (
                <a key={href} href={href} onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">{label}</a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
