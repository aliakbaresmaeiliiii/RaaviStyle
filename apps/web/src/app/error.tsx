"use client";

import { messages } from "@/lib/i18n";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-medium">{messages.error.title}</h1>
      <p className="mt-4 max-w-md text-muted">{messages.error.body}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex h-12 w-fit items-center rounded-full bg-mocha px-7 text-bone hover:bg-espresso"
      >
        {messages.error.retry}
      </button>
    </main>
  );
}
