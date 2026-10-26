import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { BookOpen, LayoutDashboard, UserCircle } from "lucide-react";
import { SidebarShell } from "@/components/dashboard/sidebar-shell";
import { getCurrentUser } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/courses", label: "دوراتي", icon: BookOpen },
  { href: "/dashboard/profile", label: "الملف الشخصي", icon: UserCircle },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  return (
    <SidebarShell navItems={navItems} badge="لوحة الطالب">
      {children}
    </SidebarShell>
  );
}
