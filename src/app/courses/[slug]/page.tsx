import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  Tag,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EnrollButton } from "@/components/courses/enroll-button";
import { db } from "@/db";
import { courses, enrollments, lectures, sections } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function getCourseData(slug: string) {
  const [course] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  if (!course) return null;

  const [courseSections, courseLectures] = await Promise.all([
    db.select().from(sections).where(eq(sections.courseId, course.id)).orderBy(asc(sections.order)),
    db.select().from(lectures).where(eq(lectures.courseId, course.id)).orderBy(asc(lectures.order)),
  ]);

  return { course, sections: courseSections, lectures: courseLectures };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCourseData(slug);
  if (!data) notFound();

  const { course, sections: courseSections, lectures: courseLectures } = data;
  const user = await getCurrentUser();

  let isEnrolled = false;
  if (user) {
    const existing = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, user.id), eq(enrollments.courseId, course.id)))
      .limit(1);
    isEnrolled = existing.length > 0;
  }

  const totalDuration = courseLectures.reduce((sum, l) => sum + (l.duration ?? 0), 0);
  const firstLecture = courseLectures[0];

  return (
    <div>
      <Navbar />

      <section className="bg-gradient-to-b from-ink-950 to-ink-900 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="rounded-full bg-brand-500/20 px-3 py-1 text-brand-300">{course.category}</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{course.level}</span>
            </div>
            <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight sm:text-4xl">{course.title}</h1>
            <p className="mt-4 max-w-2xl leading-8 text-ink-200">{course.description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-ink-300">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-300" /> {course.instructorName}
              </span>
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-brand-300" /> {courseLectures.length} محاضرة
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-300" /> {totalDuration} دقيقة
              </span>
              <span className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-brand-300" /> {course.level}
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-5 flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-ink-800 to-ink-950">
              {course.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.coverImage} alt={course.title} className="h-full w-full object-cover" />
              ) : (
                <BookOpen className="h-12 w-12 text-brand-400" />
              )}
            </div>
            <p className="text-center text-3xl font-extrabold text-brand-300">
              {course.price === 0 ? "مجاناً" : `${course.price} ر.س`}
            </p>
            <div className="mt-5">
              <EnrollButton
                courseId={course.id}
                isLoggedIn={!!user}
                isEnrolled={isEnrolled}
                firstLectureHref={firstLecture ? `/courses/${course.slug}/learn/${firstLecture.id}` : null}
              />
            </div>
            <ul className="mt-6 space-y-2.5 text-sm text-ink-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-300" /> وصول كامل مدى الحياة
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-300" /> شهادة إتمام معتمدة
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-300" /> متابعة تقدّمك أولاً بأول
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <h2 className="text-2xl font-extrabold text-ink-900 dark:text-white">محتوى الدورة</h2>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
          {courseSections.length} قسم • {courseLectures.length} محاضرة
        </p>

        <div className="mt-8 space-y-5">
          {courseSections.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-200 p-10 text-center text-ink-400 dark:border-white/10">
              سيتم إضافة محتوى هذه الدورة قريباً.
            </div>
          ) : (
            courseSections.map((section, idx) => {
              const sectionLectures = courseLectures.filter((l) => l.sectionId === section.id);
              return (
                <div key={section.id} className="overflow-hidden rounded-2xl border border-ink-200/60 dark:border-white/10">
                  <div className="flex items-center justify-between bg-ink-50 px-5 py-4 dark:bg-white/5">
                    <h3 className="font-bold text-ink-900 dark:text-white">
                      {idx + 1}. {section.title}
                    </h3>
                    <span className="text-xs text-ink-400">{sectionLectures.length} محاضرة</span>
                  </div>
                  <ul className="divide-y divide-ink-100 dark:divide-white/5">
                    {sectionLectures.map((lecture) => {
                      const canAccess = isEnrolled || lecture.isFreePreview;
                      return (
                        <li key={lecture.id} className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm">
                          <div className="flex items-center gap-3">
                            <PlayCircle className="h-4 w-4 shrink-0 text-ink-400" />
                            <span className="text-ink-700 dark:text-ink-200">{lecture.title}</span>
                            {lecture.isFreePreview && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                معاينة مجانية
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-ink-400">
                            {lecture.duration ? <span className="text-xs">{lecture.duration} د</span> : null}
                            {canAccess ? (
                              <Link
                                href={`/courses/${course.slug}/learn/${lecture.id}`}
                                className="text-xs font-bold text-brand-600 hover:underline"
                              >
                                مشاهدة
                              </Link>
                            ) : (
                              <Lock className="h-4 w-4" />
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-10 flex items-center gap-2 text-sm text-ink-400">
          <Tag className="h-4 w-4" /> تصنيف: {course.category}
        </div>
      </section>

      <Footer />
    </div>
  );
}
