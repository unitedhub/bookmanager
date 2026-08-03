"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Navbar";
import BookForm from "@/components/BookForm";
import BookList from "@/components/BookList";
import { NEXT_STATUS } from "@/components/BookCard";

// ─── Highlight matched text ────────────────────────────────────────
function HighlightText({ text, query }) {
  if (!query || !text) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-yellow-900 not-italic rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── Status pill ───────────────────────────────────────────────────
const STATUS_PILL_MAP = {
  "want-to-read": { label: "Want to Read", cls: "bg-warning-light text-amber-700" },
  reading: { label: "Reading", cls: "bg-blue-50 text-blue-700" },
  completed: { label: "Completed", cls: "bg-success-light text-emerald-700" },
};
function StatusPill({ status }) {
  const s = STATUS_PILL_MAP[status] || STATUS_PILL_MAP["want-to-read"];
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${s.cls}`}>
      {s.label}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────
function StatCard({ label, value, emoji, bg, accent, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl p-5 flex flex-col justify-between overflow-hidden shadow-card group transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1 ${bg} ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20 ${accent}`} />
      <div className="relative">
        <span className="text-2xl">{emoji}</span>
      </div>
      <div className="relative mt-4">
        <div className="text-3xl font-extrabold text-text-main">{value}</div>
        <div className="text-xs font-medium text-text-muted mt-0.5">{label}</div>
      </div>
      {onClick && (
        <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-3.5 h-3.5 text-text-muted">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────
function ReadingProgress({ stats }) {
  const total = stats.total || 1;
  const completedPct = Math.round((stats.completed / total) * 100);
  const readingPct = Math.round((stats.reading / total) * 100);
  const wantPct = Math.round((stats.wantToRead / total) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-text-main text-sm">Reading Progress</h3>
        <span className="text-xs text-text-muted">{stats.total} total books</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
        {completedPct > 0 && (
          <div className="bg-success h-full transition-all" style={{ width: `${completedPct}%` }} title={`Completed: ${completedPct}%`} />
        )}
        {readingPct > 0 && (
          <div className="bg-blue-400 h-full transition-all" style={{ width: `${readingPct}%` }} title={`Reading: ${readingPct}%`} />
        )}
        {wantPct > 0 && (
          <div className="bg-warning h-full transition-all" style={{ width: `${wantPct}%` }} title={`Want to Read: ${wantPct}%`} />
        )}
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <span className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="w-2.5 h-2.5 rounded-full bg-success inline-block" /> Completed ({completedPct}%)
        </span>
        <span className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" /> Reading ({readingPct}%)
        </span>
        <span className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="w-2.5 h-2.5 rounded-full bg-warning inline-block" /> Want to Read ({wantPct}%)
        </span>
      </div>
    </div>
  );
}

// ─── Mini recent book row ─────────────────────────────────────────
const STATUS_META = {
  "want-to-read": { label: "Want to Read", emoji: "📖", dot: "bg-warning", text: "text-amber-700", bg: "bg-warning-light" },
  reading: { label: "Reading", emoji: "📘", dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" },
  completed: { label: "Completed", emoji: "✅", dot: "bg-success", text: "text-emerald-700", bg: "bg-success-light" },
};

function RecentBookRow({ book }) {
  const meta = STATUS_META[book.status] || STATUS_META["want-to-read"];
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-9 h-12 rounded-lg bg-primary-light flex items-center justify-center text-base shrink-0 shadow-sm">
        {meta.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-text-main truncate">{book.title}</p>
        <p className="text-xs text-text-muted truncate">{book.author}</p>
      </div>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${meta.bg} ${meta.text}`}>
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${meta.dot} mr-1.5`} />
        {meta.label}
      </span>
    </div>
  );
}

// ─── Dashboard Client ─────────────────────────────────────────────
export default function DashboardClient({ user, initialBooks }) {
  const [books, setBooks] = useState(initialBooks ?? []);
  const [editingBook, setEditingBook] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("dashboard"); // "dashboard" | "books"
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Close autocomplete on outside click
  useEffect(() => {
    function handler(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
        setActiveIdx(-1);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // When editing a book, switch to Books panel automatically
  function handleEditBook(book) {
    setEditingBook(book);
    setActiveView("books");
  }

  // Autocomplete suggestions
  const suggestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return books
      .filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.tags || []).some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [books, searchQuery]);

  const stats = useMemo(() => ({
    total: books.length,
    wantToRead: books.filter((b) => b.status === "want-to-read").length,
    reading: books.filter((b) => b.status === "reading").length,
    completed: books.filter((b) => b.status === "completed").length,
  }), [books]);

  const allTags = useMemo(() => {
    const set = new Set();
    books.forEach((b) => (b.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [books]);

  const filteredBooks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return books.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (tagFilter !== "all" && !(b.tags || []).includes(tagFilter)) return false;
      if (q) {
        const inTitle = (b.title || "").toLowerCase().includes(q);
        const inAuthor = (b.author || "").toLowerCase().includes(q);
        const inTags = (b.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inAuthor && !inTags) return false;
      }
      return true;
    });
  }, [books, statusFilter, tagFilter, searchQuery]);

  const recentBooks = useMemo(() => books.slice(0, 5), [books]);

  async function handleAddOrUpdate(payload) {
    setError("");
    try {
      if (editingBook) {
        const res = await fetch(`/api/books/${editingBook._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        const updated = JSON.parse(JSON.stringify(data.book));
        setBooks((prev) => prev.map((b) => (b._id === editingBook._id ? updated : b)));
        setEditingBook(null);
      } else {
        const res = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        const added = JSON.parse(JSON.stringify(data.book));
        setBooks((prev) => [added, ...prev]);
      }
    } catch (err) {
      setError(err.message || "Something went wrong saving that book.");
    }
  }

  async function handleDelete(book) {
    if (!confirm(`Remove "${book.title}" from your shelf?`)) return;
    setError("");
    try {
      const res = await fetch(`/api/books/${book._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBooks((prev) => prev.filter((b) => b._id !== book._id));
    } catch (err) {
      setError(err.message || "Something went wrong deleting that book.");
    }
  }

  async function handleCycleStatus(book) {
    const newStatus = NEXT_STATUS[book.status];
    setError("");
    try {
      const res = await fetch(`/api/books/${book._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBooks((prev) => prev.map((b) => (b._id === book._id ? data.book : b)));
    } catch (err) {
      setError(err.message || "Something went wrong updating that book.");
    }
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user.name.split(" ")[0];

  return (
    <div className="relative min-h-screen bg-bg overflow-hidden">
      {/* Background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-3" />

      {/* Sidebar */}
      <Sidebar user={user} activeView={activeView} setActiveView={setActiveView} />

      {/* Sliding panel container */}
      <main className="ml-16 min-h-screen overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: activeView === "dashboard" ? "translateX(0%)" : "translateX(-50%)", width: "200%" }}
        >

          {/* ════════════ PANEL 1: Dashboard Overview ════════════ */}
          <div className="w-1/2 min-h-screen px-6 py-8">
            <div className="max-w-5xl mx-auto space-y-8">

              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="animate-fade-in">
                  <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
                    {greeting}, {firstName} 👋
                  </h1>
                  <p className="text-text-muted text-sm mt-1">
                    Here's what's on your shelf today.
                  </p>
                </div>

                {/* Search bar */}
                <div ref={searchRef} className="hidden sm:block relative min-w-72">
                  <div className={`flex items-center gap-2 bg-white rounded-2xl px-4 py-2.5 shadow-card border transition ${showDropdown ? "border-primary ring-2 ring-primary/20 rounded-b-none" : "border-gray-100"}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4 text-text-light shrink-0">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      ref={inputRef}
                      id="dashboard-search"
                      type="text"
                      placeholder="Search books, authors, tags…"
                      value={searchQuery}
                      autoComplete="off"
                      onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); setActiveIdx(-1); }}
                      onFocus={() => { if (searchQuery) setShowDropdown(true); }}
                      onKeyDown={(e) => {
                        if (!showDropdown || suggestions.length === 0) return;
                        if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1)); }
                        else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
                        else if (e.key === "Enter") { if (activeIdx >= 0) setSearchQuery(suggestions[activeIdx].title); setShowDropdown(false); setActiveIdx(-1); }
                        else if (e.key === "Escape") { setShowDropdown(false); setActiveIdx(-1); }
                      }}
                      className="bg-transparent text-sm text-text-main placeholder:text-text-light outline-none w-full min-w-0"
                    />
                    {searchQuery && (
                      <button onClick={() => { setSearchQuery(""); setShowDropdown(false); inputRef.current?.focus(); }} className="text-text-light hover:text-danger transition text-lg leading-none shrink-0" title="Clear">×</button>
                    )}
                    <button
                      id="search-btn"
                      onClick={() => { setShowDropdown(false); inputRef.current?.blur(); }}
                      className="shrink-0 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-primary-dark transition active:scale-95 shadow-sm"
                    >
                      Search
                    </button>
                  </div>

                  {/* Autocomplete dropdown */}
                  {showDropdown && searchQuery && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-primary/20 border-t-0 rounded-b-2xl shadow-card-hover z-50 overflow-hidden">
                      {suggestions.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-text-muted flex items-center gap-2">
                          <span>🔍</span>
                          <span>No books found for <strong>&quot;{searchQuery}&quot;</strong></span>
                        </div>
                      ) : (
                        <ul>
                          {suggestions.map((book, idx) => (
                            <li key={book._id}>
                              <button
                                onMouseDown={(e) => { e.preventDefault(); setSearchQuery(book.title); setShowDropdown(false); setActiveIdx(-1); }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-primary-light transition ${idx === activeIdx ? "bg-primary-light" : ""}`}
                              >
                                <span className="w-7 h-9 rounded bg-primary-light flex items-center justify-center text-base shrink-0">📖</span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-text-main truncate"><HighlightText text={book.title} query={searchQuery} /></p>
                                  <p className="text-xs text-text-muted truncate"><HighlightText text={book.author} query={searchQuery} /></p>
                                </div>
                                <StatusPill status={book.status} />
                              </button>
                            </li>
                          ))}
                          <li className="border-t border-gray-100">
                            <button
                              onMouseDown={(e) => { e.preventDefault(); setShowDropdown(false); }}
                              className="w-full px-4 py-2 text-xs text-primary font-semibold hover:bg-primary-light transition flex items-center gap-1.5"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-3.5 h-3.5">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                              </svg>
                              Show all results for &quot;{searchQuery}&quot;
                            </button>
                          </li>
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-slide-up">
                <StatCard label="Total Books" value={stats.total} emoji="📚" bg="bg-primary-light" accent="bg-primary" onClick={() => setActiveView("books")} />
                <StatCard label="Want to Read" value={stats.wantToRead} emoji="📖" bg="bg-warning-light" accent="bg-warning" onClick={() => { setStatusFilter("want-to-read"); setActiveView("books"); }} />
                <StatCard label="Currently Reading" value={stats.reading} emoji="📘" bg="bg-blue-50" accent="bg-blue-400" onClick={() => { setStatusFilter("reading"); setActiveView("books"); }} />
                <StatCard label="Completed" value={stats.completed} emoji="✅" bg="bg-success-light" accent="bg-success" onClick={() => { setStatusFilter("completed"); setActiveView("books"); }} />
              </div>

              {/* Reading progress */}
              {stats.total > 0 && <ReadingProgress stats={stats} />}

              {/* Recent books */}
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <h2 className="font-bold text-text-main text-sm">Recently Added</h2>
                  <button
                    onClick={() => setActiveView("books")}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    View all
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-3 h-3">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {recentBooks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center text-3xl mb-3">📚</div>
                    <p className="text-sm font-semibold text-text-main">No books yet</p>
                    <p className="text-xs text-text-muted mt-1">Head over to the Books tab to add your first book!</p>
                    <button
                      onClick={() => setActiveView("books")}
                      className="mt-4 text-xs bg-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-primary-dark transition active:scale-95 shadow-sm"
                    >
                      + Add a Book
                    </button>
                  </div>
                ) : (
                  <div className="px-5">
                    {recentBooks.map((book) => (
                      <RecentBookRow key={book._id} book={book} />
                    ))}
                  </div>
                )}
              </div>

              {/* Quick-add CTA */}
              <div
                onClick={() => setActiveView("books")}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 py-5 text-primary text-sm font-semibold cursor-pointer hover:border-primary hover:bg-primary-light transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-4 h-4">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Add a new book
              </div>

            </div>
          </div>

          {/* ════════════ PANEL 2: Books Library ════════════ */}
          <div className="w-1/2 min-h-screen px-6 py-8">
            <div className="max-w-5xl mx-auto space-y-8">

              {/* Header */}
              <div className="flex items-center justify-between gap-4 animate-fade-in">
                <div>
                  <h1 className="text-3xl font-extrabold text-text-main tracking-tight">My Library 📖</h1>
                  <p className="text-text-muted text-sm mt-1">
                    {books.length === 0 ? "Start building your shelf." : `${books.length} ${books.length === 1 ? "book" : "books"} on your shelf.`}
                  </p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-sm text-danger bg-danger-light rounded-xl px-4 py-3 animate-fade-in">
                  <span>⚠️</span><span>{error}</span>
                </div>
              )}

              {/* Add / Edit Book Form */}
              <BookForm
                onSubmit={handleAddOrUpdate}
                editingBook={editingBook}
                onCancelEdit={() => setEditingBook(null)}
              />

              {/* Book List */}
              <BookList
                books={filteredBooks}
                allTags={allTags}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                tagFilter={tagFilter}
                setTagFilter={setTagFilter}
                searchQuery={searchQuery}
                onEdit={handleEditBook}
                onDelete={handleDelete}
                onCycleStatus={handleCycleStatus}
              />

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
