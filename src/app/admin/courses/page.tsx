import { CoursesTable } from "@/components/admin/courses-table";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const allCourses = await db.select().from(courses).orderBy(desc(courses.createdAt));
  return <CoursesTable initialCourses={allCourses} />;
}
