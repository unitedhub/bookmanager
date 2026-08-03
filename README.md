# Shelf — A Personal Book Manager

A quiet, personal space for readers to log their books, track reading status,
and see their collection at a glance. Built with the MERN stack, using
Next.js (App Router) for both the frontend and the API.

## Features

- **Authentication** — sign up / log in / log out with JWT stored in an
  httpOnly cookie (not accessible to client-side JS, so it's safe from XSS
  token theft). Passwords are hashed with bcrypt, never stored in plain text.
- **Protected routes** — `/dashboard` is protected by Next.js middleware;
  every `/api/books*` route re-checks the JWT server-side and scopes all
  queries to `req.user`, so one user can never read or edit another user's
  books even by guessing an id.
- **Book collection** — add, edit, delete books (title, author, tags,
  status). Filter by status or tag.
- **Dashboard** — total book count, breakdown by status, and a one-click way
  to cycle a book's status (Want to Read → Reading → Completed).

## Tech Stack

| Layer      | Choice                                   |
|------------|-------------------------------------------|
| Frontend   | Next.js 14 (App Router), React            |
| Styling    | Tailwind CSS                              |
| Backend    | Next.js Route Handlers (`app/api/**`)     |
| Database   | MongoDB + Mongoose                        |
| Auth       | JWT (httpOnly cookie), bcrypt for hashing |

## Project Structure

```
book-manager/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.js
│   │   │   ├── login/route.js
│   │   │   ├── logout/route.js
│   │   │   └── me/route.js
│   │   └── books/
│   │       ├── route.js          # GET (list), POST (create)
│   │       └── [id]/route.js     # PUT (update), DELETE
│   ├── dashboard/
│   │   ├── page.js               # server component, fetches initial data
│   │   └── DashboardClient.js    # client component, holds UI state
│   ├── login/page.js
│   ├── signup/page.js
│   ├── layout.js
│   ├── page.js                   # landing page
│   └── globals.css
├── components/
│   ├── Navbar.js
│   ├── BookForm.js
│   ├── BookList.js
│   └── BookCard.js
├── lib/
│   ├── db.js                     # cached Mongoose connection
│   └── auth.js                   # JWT sign/verify + cookie helpers
├── models/
│   ├── User.js
│   └── Book.js
├── middleware.js                 # protects /dashboard at the edge
├── .env.example
└── package.json
```

## Getting Started Locally

### 1. Prerequisites

- Node.js 18+
- A MongoDB connection string — either a free
  [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster, or a local
  MongoDB instance.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env.local
```

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/book-manager
JWT_SECRET=some-long-random-string   # generate with: openssl rand -base64 32
NODE_ENV=development
```

### 4. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Deploying (Vercel + MongoDB Atlas)

1. Push this repo to GitHub.
2. Create a free cluster on MongoDB Atlas, add a database user, and
   whitelist `0.0.0.0/0` (or Vercel's IPs) under Network Access.
3. Import the repo into [Vercel](https://vercel.com/new).
4. In the Vercel project's **Settings → Environment Variables**, add:
   - `MONGODB_URI`
   - `JWT_SECRET`
5. Deploy. Vercel sets `NODE_ENV=production` automatically, which makes the
   auth cookie `Secure` (HTTPS-only).

## Design Notes

- **Why httpOnly cookies over localStorage for the JWT?** Storing the token
  in localStorage makes it readable — and stealable — by any script running
  on the page (XSS). An httpOnly cookie is invisible to JavaScript entirely,
  and `sameSite: "lax"` gives baseline CSRF protection.
- **Why middleware *and* per-route checks?** Middleware (using `jose`,
  which runs on the Edge runtime) gives a fast redirect for page navigation.
  Each API route independently re-verifies the token with `jsonwebtoken` on
  the Node runtime and scopes every database query to the authenticated
  user's id — so the API is safe to call directly, not just via the UI.
- **Status model:** stored as `want-to-read | reading | completed` internally
  (clean enum values), mapped to the 📖 / 📘 / ✅ labels at the UI layer.

## License

MIT — do whatever you'd like with this.
