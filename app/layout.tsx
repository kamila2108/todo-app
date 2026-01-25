import "./globals.css";
import type { Metadata } from "next";
import { AuthProviderWrapper } from "@/components/auth/AuthProviderWrapper";

export const metadata: Metadata = {
  title: "Todo App",
  description: "Simple Todo App with Next.js, React Hook Form, and Zod",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-900 text-slate-50">
        <AuthProviderWrapper>
          <div className="flex min-h-screen items-center justify-center">
            {children}
          </div>
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
