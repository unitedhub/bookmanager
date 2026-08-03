import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { getUserFromCookies } from "@/lib/auth";

const VALID_STATUSES = ["want-to-read", "reading", "completed"];

// PUT /api/books/:id — update a book. Only the owner may update it.
export async function PUT(req, { params }) {
  const session = await getUserFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    await connectDB();

    const book = await Book.findById(id);
    if (!book) {
      return NextResponse.json({ error: "Book not found." }, { status: 404 });
    }
    if (book.user.toString() !== session.userId) {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    if (body.title !== undefined) book.title = String(body.title).trim();
    if (body.author !== undefined) book.author = String(body.author).trim();
    if (body.tags !== undefined) {
      book.tags = Array.isArray(body.tags)
        ? body.tags.map((t) => String(t).trim()).filter(Boolean)
        : book.tags;
    }
    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      book.status = body.status;
    }

    await book.save();

    return NextResponse.json({ book });
  } catch (err) {
    console.error("Update book error:", err);
    return NextResponse.json(
      { error: "Something went wrong updating that book." },
      { status: 500 }
    );
  }
}

// DELETE /api/books/:id — delete a book. Only the owner may delete it.
export async function DELETE(req, { params }) {
  const session = await getUserFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectDB();

    const book = await Book.findById(id);
    if (!book) {
      return NextResponse.json({ error: "Book not found." }, { status: 404 });
    }
    if (book.user.toString() !== session.userId) {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    await book.deleteOne();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete book error:", err);
    return NextResponse.json(
      { error: "Something went wrong deleting that book." },
      { status: 500 }
    );
  }
}
