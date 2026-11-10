import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { sql } from "./db";

const COOKIE = "rrcs_session";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

function key() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET must be set to a long random string.");
  return new TextEncoder().encode(s);
}

export async function startSession(userId) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${THIRTY_DAYS}s`)
    .sign(key());
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
}

export async function endSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

// Returns the signed-in user row, or null.
export async function currentUser() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    const rows = await sql`SELECT id, email, name, plan, ai_uses FROM users WHERE id = ${payload.uid}`;
    return rows[0] ?? null;
  } catch {
    return null;
  }
}
