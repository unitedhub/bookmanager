"use client";

// Highlight matching text
function HighlightText({ text, query }) {
  if (!query || !text) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5 not-italic">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

const STATUS_META = {
  "want-to-read": {
    label: "Want to Read",
    emoji: "📖",
    bg: "bg-warning-light",
    text: "text-amber-700",
    dot: "bg-warning",
  },
  reading: {
    label: "Reading",
    emoji: "📘",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  completed: {
    label: "Completed",
    emoji: "✅",
    bg: "bg-success-light",
    text: "text-emerald-700",
    dot: "bg-success",
  },
};

const NEXT_STATUS = {
  "want-to-read": "reading",
  reading: "completed",
  completed: "want-to-read",
};

export default function BookCard({ book, onEdit, onDelete, onCycleStatus, searchQuery }) {
  const meta = STATUS_META[book.status];

  return (
    <div className="book-card bg-white rounded-2xl border border-gray-100 p-4 flex items-start justify-between gap-4 shadow-card">
      {/* Left: book info */}
      <div className="min-w-0 flex-1 flex items-start gap-3">
        {/* Book cover placeholder */}
        <div className="shrink-0 w-10 h-14 rounded-lg bg-primary-light flex items-center justify-center text-lg shadow-sm">
          📖
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="font-semibold text-text-main truncate text-sm leading-snug">
            <HighlightText text={book.title} query={searchQuery} />
          </h3>
          <p className="text-xs text-text-muted truncate mt-0.5">
            <HighlightText text={book.author} query={searchQuery} />
          </p>

          {book.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {book.tags.map((tag) => (
                <span
                  key={tag}
                  className="tag-pill text-xs px-2 py-0.5 rounded-full bg-primary-light text-primary font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: status + actions */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <button
          onClick={() => onCycleStatus(book)}
          title="Click to advance reading status"
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition hover:brightness-95 active:scale-95 ${meta.bg} ${meta.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </button>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => onEdit(book)}
            className="text-xs text-text-muted hover:text-primary font-medium transition px-2 py-1 rounded-lg hover:bg-primary-light"
          >
            Edit
          </button>
          <span className="text-gray-200">·</span>
          <button
            onClick={() => onDelete(book)}
            className="text-xs text-text-muted hover:text-danger font-medium transition px-2 py-1 rounded-lg hover:bg-danger-light"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export { NEXT_STATUS };
