"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BadgeCheck, ShieldAlert, UserRound } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { getProfileCompletion } from "@/lib/profile";
import { cn } from "@/lib/utils";

const STATUS_COPY: Record<string, { label: string; message: string }> = {
  unverified: {
    label: "Unverified",
    message:
      "Submit alumni verification when you are ready. Students can complete a profile without it.",
  },
  pending: {
    label: "Pending review",
    message: "An administrator is reviewing your verification request.",
  },
  verified: {
    label: "Verified alumni",
    message: "Your identity has been confirmed by an administrator.",
  },
  rejected: {
    label: "Verification rejected",
    message: "Review the reason on your profile and submit again if needed.",
  },
};

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState variant="cards" count={2} message="Loading your workspace..." />;
  }

  if (!user) {
    return (
      <EmptyState
        title="Session expired"
        description="Sign in again to open your AlumniSphere workspace."
        actionLabel="Sign in"
        onAction={() => router.push("/login")}
      />
    );
  }

  const completion = getProfileCompletion(user);
  const status = STATUS_COPY[user.verificationStatus] ?? STATUS_COPY.unverified;

  return (
    <div className="space-y-6">
      <section className="gradient-hero-panel p-6 sm:p-8 space-y-4">
        <Badge variant="secondary" className="capitalize">
          {user.role}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
          Welcome back, {user.name.split(" ")[0]}.
        </h1>
        <p className="text-sm text-[#c2c2c2] max-w-xl">
          {user.headline ||
            "Complete your professional profile so classmates and mentors can find you."}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/profile" className={cn(buttonVariants())}>
            {completion < 80 ? "Complete profile" : "View profile"}
            <ArrowRight className="size-3.5" />
          </Link>
          {user.role === "alumni" && user.verificationStatus !== "verified" && (
            <Link href="/profile" className={cn(buttonVariants({ variant: "outline" }))}>
              Request verification
            </Link>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="frosted-glass-card p-5 space-y-2">
          <div className="text-xs text-[#686868]">Profile completion</div>
          <div className="text-2xl font-medium">{completion}%</div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
        <div className="frosted-glass-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#686868]">Verification</span>
            {user.verificationStatus === "verified" ? (
              <BadgeCheck className="size-4 text-[#ededed]" />
            ) : (
              <ShieldAlert className="size-4 text-[#c2c2c2]" />
            )}
          </div>
          <div className="text-base font-medium">{status.label}</div>
          <p className="text-xs text-[#c2c2c2] leading-relaxed">{status.message}</p>
        </div>
        <div className="frosted-glass-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#686868]">Workspace</span>
            <UserRound className="size-4 text-[#c2c2c2]" />
          </div>
          <div className="text-base font-medium">{user.email}</div>
          <p className="text-xs text-[#c2c2c2]">
            Jobs, mentors, events, and giving records are live.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href="/jobs"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Jobs
            </Link>
            <Link
              href="/campaigns"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Campaigns
            </Link>
            <Link
              href="/notifications"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Alerts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
