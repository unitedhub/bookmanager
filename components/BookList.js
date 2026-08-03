"use client";

import BookCard from "./BookCard";

const STATUS_FILTERS = [
  { value: "all", label: "All Books" },
  { value: "want-to-read", label: "📖 Want to Read" },
  { value: "reading", label: "📘 Reading" },
  { value: "completed", label: "✅ Completed" },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4 text-text-light">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function EmptyShelf({ hasSearch, hasFilter }) {
  const icon = hasSearch ? "🔍" : "📚";
  const title = hasSearch ? "No books match your search" : hasFilter ? "No books match this filter" : "Your shelf is empty";
  const subtitle = hasSearch
    ? "Try a different title, author, or tag."
    : hasFilter
    ? "Try selecting a different status or tag filter."
    : "Add your first book using the button above!";

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-3xl bg-primary-light flex items-center justify-center text-4xl mb-4 shadow-sm">
        {icon}
      </div>
      <h3 className="font-semibold text-text-main text-base">{title}</h3>
      <p className="text-sm text-text-muted mt-1 max-w-xs">{subtitle}</p>
    </div>
  );
}

export default function BookList({
  books,
  allTags,
  statusFilter,
  setStatusFilter,
  tagFilter,
  setTagFilter,
  searchQuery,
  onEdit,
  onDelete,
  onCycleStatus,
}) {
  return (
    <div id="library-section" className="space-y-5">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-text-main text-lg">Your Library</h2>
        <span className="text-sm text-text-muted font-medium">
          {books.length} {books.length === 1 ? "book" : "books"}
        </span>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition active:scale-95 ${
                statusFilter === f.value
                  ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                  : "border-gray-200 text-text-muted hover:border-primary/30 hover:bg-primary-light"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="ml-auto text-xs px-3.5 py-1.5 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text-muted font-medium transition cursor-pointer"
          >
            <option value="all">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Book grid / list */}
      {books.length === 0 ? (
        <EmptyShelf
          hasSearch={!!searchQuery}
          hasFilter={statusFilter !== "all" || tagFilter !== "all"}
        />
      ) : (
        <div className="space-y-3">
          {books.map((book) => (
            <div key={book._id} className="animate-fade-in">
              <BookCard
                book={book}
                onEdit={onEdit}
                onDelete={onDelete}
                onCycleStatus={onCycleStatus}
                searchQuery={searchQuery}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
