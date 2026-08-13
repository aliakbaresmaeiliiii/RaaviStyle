import type { ReactNode } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { FaIcon } from "@/components/fa-icon";
import { categories } from "@/lib/catalog";
import { messages } from "@/lib/i18n";

const shopLinks = [
  { href: "/products", label: messages.shop.allCategories },
  { href: "/products?cat=sale", label: messages.shop.amazing },
  ...categories.slice(0, 5).map((category) => ({
    href: category.href,
    label: category.label,
  })),
];

const helpItems = [
  messages.shop.shipping,
  messages.shop.returns,
  messages.shop.faq,
];

const trustItems = [
  {
    icon: "fa-truck",
    title: messages.shop.footerTrustShip,
    hint: messages.shop.footerTrustShipHint,
  },
  {
    icon: "fa-rotate-left",
    title: messages.shop.footerTrustReturn,
    hint: messages.shop.footerTrustReturnHint,
  },
  {
    icon: "fa-ruler",
    title: messages.shop.footerTrustFit,
    hint: messages.shop.footerTrustFitHint,
  },
];

const socialLinks = [
  {
    href: "https://www.instagram.com/raavistyle",
    label: messages.shop.instagram,
    icon: InstagramIcon,
  },
  {
    href: "https://t.me/raavistyle",
    label: messages.shop.telegram,
    icon: TelegramIcon,
  },
];

export function StoreFooter() {
  return (
    <footer className="store-footer relative mt-16 overflow-hidden text-bone">
      <div className="login-grain opacity-15" />
      <span className="login-orb -top-24 -left-16 h-64 w-64 bg-mocha/25" />
      <span className="login-orb -right-20 bottom-0 h-72 w-72 bg-bronze/15" />

      <div className="relative">
        <ul className="mx-auto grid max-w-7xl border-b border-white/10 sm:grid-cols-3">
          {trustItems.map((item) => (
            <li
              key={item.title}
              className="flex items-start gap-4 border-b border-white/10 px-6 py-7 last:border-b-0 sm:border-b-0 sm:border-e sm:px-8 sm:py-8 sm:last:border-e-0"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-bronze/30 bg-white/5 text-bronze">
                <FaIcon icon={item.icon} />
              </span>
              <div>
                <p className="text-sm font-medium text-bone">{item.title}</p>
                <p className="mt-1 text-xs leading-6 text-oat/70">{item.hint}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[1.35fr_repeat(3,minmax(0,1fr))] lg:gap-12">
          <div>
            <BrandLogo className="h-14" />
            <p className="mt-5 max-w-sm text-sm leading-8 text-oat/80">
              {messages.shop.footerAbout}
            </p>
            <p className="mt-8 text-xs text-bronze/90">
              {messages.shop.footerFollow}
            </p>
            <ul className="mt-3 flex gap-2">
              {socialLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-oat transition hover:border-bronze/50 hover:bg-bronze/15 hover:text-bronze"
                  >
                    <item.icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-labelledby="footer-shop">
            <FooterHeading id="footer-shop">
              {messages.shop.footerShop}
            </FooterHeading>
            <ul className="mt-5 space-y-3">
              {shopLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-oat/75 transition hover:text-bronze"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <FooterHeading id="footer-help">
              {messages.shop.footerHelp}
            </FooterHeading>
            <ul className="mt-5 space-y-3">
              {helpItems.map((item) => (
                <li key={item} className="text-sm text-oat/75">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterHeading id="footer-contact">
              {messages.shop.footerContact}
            </FooterHeading>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="tel:+982191000000"
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-3 py-3 transition hover:border-bronze/40 hover:bg-white/7"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-bronze/15 text-bronze">
                    <FaIcon icon="fa-phone" />
                  </span>
                  <span className="text-sm text-oat group-hover:text-bone" dir="ltr">
                    {messages.shop.phone}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${messages.shop.email}`}
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-3 py-3 transition hover:border-bronze/40 hover:bg-white/7"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-bronze/15 text-bronze">
                    <FaIcon icon="fa-envelope" />
                  </span>
                  <span className="text-sm text-oat group-hover:text-bone">
                    {messages.shop.email}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <p className="mx-auto max-w-7xl px-6 py-5 text-center text-xs text-oat/55 sm:px-8">
            {messages.shop.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 id={id} className="text-sm font-medium text-bone">
        {children}
      </h2>
      <span className="mt-3 block h-px w-8 bg-bronze/80" aria-hidden="true" />
    </div>
  );
}

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TelegramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M21.4 4.2 18.2 19.7c-.2.9-.8 1.1-1.7.7l-4.7-3.4-2.3 2.2c-.2.2-.5.5-.9.5l.3-4.8 12.1-10.8c.4-.4-.1-.6-.6-.3L6.9 12.7 2.3 11.2c-1-.3-1-1 .3-1.5l17.8-6.8c.9-.4 1.7.2 1 1.3Z" />
    </svg>
  );
}
