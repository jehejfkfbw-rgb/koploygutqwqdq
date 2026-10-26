"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

export function CompleteButton({ lectureId, initialCompleted }: { lectureId: number; initialCompleted: boolean }) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/lectures/${lectureId}/complete`, {
        method: completed ? "DELETE" : "POST",
      });
      if (res.ok) {
        setCompleted((v) => !v);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
        completed
          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-300"
          : "bg-ink-900 text-white hover:bg-ink-800 dark:bg-brand-500 dark:text-ink-950 dark:hover:bg-brand-400"
      }`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : completed ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      {completed ? "تم إكمال المحاضرة" : "تحديد كمكتملة"}
    </button>
  );
}
