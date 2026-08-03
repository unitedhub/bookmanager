import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { getUserFromCookies } from "@/lib/auth";

const VALID_STATUSES = ["want-to-read", "reading", "completed"];

// GET /api/books?status=reading&tag=fiction
// Returns only the signed-in user's books, optionally filtered.
export async function GET(req) {
  const session = await getUserFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const tag = searchParams.get("tag");

    const query = { user: session.userId };
    if (status && VALID_STATUSES.includes(status)) {
      query.status = status;
    }
    if (tag) {
      query.tags = tag;
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ books });
  } catch (err) {
    console.error("List books error:", err);
    return NextResponse.json(
      { error: "Something went wrong fetching your books." },
      { status: 500 }
    );
  }
}

// POST /api/books — create a new book for the signed-in user.
export async function POST(req) {
  const session = await getUserFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const { title, author, tags, status } = await req.json();

    if (!title || !author) {
      return NextResponse.json(
        { error: "Title and author are required." },
        { status: 400 }
      );
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    await connectDB();

    const cleanTags = Array.isArray(tags)
      ? tags.map((t) => String(t).trim()).filter(Boolean)
      : [];

    const book = await Book.create({
      user: session.userId,
      title: title.trim(),
      author: author.trim(),
      tags: cleanTags,
      status: status || "want-to-read",
    });

    return NextResponse.json({ book }, { status: 201 });
  } catch (err) {
    console.error("Create book error:", err);
    return NextResponse.json(
      { error: "Something went wrong adding your book." },
      { status: 500 }
    );
  }
}
