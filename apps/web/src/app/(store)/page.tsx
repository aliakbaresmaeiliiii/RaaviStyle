import Link from "next/link";
import { messages } from "@/lib/i18n";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center px-6 py-16">
      <p className="text-sm text-mocha">{messages.home.eyebrow}</p>
      <h1 className="mt-4 max-w-2xl text-4xl font-medium leading-snug md:text-5xl">
        {messages.home.title}
      </h1>
      <p className="mt-5 max-w-lg text-lg text-muted">{messages.home.body}</p>
      <Link
        href="/login"
        className="mt-8 inline-flex h-12 w-fit items-center rounded-full bg-mocha px-7 text-bone transition hover:bg-espresso"
      >
        {messages.home.signIn}
      </Link>
    </main>
  );
}
