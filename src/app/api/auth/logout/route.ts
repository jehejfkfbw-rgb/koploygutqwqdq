import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/auth/logout] error:", error);
    return NextResponse.json({ error: "تعذّر تسجيل الخروج" }, { status: 500 });
  }
}
