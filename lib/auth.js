import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "development-secret-change-me";
const COOKIE_NAME = "book_manager_token";
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

async function getCookieStore() {
  return await cookies();
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_MAX_AGE_SECONDS });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Sets the JWT as an httpOnly cookie so it can't be read by client-side JS (XSS-safe).
export async function setAuthCookie(token) {
  const cookieStore = await getCookieStore();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_MAX_AGE_SECONDS,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await getCookieStore();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

// Reads and verifies the token from the incoming request cookies.
// Returns the decoded payload ({ userId, email }) or null if not authenticated.
export async function getUserFromCookies() {
  const cookieStore = await getCookieStore();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
