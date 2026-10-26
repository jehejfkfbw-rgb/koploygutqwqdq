"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, PlayCircle, UserPlus } from "lucide-react";

export function EnrollButton({
  courseId,
  isLoggedIn,
  isEnrolled,
  firstLectureHref,
}: {
  courseId: number;
  isLoggedIn: boolean;
  isEnrolled: boolean;
  firstLectureHref: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const [error, setError] = useState<string | null>(null);

  async function handleEnroll() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "تعذّر التسجيل في الدورة");
        setLoading(false);
        return;
      }
      setEnrolled(true);
      router.refresh();
    } catch {
      setError("تعذّر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  if (enrolled) {
    return (
      <div className="space-y-2">
        <a
          href={firstLectureHref ?? "#"}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-brand-500 to-brand-400 py-3.5 text-sm font-extrabold text-ink-950 shadow-lg shadow-brand-500/30 transition hover:shadow-brand-500/50"
        >
          <PlayCircle className="h-4 w-4" />
          متابعة التعلّم
        </a>
        <p className="text-center text-xs font-semibold text-emerald-600">أنت مسجّل في هذه الدورة ✓</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-brand-500 to-brand-400 py-3.5 text-sm font-extrabold text-ink-950 shadow-lg shadow-brand-500/30 transition hover:shadow-brand-500/50 disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
        {loading ? "جارِ التسجيل..." : "سجّل في الدورة الآن"}
      </button>
      {error && <p className="text-center text-xs font-semibold text-rose-500">{error}</p>}
    </div>
  );
}
