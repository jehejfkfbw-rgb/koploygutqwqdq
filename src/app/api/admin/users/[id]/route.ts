import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  role: z.enum(["student", "admin"]),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح لك بالدخول" }, { status: 403 });
    }
    const { id } = await params;
    const targetId = Number(id);

    const body = await request.json().catch(() => null);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
    }

    if (targetId === admin.id) {
      return NextResponse.json({ error: "لا يمكنك تعديل صلاحيات حسابك الخاص" }, { status: 400 });
    }

    const [updated] = await db.update(users).set({ role: parsed.data.role }).where(eq(users.id, targetId)).returning();
    if (!updated) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    return NextResponse.json({
      user: { id: updated.id, fullName: updated.fullName, email: updated.email, role: updated.role },
    });
  } catch (error) {
    console.error("[api/admin/users/[id] PATCH] error:", error);
    return NextResponse.json({ error: "تعذّر تحديث المستخدم" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح لك بالدخول" }, { status: 403 });
    }
    const { id } = await params;
    const targetId = Number(id);

    if (targetId === admin.id) {
      return NextResponse.json({ error: "لا يمكنك حذف حسابك الخاص" }, { status: 400 });
    }

    await db.delete(users).where(eq(users.id, targetId));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/users/[id] DELETE] error:", error);
    return NextResponse.json({ error: "تعذّر حذف المستخدم" }, { status: 500 });
  }
}
