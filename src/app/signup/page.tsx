import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "إنشاء حساب | نبراس",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="أنشئ حسابك المجاني ✨"
      subtitle="انضم إلى نبراس وابدأ رحلتك التعليمية اليوم"
      footer={
        <>
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="font-bold text-brand-600 hover:underline">
            سجّل الدخول
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
