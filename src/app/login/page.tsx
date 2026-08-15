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
    </AuthStage>
  );
}
