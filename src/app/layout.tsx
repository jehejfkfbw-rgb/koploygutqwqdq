import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "نبراس | Nebras — منصتك التعليمية العالمية",
  description:
    "نبراس منصة تعليمية عربية عالمية واحترافية تقدم دورات تفاعلية، محاضرات فيديو، ولوحة تحكم ذكية للطلاب والمدرّسين.",
  keywords: ["نبراس", "Nebras", "منصة تعليمية", "تعلم عن بعد", "دورات أونلاين"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0b1f",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} min-h-screen bg-[var(--surface)] font-sans text-ink-900 antialiased selection:bg-brand-300 dark:text-ink-50`}
      >
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
