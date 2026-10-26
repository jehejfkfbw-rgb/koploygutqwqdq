import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "nebras_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 14; // 14 days

export type SessionPayload = {
  userId: number;
  email: string;
  role: "student" | "admin";
  fullName: string;
};

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required to sign/verify sessions");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.userId === "number" &&
      typeof payload.email === "string" &&
      (payload.role === "student" || payload.role === "admin") &&
      typeof payload.fullName === "string"
    ) {
      return {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        fullName: payload.fullName,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = SESSION_DURATION_SECONDS;
