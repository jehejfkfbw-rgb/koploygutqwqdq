import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Layers,
  PlayCircle,
  Quote,
  Rocket,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function getFeaturedCourses() {
  try {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.isPublished, true))
      .orderBy(desc(courses.createdAt))
      .limit(3);
  } catch (error) {
    console.error("[HomePage] Failed to load featured courses:", error);
    return [];
  }
}

async function getStats() {
  try {
    const result = await db.execute<{ count: string }>(sql`select count(*)::text as count from ${courses}`);
    const row = result.rows[0];
    return { coursesCount: Number(row?.count ?? 0) };
  } catch {
    return { coursesCount: 0 };
  }
}

const features = [
  {
    icon: Sparkles,
    title: "محتوى عصري وتفاعلي",
    desc: "دروس فيديو عالية الجودة، اختبارات تفاعلية، وملفات قابلة للتحميل لكل محاضرة.",
  },
  {
    icon: Shield,
    title: "أمان وموثوقية تامة",
    desc: "بياناتك محمية بأعلى معايير التشفير، مع نظام مصادقة قوي وحماية كاملة للحسابات.",
  },
  {
    icon: TrendingUp,
    title: "تتبع التقدم الذكي",
    desc: "لوحة تحكم ذكية تعرض نسبة إنجازك في كل دورة ومحاضرة أولاً بأول.",
  },
  {
    icon: GraduationCap,
    title: "مدرّبون محترفون",
    desc: "نخبة من الخبراء والمدرّسين المعتمدين يقدّمون محتوى بمعايير عالمية.",
  },
  {
    icon: Layers,
    title: "تصنيفات متعددة",
    desc: "من البرمجة إلى اللغات والعلوم، دورات تغطي كل المراحل الدراسية والاهتمامات.",
  },
  {
    icon: Award,
    title: "شهادات إتمام",
    desc: "احصل على شهادة معتمدة فور إكمال الدورة لإضافتها إلى سيرتك الذاتية.",
  },
];

const steps = [
  { title: "أنشئ حسابك", desc: "سجّل مجاناً خلال دقيقة واحدة وابدأ رحلتك التعليمية." },
  { title: "اختر دورتك", desc: "تصفّح مكتبة الدورات واختر ما يناسب مرحلتك واهتمامك." },
  { title: "تعلّم بلا حدود", desc: "شاهد المحاضرات، تتبع تقدمك، واحصل على شهادتك." },
];

const testimonials = [
  {
    name: "سارة العتيبي",
    role: "طالبة ثانوية",
    text: "منصة نبراس غيّرت طريقة دراستي بالكامل، المحاضرات واضحة ولوحة التحكم تساعدني أعرف وين وصلت بالضبط.",
  },
  {
    name: "محمد الحربي",
    role: "طالب جامعي",
    text: "تصميم المنصة رائع وسهل الاستخدام، والدعم الفني سريع جداً في الرد. أنصح فيها بشدة.",
  },
  {
    name: "ليان القحطاني",
    role: "مدرّسة لغة إنجليزية",
    text: "كمدرّبة، أحب كيف تنظم نبراس المحتوى في أقسام ومحاضرات، يسهّل عليّ متابعة طلابي.",
  },
];

export default async function HomePage() {
  const [featuredCourses, stats] = await Promise.all([getFeaturedCourses(), getStats()]);

  return (
    <div className="relative overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 text-white">
        <div className="bg-grid pointer-events-none absolute inset-0 text-white/40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="pointer-events-none absolute -top-32 right-1/2 h-96 w-96 translate-x-1/2 rounded-full bg-brand-500/30 blur-[120px]" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-5 pb-24 pt-16 text-center sm:px-8 sm:pt-24">
          <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-brand-200">
            <Sparkles className="h-3.5 w-3.5" />
            منصة تعليمية عربية بمعايير عالمية
          </span>

          <h1 className="mt-7 max-w-4xl animate-fade-up text-balance text-[clamp(2.1rem,5.5vw,4rem)] font-extrabold leading-[1.15]" style={{ animationDelay: "0.05s" }}>
            أضِئ طريقك نحو المعرفة مع{" "}
            <span className="bg-gradient-to-l from-brand-300 via-brand-400 to-brand-500 bg-clip-text text-transparent">
              نبراس
            </span>
          </h1>

          <p className="mt-6 max-w-2xl animate-fade-up text-balance text-base leading-8 text-ink-200 sm:text-lg" style={{ animationDelay: "0.1s" }}>
            منصة تعليمية متكاملة تجمع بين التصميم العصري وتجربة تعلّم سلسة؛ دورات احترافية، محاضرات تفاعلية، ولوحة
            تحكم ذكية تواكب طموحك من أول خطوة.
          </p>

          <div className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.15s" }}>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand-400 to-brand-500 px-8 py-4 text-sm font-extrabold text-ink-950 shadow-2xl shadow-brand-500/30 transition hover:scale-[1.02] hover:shadow-brand-500/50"
            >
              ابدأ التعلّم مجاناً
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
            >
              <PlayCircle className="h-4 w-4" />
              تصفّح الدورات
            </Link>
          </div>

          <div className="mt-16 grid w-full max-w-3xl animate-fade-up grid-cols-3 gap-4 border-t border-white/10 pt-8" style={{ animationDelay: "0.2s" }}>
            {[
              { value: `${Math.max(stats.coursesCount, 12)}+`, label: "دورة تدريبية" },
              { value: "25K+", label: "طالب وطالبة" },
              { value: "98%", label: "رضا المستخدمين" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-extrabold text-brand-300 sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-ink-300 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-brand-600">لماذا نبراس؟</span>
          <h2 className="mt-3 text-balance text-3xl font-extrabold text-ink-900 sm:text-4xl dark:text-white">
            كل ما تحتاجه لتجربة تعليمية استثنائية
          </h2>
          <p className="mt-4 text-ink-500 dark:text-ink-300">
            صممنا كل تفصيلة في نبراس بعناية فائقة لنمنحك تجربة تعلم سلسة، آمنة، وممتعة.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="group animate-fade-up rounded-3xl border border-ink-200/60 bg-[var(--surface-card)] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10 dark:border-white/10"
              style={{ animationDelay: `${idx * 0.06}s` }}
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/10 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white dark:text-brand-300">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink-900 dark:text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-500 dark:text-ink-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About / How it works */}
      <section id="about" className="bg-ink-50/60 py-20 sm:py-28 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-brand-600">رؤيتنا</span>
              <h2 className="mt-3 text-balance text-3xl font-extrabold text-ink-900 sm:text-4xl dark:text-white">
                نبني جيلاً عربياً متعلماً وواثقاً من نفسه
              </h2>
              <p className="mt-5 leading-8 text-ink-500 dark:text-ink-300">
                انطلقت نبراس من إيمان راسخ بأن التعليم حق للجميع، فجمعنا نخبة من المدرّبين المحترفين على منصة واحدة
                سهلة الاستخدام، آمنة، ومصممة خصيصاً لتناسب احتياجات الطالب العربي في كل مرحلة عمرية.
              </p>
              <ul className="mt-7 space-y-4">
                {[
                  "واجهة عربية بالكامل مع دعم تام للغة واتجاه الكتابة",
                  "متابعة تقدمك لحظة بلحظة عبر لوحة تحكم ذكية",
                  "فريق دعم فني متجاوب على مدار الساعة",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink-700 dark:text-ink-200">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className={`rounded-3xl border border-ink-200/60 bg-[var(--surface-card)] p-6 shadow-sm dark:border-white/10 ${
                    i === 2 ? "col-span-2" : ""
                  }`}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-900 text-sm font-bold text-white dark:bg-brand-500 dark:text-ink-950">
                    {i + 1}
                  </span>
                  <h4 className="mt-4 font-bold text-ink-900 dark:text-white">{step.title}</h4>
                  <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-300">{step.desc}</p>
                </div>
              ))}
              <div className="col-span-2 flex items-center gap-4 rounded-3xl bg-gradient-to-l from-brand-500 to-brand-400 p-6 text-ink-950 shadow-xl shadow-brand-500/30">
                <Rocket className="h-9 w-9 shrink-0" />
                <p className="text-sm font-bold leading-6">
                  انضم الآن إلى آلاف الطلاب الذين بدأوا رحلتهم التعليمية مع نبراس
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-brand-600">مكتبة الدورات</span>
            <h2 className="mt-3 text-balance text-3xl font-extrabold text-ink-900 sm:text-4xl dark:text-white">
              أحدث الدورات المضافة
            </h2>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-xl border border-ink-200 px-5 py-3 text-sm font-bold text-ink-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-white/10 dark:text-white"
          >
            عرض جميع الدورات
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {featuredCourses.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-ink-200 p-14 text-center text-ink-400 dark:border-white/10">
            <BookOpen className="mx-auto h-10 w-10" />
            <p className="mt-4">لم تتم إضافة دورات بعد، تابعونا قريباً.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
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

      {/* Testimonials */}
      <section className="bg-ink-950 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-brand-300">آراء طلابنا</span>
            <h2 className="mt-3 text-balance text-3xl font-extrabold sm:text-4xl">قصص نجاح حقيقية</h2>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                <Quote className="h-7 w-7 text-brand-300" />
                <p className="mt-4 leading-7 text-ink-100">{t.text}</p>
                <div className="mt-6 flex items-center gap-1 text-brand-300">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm font-bold">{t.name}</p>
                <p className="text-xs text-ink-300">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-l from-brand-500 via-brand-400 to-brand-300 px-8 py-16 text-center text-ink-950 sm:px-16">
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/30 blur-3xl" />
          <h2 className="mx-auto max-w-xl text-balance text-3xl font-extrabold sm:text-4xl">
            جاهز لتبدأ رحلتك التعليمية اليوم؟
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-ink-900/80">
            انضم إلى نبراس الآن مجاناً، واحصل على وصول فوري لمكتبة ضخمة من الدورات التعليمية الاحترافية.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-ink-950 px-9 py-4 text-sm font-extrabold text-white shadow-xl transition hover:scale-[1.02]"
          >
            أنشئ حسابك المجاني الآن
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
