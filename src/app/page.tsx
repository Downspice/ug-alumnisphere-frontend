"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CalendarDays,
  GraduationCap,
  HeartHandshake,
  Landmark,
  MessagesSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { BrandMark } from "@/components/brand/brand-mark";
import { buttonVariants } from "@/components/ui/button";
import { useHealth } from "@/hooks/api";
import { cn } from "@/lib/utils";

const PILLARS = [
  {
    title: "Aya",
    copy: "The fern that grows straight — truthfulness and integrity, the same charge as Integri Procedamus.",
  },
  {
    title: "Dweninmentoaso",
    copy: "Interlocking ram horns — strength in unity, and progress with purpose across the Legon network.",
  },
  {
    title: "Legon, 1948",
    copy: "From the University College of the Gold Coast to Ghana’s premier university — still one community.",
  },
];

const FEATURES = [
  {
    title: "Professional identity",
    copy: "Keep a living profile of your programme, career, skills, and openness to work or mentor.",
    icon: GraduationCap,
  },
  {
    title: "Alumni directory",
    copy: "Find classmates by year, faculty, industry, location, and shared skills across colleges.",
    icon: Users,
  },
  {
    title: "Careers",
    copy: "Discover roles posted by the network and apply with a CV stored against your verified identity.",
    icon: Briefcase,
  },
  {
    title: "Mentorship",
    copy: "Request structured guidance from alumni who have already walked the path you are on.",
    icon: HeartHandshake,
  },
  {
    title: "Events",
    copy: "Register for lectures, reunions, and campus gatherings published by the administration.",
    icon: CalendarDays,
  },
  {
    title: "Giving",
    copy: "Pledge toward published fundraising campaigns and keep a record of your contribution.",
    icon: Landmark,
  },
];

const COLLEGES = [
  "College of Humanities",
  "College of Education",
  "College of Basic and Applied Sciences",
  "College of Health Sciences",
];

const MARKERS = [
  { value: "1948", label: "Founded at Legon" },
  { value: "Integri Procedamus", label: "University motto" },
  { value: "One network", label: "Alumni, students, staff" },
];

export default function LandingPage() {
  const { isConnected: isBackendConnected, loading: healthLoading } = useHealth();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "url(/brand/aya-pattern.svg)",
            backgroundSize: "88px 88px",
          }}
        />
      </div>
      <div className="ug-gold-hairline fixed top-0 inset-x-0 z-50 pointer-events-none" />
      <PublicHeader overlay />

      <section className="relative min-h-[100svh] overflow-hidden">
        <img
          src="/brand/legon-dusk.jpg"
          alt="University of Ghana, Legon campus at dusk"
          className="ug-kenburns absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#232559]/55 to-[#232559]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/70 via-[#0a0a0a]/25 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-soft-light"
          style={{
            backgroundImage: "url(/brand/aya-pattern.svg)",
            backgroundSize: "96px 96px",
          }}
        />

        <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 pt-24 pb-16 sm:pt-32 sm:pb-24">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#ba8f4a]/40 bg-[#0a0a0a]/40 backdrop-blur-md text-xs text-[#ededed] animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both">
                <span className="ug-gold-pulse size-1.5 rounded-full bg-[#ba8f4a]" />
                University of Ghana · Legon
              </div>
              <h1 className="text-4xl sm:text-6xl font-medium tracking-[-0.035em] text-white leading-[1.08] animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-150">
                Reconnect. Mentor. Build what comes next.
              </h1>
              <p className="text-[#e8d9b8] text-base sm:text-lg leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-200">
                AlumniSphere is the Legon workspace for alumni, students, and
                administrators — professional identity, communities, opportunities, and
                giving under one verified roof.
              </p>
              <div className="space-y-3 pt-1">
                {[
                  "Verified alumni identities with private document review",
                  "Directory, connections, and asynchronous messaging",
                  "Jobs, events, mentorship, and goal-based fundraising records",
                ].map((item, index) => (
                  <div
                    key={item}
                    className={cn(
                      "flex items-center gap-3 text-sm text-[#ededed] animate-in fade-in slide-in-from-left-3 duration-700 fill-mode-both",
                      index === 0 && "delay-300",
                      index === 1 && "delay-500",
                      index === 2 && "delay-700"
                    )}
                  >
                    <div className="p-1 rounded-[4px] bg-white text-black shrink-0">
                      <ShieldCheck className="size-3.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-4 animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both delay-700">
                <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
                  Create your account
                  <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                >
                  Sign in
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-center gap-4 pr-2 animate-in fade-in zoom-in-95 duration-700 fill-mode-both delay-300">
              <div className="ug-crest-float">
                <BrandMark href={null} size="lg" stacked showWordmark={false} />
              </div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#ba8f4a]">
                Integri Procedamus
              </p>
              <p className="text-[11px] text-[#c2c2c2]/80 text-center max-w-[12rem] leading-relaxed">
                Progress with integrity
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 py-12 space-y-12">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PILLARS.map((item, index) => (
            <article
              key={item.title}
              className={cn(
                "rounded-[24px] border border-[#ba8f4a]/25 bg-[#161616]/80 backdrop-blur-md p-6 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both",
                index === 0 && "delay-100",
                index === 1 && "delay-200",
                index === 2 && "delay-300"
              )}
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#ba8f4a]">
                {item.title}
              </p>
              <p className="text-sm text-[#c2c2c2] leading-relaxed">{item.copy}</p>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MARKERS.map((marker, index) => (
            <div
              key={marker.label}
              className={cn(
                "frosted-glass-card px-5 py-6 text-center space-y-1 animate-in fade-in zoom-in-95 duration-700 fill-mode-both",
                index === 0 && "delay-150",
                index === 1 && "delay-300",
                index === 2 && "delay-500"
              )}
            >
              <p className="text-lg sm:text-xl font-medium tracking-tight text-white">
                {marker.value}
              </p>
              <p className="text-xs uppercase tracking-[0.14em] text-[#686868]">
                {marker.label}
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#ba8f4a]">
                The network
              </p>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                Life after Balme, still at Legon
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="frosted-glass-card p-6 space-y-3 border-[#ba8f4a]/10 animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both"
                  style={{ animationDelay: `${120 + index * 90}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#686868]">
                      0{index + 1} / NETWORK
                    </span>
                    <Icon className="size-4 text-[#ba8f4a]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#ededed]">{feature.title}</h3>
                  <p className="text-sm text-[#c2c2c2] leading-relaxed">{feature.copy}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="frosted-glass-card p-6 sm:p-8 space-y-5 border-[#ba8f4a]/15 animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-[6px] bg-[#ba8f4a]/15">
              <Building2 className="size-4 text-[#ba8f4a]" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#ba8f4a]">
                Colleges of the University of Ghana
              </p>
              <h3 className="text-lg font-medium text-[#ededed]">
                One campus, four colleges — one alumni body
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COLLEGES.map((college, index) => (
              <div
                key={college}
                className="rounded-[16px] border border-[#e5e5e5]/12 bg-white/[0.03] px-4 py-3 text-sm text-[#c2c2c2] animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both"
                style={{ animationDelay: `${80 + index * 80}ms` }}
              >
                {college}
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[24px] border border-[#ba8f4a]/25 p-8 sm:p-12 animate-in fade-in zoom-in-95 duration-700 fill-mode-both">
          <div className="absolute inset-0 bg-gradient-to-br from-[#232559]/50 via-[#0a0a0a] to-[#0a0a0a]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "url(/brand/aya-pattern.svg)",
              backgroundSize: "80px 80px",
            }}
          />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-xl space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#ba8f4a]">
                Integri Procedamus
              </p>
              <h2 className="text-3xl sm:text-4xl font-medium tracking-[-0.03em] text-white leading-[1.12]">
                Progress with integrity — from Legon to wherever you practise.
              </h2>
              <p className="text-sm text-[#c2c2c2] leading-relaxed">
                Crest by A. M. Opoku. Motto by Alexander Adum Kwapong. AlumniSphere
                carries that charge into a verified digital network for the University of
                Ghana.
              </p>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
              <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
                Join the network
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
              >
                I already have an account
              </Link>
            </div>
          </div>
        </section>

        <section className="frosted-glass-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in fade-in duration-700 fill-mode-both">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-[6px] bg-white/5">
              <MessagesSquare className="size-4 text-[#c2c2c2]" />
            </div>
            <div>
              <h4 className="text-sm font-medium">API status</h4>
              <p className="text-xs text-[#686868]">
                {healthLoading
                  ? "Checking GraphQL health…"
                  : isBackendConnected
                    ? "Backend connected"
                    : "Backend offline — start with pnpm dev:backend"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`h-2 w-2 rounded-full ${
                isBackendConnected
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                  : "bg-amber-400"
              }`}
            />
            <HeartHandshake className="size-3.5 text-[#686868]" />
            <span className="text-[#c2c2c2]">MongoDB remains the system of record</span>
          </div>
        </section>

        <footer className="pb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-[#686868]">
          <div className="flex items-center gap-3">
            <BrandMark href={null} size="sm" showWordmark={false} />
            <p>University of Ghana · AlumniSphere · Integri Procedamus</p>
          </div>
          <p>Progress with integrity</p>
        </footer>
      </main>
    </div>
  );
}
