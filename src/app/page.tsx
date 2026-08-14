"use client";

import React from "react";
import { useHealth, useExams, useDeleteExam, useUsers } from "@/hooks/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  CreateExamDialog,
  CreateUserDialog,
  MasterFormShowcase,
} from "@/components/forms";
import {
  Activity,
  Database,
  Server,
  Layers,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Users,
  Code2,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Zap,
  Terminal,
} from "lucide-react";

export default function Home() {
  // Streamlined API hooks
  const {
    health,
    loading: healthLoading,
    isConnected: isBackendConnected,
    refetch: refetchHealth,
  } = useHealth();

  const {
    exams,
    loading: examsLoading,
    error: examsError,
    refetch: refetchExams,
  } = useExams();

  const {
    users,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useUsers();

  const { deleteExam } = useDeleteExam();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] relative overflow-x-hidden selection:bg-[#6b62f2]/30 selection:text-white">
      {/* Dusk Violet Horizontal Glow Wash */}
      <div className="dusk-violet-wash fixed top-0 inset-x-0 z-50 pointer-events-none" />

      {/* Top Status Banner Pill */}
      <div className="pt-4 px-4 flex justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161616]/90 border border-[#e5e5e5]/15 text-xs text-[#c2c2c2] shadow-2xs backdrop-blur-md hover:border-[#e5e5e5]/30 transition-colors">
          <span className="flex items-center justify-center p-0.5 rounded-[4px] bg-white/10 text-white">
            <Sparkles className="size-3 text-white" />
          </span>
          <span>UG AlumniSphere — Full-Stack GraphQL Workspace</span>
          <ArrowRight className="size-3 text-[#686868]" />
        </div>
      </div>

      {/* Floating Frosted Nav Bar (Dimension Style) */}
      <header className="sticky top-3 z-40 px-4 sm:px-6 max-w-[1100px] mx-auto mt-3">
        <nav className="frosted-floating-nav px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-[10px] bg-white text-[#161616] flex items-center justify-center font-medium text-xs tracking-tight shadow-xs">
              UG
            </div>
            <div>
              <div className="font-medium text-sm text-[#ededed] tracking-tight">
                AlumniSphere
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 text-xs border border-[#e5e5e5]/12 rounded-full px-3 py-1 bg-[#161616]/60">
              <span
                className={`h-2 w-2 rounded-full ${
                  isBackendConnected
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                    : "bg-amber-400"
                }`}
              />
              <span className="text-[#c2c2c2] hidden sm:inline">
                {healthLoading
                  ? "Checking..."
                  : isBackendConnected
                    ? "Backend Connected"
                    : "Backend Offline"}
              </span>
            </div>

            <a
              href="http://localhost:4000/graphql"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1 text-xs text-[#c2c2c2] hover:text-white px-3 py-1 rounded-full border border-[#e5e5e5]/12 hover:border-[#e5e5e5]/30 transition-colors"
            >
              <span>GraphQL Sandbox</span>
              <ExternalLink className="size-3 text-[#686868]" />
            </a>

            <CreateExamDialog onSuccess={refetchExams} />
          </div>
        </nav>
      </header>

      {/* Main Container Column */}
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Gradient Hero Panel */}
        <section className="gradient-hero-panel p-8 sm:p-12 relative overflow-hidden">
          {/* Subtle violet ambient spotlight in corner */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#6b62f2]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e5e5e5]/15 bg-white/5 text-xs text-[#ededed]">
              <span className="size-1.5 rounded-full bg-[#6b62f2]" />
              Dusk-lit AI Workspace & GraphQL API
            </div>

            <h1 className="text-4xl sm:text-6xl font-medium tracking-[-0.035em] text-white leading-[1.08]">
              Next.js & Apollo GraphQL Platform
            </h1>

            <p className="text-[#c2c2c2] text-base sm:text-lg font-normal leading-relaxed max-w-xl">
              Type-safe full-stack application built with restrained weight-500
              typography, frosted glass panels, Express.js 5, and MongoDB Mongoose.
            </p>

            {/* Bulleted Feature Rows */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-[#ededed]">
                <div className="p-1 rounded-[4px] bg-white text-black shrink-0">
                  <ShieldCheck className="size-3.5" />
                </div>
                <span>
                  15+ Form Input combinations with Zod validation & Responsive Drawers
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#ededed]">
                <div className="p-1 rounded-[4px] bg-white text-black shrink-0">
                  <Zap className="size-3.5" />
                </div>
                <span>
                  Apollo GraphQL Server on port 4000 with schema & Mongoose resolvers
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#ededed]">
                <div className="p-1 rounded-[4px] bg-white text-black shrink-0">
                  <Terminal className="size-3.5" />
                </div>
                <span>
                  Streamlined client utilities (
                  <code className="font-mono text-xs text-white">apiClient</code>,{" "}
                  <code className="font-mono text-xs text-white">useExams()</code>)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <CreateUserDialog onSuccess={refetchUsers} />
              <a
                href="#forms-showcase"
                className="inline-flex items-center gap-1.5 text-xs text-[#c2c2c2] hover:text-white px-4 py-2 rounded-full border border-[#e5e5e5]/15 hover:border-[#e5e5e5]/30 transition-colors"
              >
                <span>Explore Form Wrappers</span>
                <ArrowRight className="size-3 text-[#686868]" />
              </a>
            </div>
          </div>
        </section>

        {/* System Architecture Frosted Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="frosted-glass-card p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#686868]">01 / LAYER</span>
                <Layers className="size-4 text-[#c2c2c2]" />
              </div>
              <h3 className="text-xl font-medium text-[#ededed]">Next.js 16 App</h3>
              <p className="text-xs text-[#c2c2c2] leading-relaxed">
                App Router, shadcn UI primitives, Tailwind CSS v4, and Apollo Client.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-4">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-[#e5e5e5]/15 bg-white/5 text-[#ededed]">
                shadcn
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-[#e5e5e5]/15 bg-white/5 text-[#ededed]">
                Zod
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-[#e5e5e5]/15 bg-white/5 text-[#ededed]">
                TypeScript
              </span>
            </div>
          </div>

          <div className="frosted-glass-card p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#686868]">02 / BACKEND</span>
                <Server className="size-4 text-[#c2c2c2]" />
              </div>
              <h3 className="text-xl font-medium text-[#ededed]">Express 5 & Apollo</h3>
              <p className="text-xs text-[#c2c2c2] leading-relaxed">
                Apollo Server GraphQL engine, schema typeDefs, and typed resolvers.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-4">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-[#e5e5e5]/15 bg-white/5 text-[#ededed]">
                GraphQL 17
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-[#e5e5e5]/15 bg-white/5 text-[#ededed]">
                Port 4000
              </span>
            </div>
          </div>

          <div className="frosted-glass-card p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#686868]">03 / DATABASE</span>
                <Database className="size-4 text-[#c2c2c2]" />
              </div>
              <h3 className="text-xl font-medium text-[#ededed]">MongoDB & Mongoose</h3>
              <p className="text-xs text-[#c2c2c2] leading-relaxed">
                Persistent document store with Mongoose schemas and connection logic.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-4">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-[#e5e5e5]/15 bg-white/5 text-[#ededed]">
                {health?.database || "Local / Atlas"}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-[#e5e5e5]/15 bg-white/5 text-[#ededed]">
                Schemas
              </span>
            </div>
          </div>
        </section>

        {/* Backend Health Check Panel */}
        <section className="frosted-glass-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-[6px] bg-[#6b62f2]/15 text-[#6b62f2]">
                <Activity className="size-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#ededed]">
                  GraphQL Service Health Monitor
                </h4>
                <p className="text-xs text-[#686868]">
                  Direct query to{" "}
                  <code className="font-mono text-[#c2c2c2]">Query.health</code>
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchHealth()}
              className="rounded-full text-xs border-[#e5e5e5]/15 hover:border-[#e5e5e5]/30"
            >
              Refresh Status
            </Button>
          </div>

          {healthLoading ? (
            <div className="text-xs text-[#686868] py-2">
              Querying GraphQL endpoint...
            </div>
          ) : health ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-[10px] bg-[#161616] border border-[#e5e5e5]/10 space-y-1">
                <div className="text-[#686868]">API Status</div>
                <div className="font-medium text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  {health.status}
                </div>
              </div>
              <div className="p-3 rounded-[10px] bg-[#161616] border border-[#e5e5e5]/10 space-y-1">
                <div className="text-[#686868]">Database</div>
                <div className="font-medium text-[#ededed]">{health.database}</div>
              </div>
              <div className="p-3 rounded-[10px] bg-[#161616] border border-[#e5e5e5]/10 space-y-1">
                <div className="text-[#686868]">Server Uptime</div>
                <div className="font-medium text-[#ededed]">
                  {Math.floor(health.uptime)}s
                </div>
              </div>
              <div className="p-3 rounded-[10px] bg-[#161616] border border-[#e5e5e5]/10 space-y-1">
                <div className="text-[#686868]">Last Ping</div>
                <div className="font-medium text-[#ededed] truncate">
                  {new Date(health.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-[10px] bg-[#161616] border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0 text-amber-400" />
              <span>
                Backend server is not reachable on port 4000. Start it with{" "}
                <code className="font-mono bg-black/40 px-1 py-0.5 rounded">
                  pnpm dev:backend
                </code>
                .
              </span>
            </div>
          )}
        </section>

        {/* Functional Tabs Section */}
        <section id="forms-showcase" className="space-y-6">
          <Tabs defaultValue="forms" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e5e5e5]/10 pb-4">
              <TabsList className="bg-[#161616] p-1 rounded-full border border-[#e5e5e5]/12 flex-wrap h-auto">
                <TabsTrigger
                  value="forms"
                  className="rounded-full text-xs py-1.5 px-4 data-[state=active]:bg-white data-[state=active]:text-[#161616] data-[state=active]:shadow-xs transition-all"
                >
                  <SlidersHorizontal className="size-3.5 mr-1.5" />
                  Form Wrappers Matrix
                </TabsTrigger>
                <TabsTrigger
                  value="exams"
                  className="rounded-full text-xs py-1.5 px-4 data-[state=active]:bg-white data-[state=active]:text-[#161616] data-[state=active]:shadow-xs transition-all"
                >
                  <BookOpen className="size-3.5 mr-1.5" />
                  Exams ({exams.length})
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="rounded-full text-xs py-1.5 px-4 data-[state=active]:bg-white data-[state=active]:text-[#161616] data-[state=active]:shadow-xs transition-all"
                >
                  <Users className="size-3.5 mr-1.5" />
                  Users ({users.length})
                </TabsTrigger>
                <TabsTrigger
                  value="graphql"
                  className="rounded-full text-xs py-1.5 px-4 data-[state=active]:bg-white data-[state=active]:text-[#161616] data-[state=active]:shadow-xs transition-all"
                >
                  <Code2 className="size-3.5 mr-1.5" />
                  API Documentation
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <CreateExamDialog onSuccess={refetchExams} />
                <CreateUserDialog onSuccess={refetchUsers} />
              </div>
            </div>

            {/* All Form Wrappers Matrix Tab */}
            <TabsContent value="forms" className="space-y-4">
              <MasterFormShowcase />
            </TabsContent>

            {/* Exams Tab */}
            <TabsContent value="exams" className="space-y-4">
              {examsLoading ? (
                <LoadingState
                  message="Fetching exams from GraphQL API..."
                  count={3}
                  variant="cards"
                />
              ) : examsError ? (
                <ErrorState
                  title="Failed to Load Exams"
                  message={examsError}
                  onRetry={() => refetchExams()}
                  retryLabel="Retry Query"
                />
              ) : exams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exams.map((exam, index) => (
                    <div
                      key={exam.id}
                      className="frosted-glass-card p-6 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-mono text-[#686868]">
                            0{index + 1}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full border border-[#e5e5e5]/15 bg-white/5 text-[#ededed]">
                            {exam.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>
                        <h4 className="text-base font-medium text-[#ededed] leading-snug">
                          {exam.title}
                        </h4>
                        {exam.description && (
                          <p className="text-xs text-[#c2c2c2] line-clamp-2">
                            {exam.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2 rounded-[8px] bg-[#161616] border border-[#e5e5e5]/10">
                            <div className="text-[#686868] flex items-center justify-center gap-1">
                              <Clock className="size-3" /> Time
                            </div>
                            <div className="font-medium text-[#ededed] mt-0.5">
                              {exam.durationMinutes}m
                            </div>
                          </div>
                          <div className="p-2 rounded-[8px] bg-[#161616] border border-[#e5e5e5]/10">
                            <div className="text-[#686868]">Total</div>
                            <div className="font-medium text-[#ededed] mt-0.5">
                              {exam.totalMarks} pts
                            </div>
                          </div>
                          <div className="p-2 rounded-[8px] bg-[#161616] border border-[#e5e5e5]/10">
                            <div className="text-[#686868]">Pass</div>
                            <div className="font-medium text-[#ededed] mt-0.5">
                              {exam.passingMarks} pts
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-[#e5e5e5]/10 text-xs text-[#686868]">
                          <span>ID: {exam.id.slice(-6)}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            className="text-[#c2c2c2] hover:text-red-400 cursor-pointer"
                            onClick={() => deleteExam(exam.id)}
                            aria-label="Delete exam"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No Exams Created Yet"
                  description="Your repository does not have any active or draft exams. Create your first assessment using the responsive modal form."
                  presetAnimation="empty"
                  icon={BookOpen}
                  actionElement={<CreateExamDialog onSuccess={refetchExams} />}
                />
              )}
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              {usersLoading ? (
                <LoadingState
                  message="Fetching registered alumni and students..."
                  count={3}
                  variant="cards"
                />
              ) : usersError ? (
                <ErrorState
                  title="Failed to Load Users"
                  message={usersError}
                  onRetry={() => refetchUsers()}
                  retryLabel="Retry Query"
                />
              ) : users.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map((user, index) => (
                    <div
                      key={user.id}
                      className="frosted-glass-card p-6 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-[#686868]">
                          0{index + 1}
                        </span>
                        <span className="text-[11px] capitalize px-2.5 py-0.5 rounded-full border border-[#e5e5e5]/15 bg-white/5 text-[#ededed]">
                          {user.role}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-[#ededed]">
                          {user.name}
                        </h4>
                        <p className="text-xs text-[#c2c2c2] font-mono mt-0.5">
                          {user.email}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-[#e5e5e5]/10 text-[11px] text-[#686868]">
                        Registered: {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No Users Found"
                  description="There are currently no students, instructors, or administrators in the database. Add a user to get started."
                  presetAnimation="empty"
                  icon={Users}
                  actionElement={<CreateUserDialog onSuccess={refetchUsers} />}
                />
              )}
            </TabsContent>

            {/* API Documentation Tab */}
            <TabsContent value="graphql" className="space-y-4">
              <div className="frosted-glass-card p-6 space-y-4">
                <div>
                  <h4 className="text-base font-medium text-[#ededed]">
                    Streamlined API Usage
                  </h4>
                  <p className="text-xs text-[#c2c2c2]">
                    How to interact with the backend using our typed wrappers
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-mono text-[#686868]">1. React Hook:</div>
                  <pre className="p-4 rounded-[12px] bg-[#161616] border border-[#e5e5e5]/10 font-mono text-xs text-[#ededed] overflow-x-auto">
                    {`import { useExams, useCreateExam } from "@/hooks/api";

function MyComponent() {
  const { exams, loading } = useExams();
  const { createExam } = useCreateExam();
}`}
                  </pre>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-mono text-[#686868]">
                    2. Direct API Service (Client, Server Components, Server Actions):
                  </div>
                  <pre className="p-4 rounded-[12px] bg-[#161616] border border-[#e5e5e5]/10 font-mono text-xs text-[#ededed] overflow-x-auto">
                    {`import { api } from "@/lib/api";

// Fetch data
const { data, error, isSuccess } = await api.exams.getAll();

// Create data
const result = await api.exams.create({
  title: "New Assessment",
  durationMinutes: 60,
  totalMarks: 100,
  passingMarks: 40
});`}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
