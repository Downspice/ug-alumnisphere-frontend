"use client";

import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand/brand-mark";
import { cn } from "@/lib/utils";

const PILLARS = [
  {
    title: "Aya",
    copy: "The fern that grows straight — truthfulness and integrity.",
  },
  {
    title: "Dweninmentoaso",
    copy: "Interlocking ram horns — strength and progress with purpose.",
  },
  {
    title: "Legon, 1948",
    copy: "From the University College of the Gold Coast to Ghana’s premier university.",
  },
];

export function AuthStage({
  kicker,
  title,
  description,
  children,
  footer,
  wide = false,
}: {
  kicker: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "url(/brand/aya-pattern.svg)",
            backgroundSize: "88px 88px",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ba8f4a]/70 to-transparent" />
      </div>

      <div className="relative min-h-screen lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <aside className="relative min-h-[42vh] lg:min-h-screen overflow-hidden">
          <img
            src="/brand/legon-dusk.jpg"
            alt="University of Ghana, Legon campus at dusk"
            className="ug-kenburns absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#232559]/70 to-[#232559]/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/80 hidden lg:block" />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-10 lg:p-14">
            <BrandMark href="/" size="sm" />

            <div className="space-y-6 max-w-lg mt-16 lg:mt-0">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#ba8f4a] animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both">
                University of Ghana · Legon
              </p>
              <h1 className="text-4xl sm:text-5xl font-medium tracking-[-0.035em] text-white leading-[1.08] animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both delay-150">
                Integri Procedamus
              </h1>
              <p className="text-[#e8d9b8] text-sm sm:text-base leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both delay-300">
                Progress with integrity. AlumniSphere is the Legon network for alumni and
                students — identity, mentorship, work, and giving under one verified roof.
              </p>
              <ul className="hidden md:grid gap-3 pt-2">
                {PILLARS.map((item, index) => (
                  <li
                    key={item.title}
                    className="rounded-[16px] border border-[#ba8f4a]/25 bg-[#0a0a0a]/45 backdrop-blur-md px-4 py-3 animate-in fade-in slide-in-from-left-2 duration-700 fill-mode-both"
                    style={{ animationDelay: `${200 + index * 140}ms` }}
                  >
                    <p className="text-xs uppercase tracking-[0.14em] text-[#ba8f4a]">
                      {item.title}
                    </p>
                    <p className="text-sm text-[#ededed]/90 mt-1">{item.copy}</p>
                  </li>
                ))}
              </ul>
            </div>

            <p className="hidden lg:block text-[11px] text-[#c2c2c2]/80 tracking-wide">
              Crest by A. M. Opoku · Motto by Alexander Adum Kwapong
            </p>
          </div>
        </aside>

        <section className="relative flex items-center justify-center px-4 py-10 sm:px-8 lg:py-16">
          <div
            className={cn(
              "w-full space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500",
              wide ? "max-w-[500px]" : "max-w-[440px]"
            )}
          >
            <div className="frosted-glass-card p-6 sm:p-8 space-y-6 border-[#ba8f4a]/20">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#ba8f4a]">
                  {kicker}
                </p>
                <h2 className="text-2xl font-medium tracking-tight">{title}</h2>
                <p className="text-sm text-[#c2c2c2] leading-relaxed">{description}</p>
              </div>
              {children}
            </div>
            {footer}
          </div>
        </section>
      </div>
    </div>
  );
}
