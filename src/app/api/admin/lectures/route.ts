import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { lectures } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { lectureSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح لك بالدخول" }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const parsed = lectureSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" }, { status: 400 });
    }

    const [created] = await db
      .insert(lectures)
      .values({
        sectionId: parsed.data.sectionId,
        courseId: parsed.data.courseId,
        title: parsed.data.title,
        description: parsed.data.description || null,
        videoUrl: parsed.data.videoUrl || null,
        duration: parsed.data.duration ?? 0,
        order: parsed.data.order ?? 0,
        isFreePreview: parsed.data.isFreePreview ?? false,
      })
      .returning();

    return NextResponse.json({ lecture: created });
  } catch (error) {
    console.error("[api/admin/lectures POST] error:", error);
    return NextResponse.json({ error: "تعذّر إنشاء المحاضرة" }, { status: 500 });
  }
}
