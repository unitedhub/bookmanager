import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserFromCookies } from "@/lib/auth";

export async function GET() {
  const session = await getUserFromCookies();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    await connectDB();
    const user = await User.findById(session.userId).select("name email");
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    return NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Me route error:", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
