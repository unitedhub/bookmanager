"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="relative z-10 w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <span className="text-xl">📚</span>
          </div>
          <span className="text-xl font-bold text-text-main">Shelf</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-card p-8 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-text-main">Create your shelf ✨</h1>
            <p className="text-sm text-text-muted">A few seconds and you're in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-text-main block">Full Name</label>
              <input
                id="signup-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition"
                placeholder="Jane Reader"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-text-main block">Email</label>
              <input
                id="signup-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition"
                placeholder="jane@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-text-main block">Password</label>
              <input
                id="signup-password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition"
                placeholder="At least 6 characters"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-danger bg-danger-light rounded-xl px-4 py-3">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/25 disabled:opacity-60 active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
