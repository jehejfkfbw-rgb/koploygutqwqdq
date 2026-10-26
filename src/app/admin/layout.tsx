import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { BookOpen, LayoutDashboard, Users } from "lucide-react";
import { SidebarShell } from "@/components/dashboard/sidebar-shell";
import { getCurrentUser } from "@/lib/auth";

const navItems = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
  { href: "/admin/courses", label: "إدارة الدورات", icon: BookOpen },
  { href: "/admin/users", label: "إدارة المستخدمين", icon: Users },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/admin");
  }
  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <SidebarShell navItems={navItems} badge="لوحة الإدارة">
      {children}
    </SidebarShell>
  );
}
