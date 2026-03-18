"use client";

import { useRouter } from "next/navigation";
import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  const router = useRouter();
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <main className="flex-1">
          <div className="flex min-h-screen items-center justify-center bg-muted">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold">404</h1>
              <p className="mb-4 text-xl text-muted-foreground">
                Oops! Page not found
              </p>
              <button
                onClick={() => {
                  router.push("/");
                  router.refresh();
                }}
                className="text-primary underline hover:text-primary/90"
              >
                Return to Home
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
