"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import {
  FormInput,
  FormPassword,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormCheckboxGroup,
  FormSwitch,
  FormRadioGroup,
  FormSlider,
  FormDatePicker,
  FormTagsInput,
  FormFileInput,
  FormRating,
  FormColorPicker,
  FormOtpInput,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  User,
  Globe,
  DollarSign,
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

// Comprehensive Zod schema covering all inputs
const showcaseSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  portfolioUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  salaryExpectation: z.number().min(1000, "Minimum salary is 1,000"),
  bio: z.string().max(200, "Bio cannot exceed 200 characters").optional(),
  experienceLevel: z.string().min(1, "Please select experience level"),
  accountType: z.string().min(1, "Please select account type"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  tags: z.array(z.string()).min(1, "Add at least one interest tag"),
  emailNotifications: z.boolean(),
  twoFactorAuth: z.boolean(),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms to proceed",
  }),
  satisfactionScore: z.number().min(0).max(100),
  startDate: z.string().min(1, "Start date is required"),
  feedbackRating: z.number().min(1, "Please provide a rating (1-5 stars)"),
  themeColor: z.string(),
  securityPin: z.string().length(6, "Security PIN must be exactly 6 digits"),
  resumeFile: z.any().optional(),
});

type ShowcaseFormValues = z.infer<typeof showcaseSchema>;

const initialValues: ShowcaseFormValues = {
  fullName: "Jane Developer",
  email: "jane.dev@example.com",
  password: "SuperSecretPassword123",
  portfolioUrl: "https://janedev.io",
  salaryExpectation: 85000,
  bio: "Full-stack engineer passionate about Next.js, Apollo GraphQL, and MongoDB.",
  experienceLevel: "senior",
  accountType: "pro",
  skills: ["typescript", "graphql"],
  tags: ["FullStack", "NextJS", "MongoDB"],
  emailNotifications: true,
  twoFactorAuth: false,
  agreedToTerms: true,
  satisfactionScore: 85,
  startDate: new Date().toISOString().split("T")[0],
  feedbackRating: 5,
  themeColor: "#6366f1",
  securityPin: "123456",
  resumeFile: null,
};

export function MasterFormShowcase() {
  const [submittedData, setSubmittedData] = useState<ShowcaseFormValues | null>(null);

  const form = useForm<ShowcaseFormValues>({
    resolver: zodResolver(showcaseSchema),
    defaultValues: initialValues,
  });

  const onSubmit = (values: ShowcaseFormValues) => {
    setSubmittedData(values);
  };

  const handleReset = () => {
    form.reset(initialValues);
    setSubmittedData(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="frosted-glass-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#e5e5e5]/10 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-[#e5e5e5]/15 bg-white/5 text-[11px] text-[#ededed]">
                <Sparkles className="size-3 text-[#6b62f2]" />
                All Form Wrappers Matrix
              </div>
              <h3 className="text-xl font-medium text-[#ededed]">
                Form Input Combinations
              </h3>
              <p className="text-xs text-[#c2c2c2]">
                Restrained dark UI with live Zod validation and auto-type conversion.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-[#c2c2c2] hover:text-white px-3 py-1.5 rounded-full border border-[#e5e5e5]/15 hover:border-[#e5e5e5]/30 transition-colors"
            >
              <RotateCcw className="size-3 text-[#686868]" />
              Reset Defaults
            </button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* 1. Text & Identity Inputs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#686868]">
                  <span>01 / TEXT & IDENTITY WRAPPERS</span>
                  <Separator className="w-1/2 bg-[#e5e5e5]/10" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    control={form.control}
                    name="fullName"
                    label="Full Name"
                    placeholder="Jane Doe"
                    leftIcon={<User className="size-4" />}
                  />

                  <FormInput
                    control={form.control}
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="jane@example.com"
                    leftIcon={<Mail className="size-4" />}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormPassword
                    control={form.control}
                    name="password"
                    label="Account Password"
                    description="Toggle show/hide password"
                  />

                  <FormInput
                    control={form.control}
                    name="portfolioUrl"
                    label="Portfolio Website"
                    placeholder="https://..."
                    leftIcon={<Globe className="size-4" />}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    control={form.control}
                    name="salaryExpectation"
                    label="Salary Expectation"
                    type="number"
                    leftIcon={<DollarSign className="size-4" />}
                    suffixText="USD/yr"
                  />

                  <FormSelect
                    control={form.control}
                    name="experienceLevel"
                    label="Experience Level"
                    placeholder="Select level"
                    options={[
                      { label: "Junior Developer (0-2 yrs)", value: "junior" },
                      { label: "Mid-level Engineer (2-5 yrs)", value: "mid" },
                      { label: "Senior Engineer (5+ yrs)", value: "senior" },
                      { label: "Lead / Principal Architect", value: "lead" },
                    ]}
                  />
                </div>

                <FormTextarea
                  control={form.control}
                  name="bio"
                  label="Professional Bio"
                  placeholder="Briefly describe your background..."
                  maxLength={200}
                  showCount
                />
              </div>

              {/* 2. Selection & Radio Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#686868]">
                  <span>02 / SELECTION & RADIO CARD WRAPPERS</span>
                  <Separator className="w-1/2 bg-[#e5e5e5]/10" />
                </div>

                <FormRadioGroup
                  control={form.control}
                  name="accountType"
                  label="Membership Plan"
                  description="Choose your account tier"
                  variant="cards"
                  gridCols={3}
                  options={[
                    {
                      value: "free",
                      label: "Starter",
                      description: "Standard platform access",
                      icon: <GraduationCap className="size-4" />,
                    },
                    {
                      value: "pro",
                      label: "Pro Tier",
                      description: "Unlimited GraphQL tests",
                      icon: <Sparkles className="size-4 text-amber-400" />,
                    },
                    {
                      value: "enterprise",
                      label: "Enterprise",
                      description: "Dedicated workspace",
                      icon: <Briefcase className="size-4 text-primary" />,
                    },
                  ]}
                />

                <FormCheckboxGroup
                  control={form.control}
                  name="skills"
                  label="Core Frameworks & Tools"
                  description="Multi-select array checkbox wrapper"
                  gridCols={3}
                  options={[
                    {
                      id: "typescript",
                      label: "TypeScript",
                      description: "Strict typing",
                    },
                    { id: "graphql", label: "GraphQL", description: "Apollo Server" },
                    { id: "nextjs", label: "Next.js 16", description: "App Router" },
                    { id: "mongodb", label: "MongoDB", description: "Mongoose ORM" },
                    { id: "tailwind", label: "Tailwind CSS", description: "v4 Styling" },
                    { id: "shadcn", label: "shadcn/ui", description: "Dimension tokens" },
                  ]}
                />

                <FormTagsInput
                  control={form.control}
                  name="tags"
                  label="Focus Area Badges"
                  description="Press Enter or comma to create a new tag pill"
                  placeholder="e.g. AI, GraphQL, DevOps..."
                />
              </div>

              {/* 3. Slider, Date, Rating, Color, OTP */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#686868]">
                  <span>03 / NUMERIC, DATE & MEDIA WRAPPERS</span>
                  <Separator className="w-1/2 bg-[#e5e5e5]/10" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormSlider
                    control={form.control}
                    name="satisfactionScore"
                    label="Proficiency Metric"
                    min={0}
                    max={100}
                    step={5}
                    unit="%"
                  />

                  <FormDatePicker
                    control={form.control}
                    name="startDate"
                    label="Start Date"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormRating
                    control={form.control}
                    name="feedbackRating"
                    label="Platform Rating"
                  />

                  <FormColorPicker
                    control={form.control}
                    name="themeColor"
                    label="Profile Color"
                    description="Preset palette or hex input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                  <FormOtpInput
                    control={form.control}
                    name="securityPin"
                    label="Security 6-Digit PIN"
                    description="Segmented OTP input wrapper"
                    maxLength={6}
                  />

                  <FormFileInput
                    control={form.control}
                    name="resumeFile"
                    label="CV / Resume Document"
                    accept=".pdf,.doc,.docx"
                    description="Drag & drop upload zone"
                  />
                </div>
              </div>

              {/* 4. Switches & Agreements */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#686868]">
                  <span>04 / SWITCHES & AGREEMENTS</span>
                  <Separator className="w-1/2 bg-[#e5e5e5]/10" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSwitch
                    control={form.control}
                    name="emailNotifications"
                    label="Email Alerts"
                    description="Receive test notifications"
                  />

                  <FormSwitch
                    control={form.control}
                    name="twoFactorAuth"
                    label="Two-Factor Auth"
                    description="Require PIN on sign in"
                  />
                </div>

                <FormCheckbox
                  control={form.control}
                  name="agreedToTerms"
                  variant="card"
                  label="Accept Terms & Honor Code"
                  description="I agree to follow the UG AlumniSphere academic conduct and platform guidelines."
                />
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-[#e5e5e5]/10">
                <Button
                  type="submit"
                  className="rounded-full bg-white text-[#161616] hover:bg-white/90 font-medium text-xs px-6 py-2 shadow-xs"
                >
                  <CheckCircle2 className="size-4 mr-1.5" />
                  Validate & Submit Form
                </Button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center text-xs text-[#c2c2c2] hover:text-white px-4 py-2 rounded-full border border-[#e5e5e5]/15 hover:border-[#e5e5e5]/30 transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Live Form Inspector Sidebar */}
      <div className="space-y-6">
        <div className="frosted-glass-card p-6 sticky top-24 space-y-4">
          <div className="flex items-center justify-between border-b border-[#e5e5e5]/10 pb-3">
            <div>
              <h4 className="text-sm font-medium text-[#ededed]">Live Form State</h4>
              <p className="text-[11px] text-[#686868]">
                Real-time react-hook-form watcher
              </p>
            </div>
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full border ${
                form.formState.isValid
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-[#e5e5e5]/15 bg-white/5 text-[#c2c2c2]"
              }`}
            >
              {form.formState.isValid ? "Valid" : "Validating"}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-[#686868] flex items-center justify-between font-mono">
              <span>ERRORS ({Object.keys(form.formState.errors).length})</span>
            </div>
            {Object.keys(form.formState.errors).length > 0 ? (
              <div className="p-3 bg-red-950/30 border border-red-500/30 text-red-300 text-xs rounded-[10px] space-y-1 font-mono">
                {Object.entries(form.formState.errors).map(([key, err]) => (
                  <div key={key}>
                    • {key}: {String(err?.message || "Invalid")}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2.5 bg-[#161616] border border-[#e5e5e5]/10 text-emerald-400 text-xs rounded-[10px] flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                All input fields are valid
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-[#686868]">JSON VALUES:</div>
            <pre className="p-3 rounded-[10px] bg-[#161616] border border-[#e5e5e5]/10 font-mono text-[11px] text-[#c2c2c2] overflow-x-auto max-h-[380px] overflow-y-auto">
              {JSON.stringify(form.watch(), null, 2)}
            </pre>
          </div>

          {submittedData && (
            <div className="p-3 rounded-[10px] bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
              <span>Form submitted at {new Date().toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
