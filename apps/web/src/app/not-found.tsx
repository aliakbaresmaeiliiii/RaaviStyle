import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { messages } from "@/lib/i18n";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col justify-center px-6 py-16">
      <BrandLogo className="h-20" />
      <p className="mt-10 text-sm text-mocha">۴۰۴</p>
      <h1 className="mt-3 text-3xl font-medium">{messages.notFound.title}</h1>
      <p className="mt-4 max-w-md text-muted">{messages.notFound.body}</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 w-fit items-center rounded-full bg-mocha px-7 text-bone hover:bg-espresso"
      >
        {messages.notFound.home}
      </Link>
    </main>
  );
}
