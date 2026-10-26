import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sections } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { sectionSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح لك بالدخول" }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const parsed = sectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" }, { status: 400 });
    }

    const [created] = await db
      .insert(sections)
      .values({
        courseId: parsed.data.courseId,
        title: parsed.data.title,
        order: parsed.data.order ?? 0,
      })
      .returning();

    return NextResponse.json({ section: created });
  } catch (error) {
    console.error("[api/admin/sections POST] error:", error);
    return NextResponse.json({ error: "تعذّر إنشاء القسم" }, { status: 500 });
  }
}
