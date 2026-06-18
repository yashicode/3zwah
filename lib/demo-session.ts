import "server-only";
import { cookies } from "next/headers";
import { findUser, upsertUserByPhone } from "./data/store";
import type { User } from "./types";

const SESSION_COOKIE = "sanad_session";

// For this stakeholder demo we don't force a sign-in: the first interactive
// action (assistant, booking, enrolling) silently provisions a caregiver
// named "Amal" and binds her to the session cookie, so every flow works out
// of the box. In production this is replaced by UAE PASS / phone-OTP issuing
// a real identity — the rest of the code keeps using getSessionUser() / the
// returned User unchanged. Only call this from route handlers or server
// actions (it writes a cookie).
export async function ensureDemoUser(): Promise<User> {
  const store = await cookies();
  const existingId = store.get(SESSION_COOKIE)?.value;
  if (existingId) {
    const found = findUser(existingId);
    if (found) return found;
  }
  const user = upsertUserByPhone("+971500000000", "Amal");
  store.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return user;
}
