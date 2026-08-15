"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BrandMark } from "@/components/brand/brand-mark";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-3 z-40 px-4 sm:px-6 max-w-[1100px] mx-auto mt-3">
      <nav className="frosted-floating-nav px-4 sm:px-6 py-2.5 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-500">
        <BrandMark href="/" size="sm" />

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Link href="/home" className={cn(buttonVariants())}>
              Open workspace
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "hidden sm:inline-flex"
                )}
              >
                Sign in
              </Link>
              <Link href="/register" className={cn(buttonVariants())}>
                Join the network
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
