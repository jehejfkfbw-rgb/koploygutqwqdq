"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import type { Course } from "@/db/schema";

export function CoursesTable({ initialCourses }: { initialCourses: Course[] }) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("هل أنت متأكد من حذف هذه الدورة؟ سيتم حذف جميع الأقسام والمحاضرات المرتبطة بها.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
        router.refresh();
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">إدارة الدورات</h1>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-brand-500 to-brand-400 px-5 py-2.5 text-sm font-extrabold text-ink-950 shadow-lg shadow-brand-500/30"
        >
          <Plus className="h-4 w-4" />
          إضافة دورة جديدة
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-ink-200 p-14 text-center text-ink-400 dark:border-white/10">
          <BookOpen className="mx-auto h-10 w-10" />
          <p className="mt-4">لا توجد دورات بعد، ابدأ بإضافة أول دورة.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-ink-200/60 dark:border-white/10">
          <table className="w-full min-w-[720px] text-right text-sm">
            <thead className="bg-ink-50 text-xs uppercase text-ink-500 dark:bg-white/5 dark:text-ink-300">
              <tr>
                <th className="px-5 py-3.5 font-bold">الدورة</th>
                <th className="px-5 py-3.5 font-bold">التصنيف</th>
                <th className="px-5 py-3.5 font-bold">السعر</th>
                <th className="px-5 py-3.5 font-bold">الحالة</th>
                <th className="px-5 py-3.5 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-white/5">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-ink-50/50 dark:hover:bg-white/[0.03]">
                  <td className="px-5 py-4">
                    <p className="font-bold text-ink-900 dark:text-white">{course.title}</p>
                    <p className="text-xs text-ink-400">{course.instructorName}</p>
                  </td>
                  <td className="px-5 py-4 text-ink-600 dark:text-ink-300">{course.category}</td>
                  <td className="px-5 py-4 font-semibold text-brand-600 dark:text-brand-300">
                    {course.price === 0 ? "مجاناً" : `${course.price} ر.س`}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        course.isPublished
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                          : "bg-ink-100 text-ink-500 dark:bg-white/5 dark:text-ink-300"
                      }`}
                    >
                      {course.isPublished ? "منشورة" : "مسودة"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-ink-200 text-ink-600 hover:border-brand-400 hover:text-brand-600 dark:border-white/10 dark:text-ink-300"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(course.id)}
                        disabled={deletingId === course.id}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-ink-200 text-ink-600 hover:border-rose-300 hover:text-rose-500 disabled:opacity-50 dark:border-white/10 dark:text-ink-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
