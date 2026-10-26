import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  fullName: z.string().trim().min(3).max(100).optional(),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(/^[0-9+\s-]+$/)
    .optional(),
  gradeLevel: z.string().trim().min(1).optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "الرجاء تسجيل الدخول" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "البيانات المدخلة غير صحيحة" }, { status: 400 });
    }

    const [updated] = await db
      .update(users)
      .set(parsed.data)
      .where(eq(users.id, user.id))
      .returning();

    return NextResponse.json({
      user: {
        id: updated.id,
        fullName: updated.fullName,
        email: updated.email,
        phone: updated.phone,
        gradeLevel: updated.gradeLevel,
        role: updated.role,
      },
    });
  } catch (error) {
    console.error("[api/account PATCH] error:", error);
    return NextResponse.json({ error: "تعذّر تحديث البيانات" }, { status: 500 });
  }
}
