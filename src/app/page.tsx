"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  GraduationCap,
  HeartHandshake,
  MessagesSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { BrandMark } from "@/components/brand/brand-mark";
import { buttonVariants } from "@/components/ui/button";
import { useHealth } from "@/hooks/api";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    title: "Professional identity",
    copy: "Keep a living profile of your programme, career, skills, and openness to work or mentor.",
    icon: GraduationCap,
  },
  {
    title: "Alumni directory",
    copy: "Find classmates by year, faculty, industry, location, and shared skills.",
    icon: Users,
  },
  {
    title: "Careers and mentorship",
    copy: "Discover roles, apply with a CV, and request structured mentorship.",
    icon: Briefcase,
  },
  {
    title: "Events and giving",
    copy: "Register for campus events and contribute to published fundraising campaigns.",
    icon: CalendarDays,
  },
];

export default function LandingPage() {
  const { isConnected: isBackendConnected, loading: healthLoading } = useHealth();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] relative overflow-x-hidden">
      <div className="dusk-violet-wash fixed top-0 inset-x-0 z-50 pointer-events-none" />
      <PublicHeader />

      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10 space-y-12">
        <section className="gradient-hero-panel p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ba8f4a]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center relative z-10">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#ba8f4a]/35 bg-[#ba8f4a]/10 text-xs text-[#ededed]">
                <span className="size-1.5 rounded-full bg-[#ba8f4a]" />
                University of Ghana · Integri Procedamus
              </div>
              <h1 className="text-4xl sm:text-6xl font-medium tracking-[-0.035em] text-white leading-[1.08]">
                Reconnect. Mentor. Build what comes next.
              </h1>
              <p className="text-[#c2c2c2] text-base sm:text-lg leading-relaxed max-w-xl">
                AlumniSphere is a secure workspace for alumni, students, and
                administrators to manage professional identity, communities,
                opportunities, and giving.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "Verified alumni identities with private document review",
                  "Directory, connections, and asynchronous messaging",
                  "Jobs, events, mentorship, and goal-based fundraising records",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-[#ededed]"
                  >
                    <div className="p-1 rounded-[4px] bg-white text-black shrink-0">
                      <ShieldCheck className="size-3.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-4">
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
            <div className="hidden lg:flex flex-col items-center gap-3 pr-4">
              <BrandMark href={null} size="lg" stacked showWordmark={false} />
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#ba8f4a]">
                Integri Procedamus
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="frosted-glass-card p-6 space-y-3 animate-in fade-in duration-500"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#686868]">
                    0{index + 1} / NETWORK
                  </span>
                  <Icon className="size-4 text-[#c2c2c2]" />
                </div>
                <h3 className="text-xl font-medium text-[#ededed]">{feature.title}</h3>
                <p className="text-sm text-[#c2c2c2] leading-relaxed">{feature.copy}</p>
              </div>
            );
          })}
        </section>

        <section className="frosted-glass-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

        <footer className="pb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#686868]">
          <p>University of Ghana · AlumniSphere · Integri Procedamus</p>
          <p>Progress with integrity</p>
        </footer>
      </main>
    </div>
  );
}
