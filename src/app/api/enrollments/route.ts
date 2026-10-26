import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { courses, enrollments } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "الرجاء تسجيل الدخول" }, { status: 401 });
    }

    const rows = await db
      .select({ enrollment: enrollments, course: courses })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, user.id));

    return NextResponse.json({ enrollments: rows });
  } catch (error) {
    console.error("[api/enrollments GET] error:", error);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "الرجاء تسجيل الدخول أولاً" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const courseId = Number(body?.courseId);
    if (!courseId) {
      return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
    }

    const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
    if (!course) {
      return NextResponse.json({ error: "الدورة غير موجودة" }, { status: 404 });
    }

    const existing = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, user.id), eq(enrollments.courseId, courseId)))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ enrollment: existing[0], alreadyEnrolled: true });
    }

    const [enrollment] = await db
      .insert(enrollments)
      .values({ userId: user.id, courseId })
      .returning();

    return NextResponse.json({ enrollment });
  } catch (error) {
    console.error("[api/enrollments POST] error:", error);
    return NextResponse.json({ error: "تعذّر إتمام التسجيل في الدورة" }, { status: 500 });
  }
}
