import "./globals.css";

export const metadata = {
  title: "Shelf — Your Personal Book Manager",
  description: "A quiet, personal space to log your books and reading habits.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg text-text-main antialiased font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
