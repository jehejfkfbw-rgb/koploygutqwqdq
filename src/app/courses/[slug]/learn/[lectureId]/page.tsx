import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, ChevronRight, Lock, PlayCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { VideoPlayer } from "@/components/courses/video-player";
import { CompleteButton } from "@/components/courses/complete-button";
import { db } from "@/db";
import { courses, enrollments, lectureProgress, lectures, sections } from "@/db/schema";
import { and, asc, eq, inArray } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ slug: string; lectureId: string }>;
}) {
  const { slug, lectureId } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirect=/courses/${slug}/learn/${lectureId}`);
  }

  const [course] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  if (!course) notFound();

  const [currentLecture] = await db
    .select()
    .from(lectures)
    .where(and(eq(lectures.id, Number(lectureId)), eq(lectures.courseId, course.id)))
    .limit(1);
  if (!currentLecture) notFound();

  const [enrollment] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, user.id), eq(enrollments.courseId, course.id)))
    .limit(1);

  const canAccess = !!enrollment || currentLecture.isFreePreview;
  if (!canAccess) {
    redirect(`/courses/${slug}`);
  }

  const [courseSections, courseLectures] = await Promise.all([
    db.select().from(sections).where(eq(sections.courseId, course.id)).orderBy(asc(sections.order)),
    db.select().from(lectures).where(eq(lectures.courseId, course.id)).orderBy(asc(lectures.order)),
  ]);

  const lectureIds = courseLectures.map((l) => l.id);
  const progressRows = lectureIds.length
    ? await db
        .select()
        .from(lectureProgress)
        .where(and(eq(lectureProgress.userId, user.id), inArray(lectureProgress.lectureId, lectureIds)))
    : [];
  const completedIds = new Set(progressRows.map((p) => p.lectureId));

  const currentIndex = courseLectures.findIndex((l) => l.id === currentLecture.id);
  const nextLecture = courseLectures[currentIndex + 1];

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)]">
      <Navbar />
      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_340px]">
        <div>
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-ink-500 hover:text-brand-600 dark:text-ink-300"
          >
            <ChevronRight className="h-4 w-4" />
            العودة لصفحة الدورة
          </Link>

          <h1 className="mt-3 text-2xl font-extrabold text-ink-900 dark:text-white">{currentLecture.title}</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">{course.title}</p>

          <div className="mt-5">
            <VideoPlayer url={currentLecture.videoUrl} title={currentLecture.title} />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink-200/60 bg-[var(--surface-card)] p-5 dark:border-white/10">
            <div>
              <p className="text-sm leading-7 text-ink-600 dark:text-ink-300">
                {currentLecture.description || "لا يوجد وصف لهذه المحاضرة."}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <CompleteButton lectureId={currentLecture.id} initialCompleted={completedIds.has(currentLecture.id)} />
              {nextLecture && (
                <Link
                  href={`/courses/${course.slug}/learn/${nextLecture.id}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-ink-200 px-5 py-3 text-sm font-bold text-ink-700 hover:border-brand-400 hover:text-brand-600 dark:border-white/10 dark:text-white"
                >
                  المحاضرة التالية
                </Link>
              )}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-ink-200/60 bg-[var(--surface-card)] p-5 dark:border-white/10">
          <h3 className="font-bold text-ink-900 dark:text-white">محتوى الدورة</h3>
          <p className="mt-1 text-xs text-ink-400">
            {completedIds.size} / {courseLectures.length} محاضرة مكتملة
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-l from-brand-500 to-brand-300"
              style={{ width: `${courseLectures.length ? (completedIds.size / courseLectures.length) * 100 : 0}%` }}
            />
          </div>

          <div className="mt-5 max-h-[60vh] space-y-4 overflow-y-auto pl-1">
            {courseSections.map((section) => {
              const sectionLectures = courseLectures.filter((l) => l.sectionId === section.id);
              return (
                <div key={section.id}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">{section.title}</p>
                  <ul className="space-y-1">
                    {sectionLectures.map((lecture) => {
                      const accessible = !!enrollment || lecture.isFreePreview;
                      const isActive = lecture.id === currentLecture.id;
                      const isDone = completedIds.has(lecture.id);
                      return (
                        <li key={lecture.id}>
                          {accessible ? (
                            <Link
                              href={`/courses/${course.slug}/learn/${lecture.id}`}
                              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${
                                isActive
                                  ? "bg-brand-500/10 font-bold text-brand-600 dark:text-brand-300"
                                  : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-white/5"
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                              ) : (
                                <PlayCircle className="h-4 w-4 shrink-0" />
                              )}
                              <span className="line-clamp-1">{lecture.title}</span>
                            </Link>
                          ) : (
                            <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink-400">
                              <Lock className="h-4 w-4 shrink-0" />
                              <span className="line-clamp-1">{lecture.title}</span>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
