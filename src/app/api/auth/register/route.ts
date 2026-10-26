import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { signupSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "بيانات الطلب غير صحيحة" }, { status: 400 });
    }

    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "البيانات المدخلة غير صحيحة";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { fullName, email, phone, gradeLevel, password } = parsed.data;

    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "هذا البريد الإلكتروني مستخدم بالفعل، جرّب تسجيل الدخول" },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);

    const [createdUser] = await db
      .insert(users)
      .values({
        fullName,
        email,
        phone,
        gradeLevel,
        passwordHash,
        role: "student",
      })
      .returning();

    await setSessionCookie({
      userId: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
      fullName: createdUser.fullName,
    });

    return NextResponse.json({
      user: {
        id: createdUser.id,
        fullName: createdUser.fullName,
        email: createdUser.email,
        role: createdUser.role,
      },
    });
  } catch (error) {
    console.error("[api/auth/register] error:", error);
    return NextResponse.json({ error: "حدث خطأ غير متوقع، الرجاء المحاولة لاحقاً" }, { status: 500 });
  }
}
