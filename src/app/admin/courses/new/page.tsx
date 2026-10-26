import { CourseForm } from "@/components/admin/course-form";

export default function NewCoursePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">إضافة دورة جديدة</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
        أدخل المعلومات الأساسية للدورة، ثم يمكنك إضافة الأقسام والمحاضرات بعد الإنشاء
      </p>
      <div className="mt-8">
        <CourseForm />
      </div>
    </div>
  );
}
