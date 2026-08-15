"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Mail, UserRound } from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { BrandMark } from "@/components/brand/brand-mark";
import { useAuth } from "@/components/providers/auth-provider";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { FormPassword } from "@/components/forms/form-password";
import { FormRadioGroup } from "@/components/forms/form-radio-group";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "alumni",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    await register({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      <div className="dusk-violet-wash fixed top-0 inset-x-0 z-50 pointer-events-none" />
      <PublicHeader />
      <main className="max-w-[560px] mx-auto px-4 py-12">
        <div className="frosted-glass-card p-6 sm:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <BrandMark href="/" size="md" />
          <div className="space-y-2">
            <h1 className="text-2xl font-medium tracking-tight">Join AlumniSphere</h1>
            <p className="text-sm text-[#c2c2c2]">
              Alumni can later submit verification. Students join the same network with a
              student role. Administrators are provisioned separately.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                control={form.control}
                name="name"
                label="Full name"
                placeholder="Ama Boateng"
                leftIcon={<UserRound className="size-4" />}
              />
              <FormInput
                control={form.control}
                name="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                leftIcon={<Mail className="size-4" />}
              />
              <FormRadioGroup
                control={form.control}
                name="role"
                label="I am joining as"
                variant="cards"
                gridCols={2}
                options={[
                  {
                    value: "alumni",
                    label: "Alumni",
                    description: "Graduate of the University of Ghana",
                    icon: <GraduationCap className="size-3.5" />,
                  },
                  {
                    value: "student",
                    label: "Student",
                    description: "Currently enrolled at UG",
                    icon: <UserRound className="size-3.5" />,
                  },
                ]}
              />
              <FormPassword
                control={form.control}
                name="password"
                label="Password"
                description="At least 8 characters, with a letter and a number"
              />
              <FormPassword
                control={form.control}
                name="confirmPassword"
                label="Confirm password"
                showLockIcon={false}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </Form>

          <p className="text-xs text-[#686868] text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#ededed] underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
