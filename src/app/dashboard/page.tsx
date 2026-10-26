import Link from "next/link";
import { Award, BookOpen, Flame, GraduationCap, PlayCircle, TrendingUp } from "lucide-react";
import { db } from "@/db";
import { courses, enrollments, lectureProgress, lectures } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function StudentOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const myEnrollments = await db
    .select({ enrollment: enrollments, course: courses })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.userId, user.id));

  const courseIds = myEnrollments.map((e) => e.course.id);
  const allLectures = courseIds.length
    ? await db.select().from(lectures).where(inArray(lectures.courseId, courseIds))
    : [];
  const myProgress = await db.select().from(lectureProgress).where(eq(lectureProgress.userId, user.id));
  const completedLectureIds = new Set(myProgress.map((p) => p.lectureId));

  const coursesWithProgress = myEnrollments.map(({ course }) => {
    const courseLectures = allLectures.filter((l) => l.courseId === course.id);
    const completedCount = courseLectures.filter((l) => completedLectureIds.has(l.id)).length;
    const progress = courseLectures.length ? Math.round((completedCount / courseLectures.length) * 100) : 0;
    const nextLecture = courseLectures.find((l) => !completedLectureIds.has(l.id)) ?? courseLectures[0];
    return { course, progress, completedCount, total: courseLectures.length, nextLecture };
  });

  const totalCompletedLectures = completedLectureIds.size;
  const totalLectures = allLectures.length;
  const overallProgress = totalLectures ? Math.round((totalCompletedLectures / totalLectures) * 100) : 0;
  const completedCourses = coursesWithProgress.filter((c) => c.total > 0 && c.progress === 100).length;

  const stats = [
    { label: "الدورات المسجّلة", value: myEnrollments.length, icon: BookOpen },
    { label: "المحاضرات المكتملة", value: totalCompletedLectures, icon: PlayCircle },
    { label: "دورات مكتملة", value: completedCourses, icon: Award },
    { label: "نسبة التقدم العامة", value: `${overallProgress}%`, icon: TrendingUp },
  ];

  return (
    <div>
      <div className="rounded-3xl bg-gradient-to-l from-ink-950 via-ink-900 to-ink-800 p-8 text-white">
        <div className="flex items-center gap-3">
          <Flame className="h-6 w-6 text-brand-300" />
          <p className="text-sm font-semibold text-ink-200">أهلاً بعودتك،</p>
        </div>
        <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{user.fullName} 👋</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-300">
          استمر في رحلتك التعليمية، كل محاضرة تكملها تقرّبك خطوة من تحقيق هدفك.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-ink-200/60 bg-[var(--surface-card)] p-5 dark:border-white/10">
            <stat.icon className="h-6 w-6 text-brand-500" />
            <p className="mt-3 text-2xl font-extrabold text-ink-900 dark:text-white">{stat.value}</p>
            <p className="mt-1 text-xs text-ink-500 dark:text-ink-300">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-ink-900 dark:text-white">متابعة التعلّم</h2>
        <Link href="/courses" className="text-sm font-bold text-brand-600 hover:underline">
          تصفّح دورات جديدة
        </Link>
      </div>

      {coursesWithProgress.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-ink-200 p-14 text-center text-ink-400 dark:border-white/10">
          <GraduationCap className="mx-auto h-10 w-10" />
          <p className="mt-4">لم تسجّل في أي دورة بعد، ابدأ رحلتك الآن!</p>
          <Link
            href="/courses"
            className="mt-5 inline-flex items-center rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-ink-950"
          >
            تصفّح الدورات
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {coursesWithProgress.map(({ course, progress, completedCount, total, nextLecture }) => (
            <div key={course.id} className="rounded-2xl border border-ink-200/60 bg-[var(--surface-card)] p-6 dark:border-white/10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-brand-600">{course.category}</span>
                  <h3 className="mt-1 font-bold text-ink-900 dark:text-white">{course.title}</h3>
                </div>
                <span className="shrink-0 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-bold text-brand-600 dark:text-brand-300">
                  {progress}%
                </span>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-l from-brand-500 to-brand-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-ink-400">
                {completedCount} من {total} محاضرة مكتملة
              </p>
              {nextLecture && (
                <Link
                  href={`/courses/${course.slug}/learn/${nextLecture.id}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-ink-800 dark:bg-white/10 dark:hover:bg-white/20"
                >
                  <PlayCircle className="h-4 w-4" />
                  متابعة المحاضرة
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
