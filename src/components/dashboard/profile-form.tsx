"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

const GRADE_LEVELS = [
  "المرحلة الابتدائية",
  "المرحلة المتوسطة",
  "المرحلة الثانوية",
  "طالب جامعي",
  "خريج / موظف",
  "أخرى",
];

export function ProfileForm({
  initialFullName,
  initialPhone,
  initialGradeLevel,
  email,
}: {
  initialFullName: string;
  initialPhone: string;
  initialGradeLevel: string;
  email: string;
}) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [gradeLevel, setGradeLevel] = useState(initialGradeLevel);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, gradeLevel }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "تعذّر حفظ التغييرات");
        return;
      }
      await refresh();
      setSuccess(true);
      router.refresh();
    } catch {
      setError("تعذّر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-ink-200/60 bg-[var(--surface-card)] p-6 dark:border-white/10">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          تم حفظ التغييرات بنجاح
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">البريد الإلكتروني</label>
        <input
          dir="ltr"
          disabled
          value={email}
          className="w-full cursor-not-allowed rounded-xl border border-ink-200 bg-ink-100 px-4 py-3 text-sm text-ink-500 dark:border-white/10 dark:bg-white/5 dark:text-ink-400"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">الاسم الكامل</label>
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">رقم الهاتف</label>
          <input
            dir="ltr"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">المرحلة الدراسية</label>
          <select
            required
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            {GRADE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-brand-500 to-brand-400 px-6 py-3 text-sm font-extrabold text-ink-950 shadow-lg shadow-brand-500/30 transition hover:shadow-brand-500/50 disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        حفظ التغييرات
      </button>
    </form>
  );
}
