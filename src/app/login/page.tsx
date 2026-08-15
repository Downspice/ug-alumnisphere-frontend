"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { useAuth } from "@/components/providers/auth-provider";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { FormPassword } from "@/components/forms/form-password";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await login(values);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      <div className="dusk-violet-wash fixed top-0 inset-x-0 z-50 pointer-events-none" />
      <PublicHeader />
      <main className="max-w-[480px] mx-auto px-4 py-12">
        <div className="frosted-glass-card p-6 sm:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="space-y-2">
            <h1 className="text-2xl font-medium tracking-tight">Sign in</h1>
            <p className="text-sm text-[#c2c2c2]">
              Use your AlumniSphere email and password. Sessions last seven days.
            </p>
          </div>

          {form.formState.errors.root?.message && (
            <ErrorState
              compact
              title="Sign in failed"
              message={form.formState.errors.root.message}
            />
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                control={form.control}
                name="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                leftIcon={<Mail className="size-4" />}
              />
              <FormPassword control={form.control} name="password" label="Password" />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Signing in…" : "Continue"}
              </Button>
            </form>
          </Form>

          <p className="text-xs text-[#686868] text-center">
            New to the network?{" "}
            <Link
              href="/register"
              className="text-[#ededed] underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
