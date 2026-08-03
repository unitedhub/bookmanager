import { redirect } from "next/navigation";
import { getUserFromCookies } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Book from "@/models/Book";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getUserFromCookies();
  if (!session) {
    redirect("/login");
  }

  await connectDB();

  const user = await User.findById(session.userId).select("name email");
  if (!user) {
    redirect("/login");
  }

  const books = await Book.find({ user: session.userId }).sort({
    createdAt: -1,
  });

  return (
    <DashboardClient
      user={{ id: user._id.toString(), name: user.name, email: user.email }}
      initialBooks={JSON.parse(JSON.stringify(books))}
    />
  );
}
