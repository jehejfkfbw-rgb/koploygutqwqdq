import { NextResponse } from "next/server";
import { db } from "@/db";
import { lectureProgress, lectures } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "الرجاء تسجيل الدخول" }, { status: 401 });
    }
    const { id } = await params;
    const lectureId = Number(id);
    if (!lectureId) {
      return NextResponse.json({ error: "محاضرة غير صحيحة" }, { status: 400 });
    }

    const [lecture] = await db.select().from(lectures).where(eq(lectures.id, lectureId)).limit(1);
    if (!lecture) {
      return NextResponse.json({ error: "المحاضرة غير موجودة" }, { status: 404 });
    }

    const existing = await db
      .select()
      .from(lectureProgress)
      .where(and(eq(lectureProgress.userId, user.id), eq(lectureProgress.lectureId, lectureId)))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(lectureProgress).values({ userId: user.id, lectureId });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/lectures/complete POST] error:", error);
    return NextResponse.json({ error: "تعذّر تحديث التقدم" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "الرجاء تسجيل الدخول" }, { status: 401 });
    }
    const { id } = await params;
    const lectureId = Number(id);

    await db
      .delete(lectureProgress)
      .where(and(eq(lectureProgress.userId, user.id), eq(lectureProgress.lectureId, lectureId)));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/lectures/complete DELETE] error:", error);
    return NextResponse.json({ error: "تعذّر تحديث التقدم" }, { status: 500 });
  }
}
