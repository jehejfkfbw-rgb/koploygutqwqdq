import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { courses, enrollments, lectures, sections } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { courseSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

async function requireAdminOrNull() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminOrNull();
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح لك بالدخول" }, { status: 403 });
    }
    const { id } = await params;
    const courseId = Number(id);
    const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
    if (!course) {
      return NextResponse.json({ error: "الدورة غير موجودة" }, { status: 404 });
    }

    const courseSections = await db.select().from(sections).where(eq(sections.courseId, courseId)).orderBy(asc(sections.order));
    const courseLectures = await db.select().from(lectures).where(eq(lectures.courseId, courseId)).orderBy(asc(lectures.order));
    const enrolledRows = await db.select().from(enrollments).where(eq(enrollments.courseId, courseId));

    return NextResponse.json({
      course,
      sections: courseSections,
      lectures: courseLectures,
      enrolledCount: enrolledRows.length,
    });
  } catch (error) {
    console.error("[api/admin/courses/[id] GET] error:", error);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminOrNull();
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح لك بالدخول" }, { status: 403 });
    }
    const { id } = await params;
    const courseId = Number(id);

    const body = await request.json().catch(() => null);
    const parsed = courseSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (updateData.coverImage === "") updateData.coverImage = null;

    const [updated] = await db.update(courses).set(updateData).where(eq(courses.id, courseId)).returning();
    if (!updated) {
      return NextResponse.json({ error: "الدورة غير موجودة" }, { status: 404 });
    }

    return NextResponse.json({ course: updated });
  } catch (error) {
    console.error("[api/admin/courses/[id] PATCH] error:", error);
    return NextResponse.json({ error: "تعذّر تحديث الدورة" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminOrNull();
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح لك بالدخول" }, { status: 403 });
    }
    const { id } = await params;
    const courseId = Number(id);
    await db.delete(courses).where(eq(courses.id, courseId));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/courses/[id] DELETE] error:", error);
    return NextResponse.json({ error: "تعذّر حذف الدورة" }, { status: 500 });
  }
}
