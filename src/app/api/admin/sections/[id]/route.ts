import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  title: z.string().trim().min(2).optional(),
  order: z.coerce.number().int().min(0).optional(),
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
    const [updated] = await db.update(sections).set(parsed.data).where(eq(sections.id, Number(id))).returning();
    return NextResponse.json({ section: updated });
  } catch (error) {
    console.error("[api/admin/sections/[id] PATCH] error:", error);
    return NextResponse.json({ error: "تعذّر تحديث القسم" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح لك بالدخول" }, { status: 403 });
    }
    const { id } = await params;
    await db.delete(sections).where(eq(sections.id, Number(id)));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/sections/[id] DELETE] error:", error);
    return NextResponse.json({ error: "تعذّر حذف القسم" }, { status: 500 });
  }
}
