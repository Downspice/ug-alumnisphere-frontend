"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { AuthStage } from "@/components/layout/auth-stage";
import { useAuth } from "@/components/providers/auth-provider";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { FormPassword } from "@/components/forms/form-password";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

const DEMO_PASSWORD = "AlumniSphere#2026";

const DEMO_ACCOUNTS = [
  {
    role: "Alumni",
    name: "Ama Boateng",
    email: "alumni.demo@alumnisphere.ug",
  },
  {
    role: "Student",
    name: "Kwame Mensah",
    email: "student.demo@alumnisphere.ug",
  },
  {
    role: "Admin",
    name: "Administrator",
    email: "admin@alumnisphere.ug",
  },
] as const;

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
    <AuthStage
      kicker="Legon workspace"
      title="Sign in to AlumniSphere"
      description="Use the email you registered with. Sessions last seven days. Suspended accounts cannot sign in."
      footer={
        <p className="text-xs text-[#686868] text-center">
          New to the University of Ghana network?{" "}
          <Link
            href="/register"
            className="text-[#ba8f4a] underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      }
    >
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
            placeholder="you@st.ug.edu.gh"
            leftIcon={<Mail className="size-4" />}
          />
          <FormPassword control={form.control} name="password" label="Password" />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Enter Legon"}
          </Button>
        </form>
      </Form>

      <div className="rounded-[16px] border border-[#ba8f4a]/25 bg-[#ba8f4a]/5 p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#ba8f4a]">
            Test accounts
          </p>
          <p className="text-xs text-[#c2c2c2]">
            Password for every demo account:{" "}
            <span className="font-mono text-[#ededed]">{DEMO_PASSWORD}</span>
          </p>
        </div>
        <div className="space-y-2">
          {DEMO_ACCOUNTS.map((account) => (
            <div
              key={account.email}
              className="flex items-center justify-between gap-3 rounded-[12px] border border-[#e5e5e5]/10 bg-[#0a0a0a]/40 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#ededed]">
                  {account.role}
                  <span className="text-[#686868] font-normal"> · {account.name}</span>
                </p>
                <p className="text-[11px] font-mono text-[#c2c2c2] truncate">
                  {account.email}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  form.setValue("email", account.email, { shouldValidate: true });
                  form.setValue("password", DEMO_PASSWORD, { shouldValidate: true });
                }}
              >
                Use
              </Button>
            </div>
          ))}
        </div>
      </div>
    </AuthStage>
  );
}
