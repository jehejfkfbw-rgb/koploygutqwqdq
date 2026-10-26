import { ProfileForm } from "@/components/dashboard/profile-form";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">الملف الشخصي</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">قم بتحديث بياناتك الشخصية هنا</p>

      <div className="mt-8">
        <ProfileForm
          initialFullName={user.fullName}
          initialPhone={user.phone}
          initialGradeLevel={user.gradeLevel}
          email={user.email}
        />
      </div>
    </div>
  );
}
