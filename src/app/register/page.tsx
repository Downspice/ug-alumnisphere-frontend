"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Mail, UserRound } from "lucide-react";
import { AuthStage } from "@/components/layout/auth-stage";
import { useAuth } from "@/components/providers/auth-provider";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { FormPassword } from "@/components/forms/form-password";
import { FormRadioGroup } from "@/components/forms/form-radio-group";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
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
    <AuthStage
      wide
      kicker="Join the network"
      title="Become part of Legon"
      description="Alumni can later submit verification. Students join the same network. Administrators are provisioned by the University — you cannot self-register as one."
      footer={
        <p className="text-xs text-[#686868] text-center">
          Already on AlumniSphere?{" "}
          <Link
            href="/login"
            className="text-[#ba8f4a] underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      {form.formState.errors.root?.message && (
        <ErrorState
          compact
          title="Registration failed"
          message={form.formState.errors.root.message}
        />
      )}

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
            placeholder="you@st.ug.edu.gh"
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
            {loading ? "Creating account…" : "Join AlumniSphere"}
          </Button>
        </form>
      </Form>
    </AuthStage>
  );
}
