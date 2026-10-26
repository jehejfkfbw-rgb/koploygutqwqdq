import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { lectures } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  title: z.string().trim().min(2).optional(),
  description: z.string().trim().optional().or(z.literal("")),
  videoUrl: z.string().trim().optional().or(z.literal("")),
  duration: z.coerce.number().int().min(0).optional(),
  order: z.coerce.number().int().min(0).optional(),
  isFreePreview: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح لك بالدخول" }, { status: 403 });
    }
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
    }
    const data: Record<string, unknown> = { ...parsed.data };
    if (data.description === "") data.description = null;
    if (data.videoUrl === "") data.videoUrl = null;

    const [updated] = await db.update(lectures).set(data).where(eq(lectures.id, Number(id))).returning();
    return NextResponse.json({ lecture: updated });
  } catch (error) {
    console.error("[api/admin/lectures/[id] PATCH] error:", error);
    return NextResponse.json({ error: "تعذّر تحديث المحاضرة" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح لك بالدخول" }, { status: 403 });
    }
    const { id } = await params;
    await db.delete(lectures).where(eq(lectures.id, Number(id)));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/lectures/[id] DELETE] error:", error);
    return NextResponse.json({ error: "تعذّر حذف المحاضرة" }, { status: 500 });
  }
}
