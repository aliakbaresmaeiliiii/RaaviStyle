import Link from "next/link";
import { FaIcon } from "@/components/fa-icon";
import { getCustomer } from "@/lib/auth";
import { messages } from "@/lib/i18n";

export async function SiteHeader() {
  const customer = await getCustomer();

  return (
    <header className="border-b border-line/70 bg-bone/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-xl font-medium hover:text-mocha"
        >
          {messages.brand}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {customer ? (
            <Link
              href="/account"
              className="inline-flex items-center gap-2 hover:text-mocha"
            >
              <FaIcon icon="fa-user" />
              {messages.nav.account}
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-mocha px-4 py-2 text-bone hover:bg-espresso"
            >
              <FaIcon icon="fa-right-to-bracket" />
              {messages.nav.signIn}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
