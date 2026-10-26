import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Search, Users } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { and, desc, eq, ilike, or } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "الدورات | نبراس",
};

async function getCourses(q?: string, category?: string) {
  try {
    const conditions = [eq(courses.isPublished, true)];
    if (q) {
      conditions.push(or(ilike(courses.title, `%${q}%`), ilike(courses.description, `%${q}%`))!);
    }
    if (category && category !== "الكل") {
      conditions.push(eq(courses.category, category));
    }
    return await db
      .select()
      .from(courses)
      .where(and(...conditions))
      .orderBy(desc(courses.createdAt));
  } catch (error) {
    console.error("[CoursesPage] Failed to load courses:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const rows = await db.select({ category: courses.category }).from(courses).where(eq(courses.isPublished, true));
    return Array.from(new Set(rows.map((r) => r.category)));
  } catch {
    return [];
  }
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const [allCourses, categories] = await Promise.all([getCourses(q, category), getCategories()]);

  return (
    <div>
      <Navbar />

      <section className="bg-gradient-to-b from-ink-950 to-ink-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
          <h1 className="text-3xl font-extrabold sm:text-4xl">اكتشف دوراتنا التعليمية</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-300">
            مكتبة متكاملة من الدورات الاحترافية في مختلف المجالات والمراحل الدراسية
          </p>

          <form className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-xl">
            <Search className="mr-2 h-5 w-5 shrink-0 text-ink-400" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="ابحث عن دورة..."
              className="w-full bg-transparent px-1 py-2 text-sm text-ink-900 outline-none placeholder:text-ink-400"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-gradient-to-l from-brand-500 to-brand-400 px-5 py-2.5 text-sm font-bold text-ink-950"
            >
              بحث
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-wrap gap-2">
          {["الكل", ...categories].map((cat) => (
            <Link
              key={cat}
              href={cat === "الكل" ? "/courses" : `/courses?category=${encodeURIComponent(cat)}`}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                (category ?? "الكل") === cat
                  ? "border-brand-500 bg-brand-500 text-ink-950"
                  : "border-ink-200 text-ink-600 hover:border-brand-400 hover:text-brand-600 dark:border-white/10 dark:text-ink-300"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {allCourses.length === 0 ? (
          <div className="mt-14 rounded-3xl border border-dashed border-ink-200 p-16 text-center text-ink-400 dark:border-white/10">
            <BookOpen className="mx-auto h-10 w-10" />
            <p className="mt-4">لم يتم العثور على دورات مطابقة لبحثك.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allCourses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group overflow-hidden rounded-3xl border border-ink-200/60 bg-[var(--surface-card)] shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10"
              >
                <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-ink-800 to-ink-950">
                  {course.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.coverImage} alt={course.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : (
                    <BookOpen className="h-12 w-12 text-brand-400" />
                  )}
                  <span className="absolute top-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                    {course.level}
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold uppercase tracking-wide text-brand-600">{course.category}</span>
                  <h3 className="mt-2 line-clamp-1 text-lg font-bold text-ink-900 dark:text-white">{course.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-500 dark:text-ink-300">
                    {course.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-4 text-sm dark:border-white/10">
                    <span className="flex items-center gap-1.5 text-ink-500 dark:text-ink-300">
                      <Users className="h-4 w-4" /> {course.instructorName}
                    </span>
                    <span className="font-extrabold text-brand-600 dark:text-brand-300">
                      {course.price === 0 ? "مجاناً" : `${course.price} ر.س`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
