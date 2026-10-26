import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول | نبراس",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="مرحباً بعودتك 👋"
      subtitle="سجّل الدخول لمتابعة رحلتك التعليمية في نبراس"
      footer={
        <>
          ليس لديك حساب؟{" "}
          <Link href="/signup" className="font-bold text-brand-600 hover:underline">
            أنشئ حساباً جديداً
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
