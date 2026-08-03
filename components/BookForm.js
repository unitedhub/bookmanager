"use client";

import { useState, useEffect } from "react";

const STATUS_OPTIONS = [
  { value: "want-to-read", label: "📖 Want to Read", bg: "bg-warning-light", active: "bg-amber-500 text-white border-amber-500" },
  { value: "reading", label: "📘 Reading", bg: "bg-blue-50", active: "bg-blue-500 text-white border-blue-500" },
  { value: "completed", label: "✅ Completed", bg: "bg-success-light", active: "bg-emerald-500 text-white border-emerald-500" },
];

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-4 h-4">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default function BookForm({ onSubmit, editingBook, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("want-to-read");
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setAuthor(editingBook.author);
      setTags((editingBook.tags || []).join(", "));
      setStatus(editingBook.status);
      setOpen(true);
    }
  }, [editingBook]);

  function resetForm() {
    setTitle("");
    setAuthor("");
    setTags("");
    setStatus("want-to-read");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    setSubmitting(true);
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await onSubmit({
      title: title.trim(),
      author: author.trim(),
      tags: tagList,
      status,
    });

    setSubmitting(false);
    resetForm();
    setOpen(false);
  }

  function handleCancel() {
    resetForm();
    setOpen(false);
    if (onCancelEdit) onCancelEdit();
  }

  if (!open) {
    return (
      <button
        id="add-book-btn"
        onClick={() => setOpen(true)}
        className="w-full py-3.5 rounded-2xl border-2 border-dashed border-primary/30 text-primary/70 hover:border-primary hover:text-primary hover:bg-primary-light/50 transition text-sm font-semibold flex items-center justify-center gap-2 group"
      >
        <span className="w-7 h-7 rounded-full bg-primary-light group-hover:bg-primary group-hover:text-white flex items-center justify-center transition">
          <PlusIcon />
        </span>
        Add a new book
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-text-main text-base">
          {editingBook ? "✏️ Edit Book" : "📚 Add New Book"}
        </h3>
        <button
          type="button"
          onClick={handleCancel}
          className="w-8 h-8 rounded-full text-text-muted hover:bg-gray-100 flex items-center justify-center text-lg transition"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Title</label>
            <input
              id="book-title"
              type="text"
              placeholder="e.g. Atomic Habits"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Author</label>
            <input
              id="book-author"
              type="text"
              placeholder="e.g. James Clear"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Tags</label>
          <input
            id="book-tags"
            type="text"
            placeholder="fiction, self-help, sci-fi  (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition"
          />
        </div>

        {/* Status picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Reading Status</label>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setStatus(opt.value)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border-2 transition active:scale-95 ${
                  status === opt.value
                    ? opt.active
                    : "border-gray-200 text-text-muted hover:border-primary/30 hover:bg-primary-light"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            id="book-submit"
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/25 disabled:opacity-60 active:scale-95 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : editingBook ? (
              "Save Changes"
            ) : (
              "Add Book"
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-full text-sm font-semibold text-text-muted hover:bg-gray-100 transition active:scale-95"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
