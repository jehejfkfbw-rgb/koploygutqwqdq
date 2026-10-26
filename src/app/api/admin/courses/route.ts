import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { courseSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

async function requireAdminOrNull() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET() {
  try {
    const admin = await requireAdminOrNull();
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح لك بالدخول" }, { status: 403 });
    }
    const rows = await db.select().from(courses).orderBy(desc(courses.createdAt));
    return NextResponse.json({ courses: rows });
  } catch (error) {
    console.error("[api/admin/courses GET] error:", error);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdminOrNull();
    if (!admin) {
      return NextResponse.json({ error: "غير مصرح لك بالدخول" }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const parsed = courseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" }, { status: 400 });
    }

    const existingSlug = await db.select({ id: courses.id }).from(courses).where(eq(courses.slug, parsed.data.slug)).limit(1);
    if (existingSlug.length > 0) {
      return NextResponse.json({ error: "هذا الرابط مستخدم بالفعل، اختر رابطاً آخر" }, { status: 409 });
    }

    const [created] = await db
      .insert(courses)
      .values({
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: parsed.data.description,
        category: parsed.data.category,
        level: parsed.data.level,
        instructorName: parsed.data.instructorName,
        coverImage: parsed.data.coverImage || null,
        price: parsed.data.price,
        isPublished: parsed.data.isPublished ?? true,
      })
      .returning();

    return NextResponse.json({ course: created });
  } catch (error) {
    console.error("[api/admin/courses POST] error:", error);
    return NextResponse.json({ error: "تعذّر إنشاء الدورة" }, { status: 500 });
  }
}
