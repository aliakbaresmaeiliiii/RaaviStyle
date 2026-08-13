import Image from "next/image";
import Link from "next/link";
import { AuthProgress } from "@/components/auth/auth-progress";
import { BrandLogo, brandLogoSrc } from "@/components/brand-logo";
import { FaIcon } from "@/components/fa-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { messages } from "@/lib/i18n";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <section className="relative flex min-h-screen flex-col bg-page">
        <header className="flex items-center justify-between px-6 py-4 lg:px-12">
          <BrandLogo className="h-14 sm:h-16" priority />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line text-cocoa transition hover:border-mocha hover:text-mocha"
              aria-label={messages.notFound.home}
            >
              <FaIcon icon="fa-arrow-right" />
            </Link>
          </div>
        </header>
        <div className="flex flex-1 items-center px-6 py-6 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <AuthProgress />
            {children}
          </div>
        </div>
      </section>

      <aside className="login-panel relative hidden overflow-hidden lg:flex lg:min-h-screen lg:flex-col lg:justify-end">
        <div className="login-grain" />
        <span className="login-orb -top-20 -left-10 h-72 w-72 bg-mocha/40" />
        <span className="login-orb -right-15 bottom-[20%] h-80 w-80 bg-bronze/25" />
        <span className="login-orb top-[40%] left-[30%] h-40 w-40 bg-sage/20" />
        <Image
          src={brandLogoSrc}
          alt=""
          width={999}
          height={819}
          unoptimized
          className="pointer-events-none absolute top-[12%] left-1/2 z-10 w-[min(28rem,70%)] -translate-x-1/2 object-contain"
          sizes="448px"
        />
        <p className="absolute top-12 left-12 z-10 text-sm font-light text-bronze">
          {messages.login.collection}
        </p>
        <div className="relative z-10 p-14 text-bone">
          <p className="text-sm font-light text-bronze">
            {messages.login.panelKicker}
          </p>
          <h1 className="mt-4 max-w-md text-5xl font-light leading-snug">
            {messages.login.panelTitle}
          </h1>
          <p className="mt-5 max-w-sm text-base leading-8 font-light text-oat">
            {messages.login.panelBody}
          </p>
          <ul className="mt-10 space-y-4 text-sm text-oat">
            <li className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-bone/10 text-bronze">
                <FaIcon icon="fa-bolt" />
              </span>
              {messages.login.trustFast}
            </li>
            <li className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-bone/10 text-bronze">
                <FaIcon icon="fa-user-plus" />
              </span>
              {messages.login.trustAuto}
            </li>
          </ul>
        </div>
      </aside>
    </main>
  );
}
