import Link from "next/link";
import { BookOpen, PlayCircle, Users } from "lucide-react";
import { db } from "@/db";
import { courses, enrollments, lectureProgress, lectures } from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function MyCoursesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const myEnrollments = await db
    .select({ enrollment: enrollments, course: courses })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.userId, user.id))
    .orderBy(desc(enrollments.enrolledAt));

  const courseIds = myEnrollments.map((e) => e.course.id);
  const allLectures = courseIds.length
    ? await db.select().from(lectures).where(inArray(lectures.courseId, courseIds))
    : [];
  const myProgress = await db.select().from(lectureProgress).where(eq(lectureProgress.userId, user.id));
  const completedLectureIds = new Set(myProgress.map((p) => p.lectureId));

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">دوراتي</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">جميع الدورات التي سجّلت بها حتى الآن</p>

      {myEnrollments.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-ink-200 p-14 text-center text-ink-400 dark:border-white/10">
          <BookOpen className="mx-auto h-10 w-10" />
          <p className="mt-4">لم تسجّل في أي دورة بعد.</p>
          <Link href="/courses" className="mt-5 inline-flex items-center rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-ink-950">
            تصفّح الدورات
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myEnrollments.map(({ course }) => {
            const courseLectures = allLectures.filter((l) => l.courseId === course.id);
            const completedCount = courseLectures.filter((l) => completedLectureIds.has(l.id)).length;
            const progress = courseLectures.length ? Math.round((completedCount / courseLectures.length) * 100) : 0;
            const nextLecture = courseLectures.find((l) => !completedLectureIds.has(l.id)) ?? courseLectures[0];

            return (
              <div key={course.id} className="overflow-hidden rounded-3xl border border-ink-200/60 bg-[var(--surface-card)] dark:border-white/10">
                <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-ink-800 to-ink-950">
                  {course.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={course.coverImage} alt={course.title} className="h-full w-full object-cover" />
                  ) : (
                    <BookOpen className="h-10 w-10 text-brand-400" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="line-clamp-1 font-bold text-ink-900 dark:text-white">{course.title}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-300">
                    <Users className="h-3.5 w-3.5" /> {course.instructorName}
                  </p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-l from-brand-500 to-brand-300" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-ink-400">{progress}% مكتمل</p>
                  {nextLecture && (
                    <Link
                      href={`/courses/${course.slug}/learn/${nextLecture.id}`}
                      className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-ink-900 py-2.5 text-xs font-bold text-white hover:bg-ink-800 dark:bg-white/10 dark:hover:bg-white/20"
                    >
                      <PlayCircle className="h-4 w-4" />
                      متابعة
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
