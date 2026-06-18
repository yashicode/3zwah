import "server-only";
import { cookies } from "next/headers";
import { findUser } from "./data/store";
import type { User } from "./types";

const SESSION_COOKIE = "sanad_session";

// Demo session: a signed/opaque cookie is faked with the user id. In production
// this becomes a short-lived JWT in an httpOnly cookie + rotating refresh token,
// with UAE PASS / OTP issuing the identity. The interface here stays the same.
export async function getSessionUser(): Promise<User | null> {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  return findUser(id) ?? null;
}

export async function setSession(userId: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
