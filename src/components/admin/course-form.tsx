"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import type { Course } from "@/db/schema";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function CourseForm({ initialCourse }: { initialCourse?: Course }) {
  const router = useRouter();
  const isEdit = !!initialCourse;

  const [title, setTitle] = useState(initialCourse?.title ?? "");
  const [slug, setSlug] = useState(initialCourse?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(initialCourse?.description ?? "");
  const [category, setCategory] = useState(initialCourse?.category ?? "");
  const [level, setLevel] = useState(initialCourse?.level ?? "مبتدئ");
  const [instructorName, setInstructorName] = useState(initialCourse?.instructorName ?? "");
  const [coverImage, setCoverImage] = useState(initialCourse?.coverImage ?? "");
  const [price, setPrice] = useState(initialCourse?.price ?? 0);
  const [isPublished, setIsPublished] = useState(initialCourse?.isPublished ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = { title, slug, description, category, level, instructorName, coverImage, price, isPublished };
      const res = await fetch(isEdit ? `/api/admin/courses/${initialCourse!.id}` : "/api/admin/courses", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "تعذّر حفظ الدورة");
        return;
      }
      if (!isEdit) {
        router.push(`/admin/courses/${data.course.id}`);
      } else {
        router.refresh();
      }
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

      <div>
        <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">عنوان الدورة</label>
        <input
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">الرابط (slug)</label>
        <input
          required
          dir="ltr"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">الوصف</label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">التصنيف</label>
          <input
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="مثال: برمجة، لغات، علوم"
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">المستوى</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <option value="مبتدئ">مبتدئ</option>
            <option value="متوسط">متوسط</option>
            <option value="متقدم">متقدم</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">اسم المحاضر</label>
          <input
            required
            value={instructorName}
            onChange={(e) => setInstructorName(e.target.value)}
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">السعر (ر.س، 0 = مجاناً)</label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-ink-700 dark:text-ink-200">رابط صورة الغلاف (اختياري)</label>
        <input
          dir="ltr"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
      </div>

      <label className="flex items-center gap-3 text-sm font-semibold text-ink-700 dark:text-ink-200">
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="h-4 w-4 accent-brand-500" />
        نشر الدورة (ستكون مرئية للطلاب)
      </label>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-brand-500 to-brand-400 px-6 py-3 text-sm font-extrabold text-ink-950 shadow-lg shadow-brand-500/30 disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {isEdit ? "حفظ التعديلات" : "إنشاء الدورة ومتابعة إضافة المحتوى"}
      </button>
    </form>
  );
}
