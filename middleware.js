import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Note: middleware runs on the Edge runtime, which can't use jsonwebtoken/Node crypto,
// so we use `jose` here for verification only (auth cookie is still signed with the
// same JWT_SECRET via jsonwebtoken in lib/auth.js on normal Node routes).
const COOKIE_NAME = "book_manager_token";
const JWT_SECRET = process.env.JWT_SECRET || "development-secret-change-me";

export async function middleware(req) {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
