import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserFromCookies } from "@/lib/auth";

export default async function Home() {
  const session = await getUserFromCookies();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Content card */}
      <div className="relative z-10 max-w-lg w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <span className="text-2xl">📚</span>
          </div>
          <span className="text-2xl font-bold text-text-main tracking-tight">Shelf</span>
        </div>

        {/* Hero card */}
        <div className="bg-white rounded-3xl shadow-card p-10 text-center space-y-6 animate-slide-up">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold text-text-main tracking-tight leading-tight">
              Your personal<br />
              <span className="text-primary">reading space.</span>
            </h1>
            <p className="text-text-muted leading-relaxed text-base">
              Log your books, track what you're reading, and rediscover your favourite authors — all in one beautiful place.
            </p>
          </div>

          {/* Stat pills */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent2 text-sm font-medium text-emerald-700">
              📖 Track Reading
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent1 text-sm font-medium text-rose-700">
              🏷️ Tag & Filter
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent4 text-sm font-medium text-violet-700">
              ✅ Mark Complete
            </span>
          </div>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              className="px-7 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/25 active:scale-95"
            >
              Get started free
            </Link>
            <Link
              href="/login"
              className="px-7 py-3 rounded-full border-2 border-primary/20 text-sm font-semibold text-text-main hover:bg-primary-light transition active:scale-95"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-text-light mt-6">
          No ads. No tracking. Just your books.
        </p>
      </div>
    </main>
  );
}
