"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, GraduationCap, Lock, Mail, Phone, User, UserPlus } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

const GRADE_LEVELS = [
  "المرحلة الابتدائية",
  "المرحلة المتوسطة",
  "المرحلة الثانوية",
  "طالب جامعي",
  "خريج / موظف",
  "أخرى",
];

export function SignupForm() {
  const router = useRouter();
  const { refresh } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    if (!gradeLevel) {
      setError("الرجاء اختيار السن أو المرحلة الدراسية");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, gradeLevel, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "تعذّر إنشاء الحساب");
        setLoading(false);
        return;
      }
      await refresh();
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("تعذّر الاتصال بالخادم، حاول مرة أخرى");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">الاسم الكامل</label>
        <div className="relative">
          <User className="pointer-events-none absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="الاسم الكامل"
            className="w-full rounded-xl border border-ink-200 bg-white py-3 pr-11 pl-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">رقم الهاتف</label>
          <div className="relative">
            <Phone className="pointer-events-none absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
            <input
              required
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05xxxxxxxx"
              className="w-full rounded-xl border border-ink-200 bg-white py-3 pr-11 pl-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">المرحلة الدراسية</label>
          <div className="relative">
            <GraduationCap className="pointer-events-none absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
            <select
              required
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full appearance-none rounded-xl border border-ink-200 bg-white py-3 pr-11 pl-4 text-sm text-ink-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              <option value="" disabled>
                اختر المرحلة
              </option>
              {GRADE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">البريد الإلكتروني</label>
        <div className="relative">
          <Mail className="pointer-events-none absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
          <input
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full rounded-xl border border-ink-200 bg-white py-3 pr-11 pl-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">كلمة المرور</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 أحرف على الأقل"
              className="w-full rounded-xl border border-ink-200 bg-white py-3 pr-11 pl-11 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">تأكيد كلمة المرور</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="أعد كتابة كلمة المرور"
              className="w-full rounded-xl border border-ink-200 bg-white py-3 pr-11 pl-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-brand-500 to-brand-400 py-3.5 text-sm font-extrabold text-ink-950 shadow-lg shadow-brand-500/30 transition hover:shadow-brand-500/50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "جارِ إنشاء الحساب..." : "إنشاء حساب جديد"}
        {!loading && <UserPlus className="h-4 w-4" />}
      </button>
    </form>
  );
}
