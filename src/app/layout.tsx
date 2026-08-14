import type { Metadata } from "next";
import { DM_Sans, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApolloProvider } from "@/components/providers/apollo-provider";
import { Toaster } from "@/components/ui/sonner";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UG AlumniSphere | Dimension Dusk-lit Platform",
  description:
    "UG AlumniSphere — Dusk-lit workspace with frosted glass panels, full-stack GraphQL, Next.js, and MongoDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${geist.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#ededed] font-sans selection:bg-[#6b62f2]/30 selection:text-white">
        <ApolloProvider>
          {children}
          <Toaster richColors position="top-right" theme="dark" />
        </ApolloProvider>
      </body>
    </html>
  );
}
