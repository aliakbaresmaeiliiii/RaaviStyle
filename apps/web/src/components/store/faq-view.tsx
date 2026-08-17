import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaIcon } from "@/components/fa-icon";
import { messages } from "@/lib/i18n";
import type { SitePage } from "@/lib/medusa-cms";

const groups = [
  {
    id: "order",
    icon: "fa-bag-shopping",
    title: messages.faq.groupOrder,
    items: [
      { q: messages.faq.qLogin, a: messages.faq.aLogin },
      { q: messages.faq.qPay, a: messages.faq.aPay },
      { q: messages.faq.qCartHold, a: messages.faq.aCartHold },
    ],
  },
  {
    id: "size",
    icon: "fa-ruler",
    title: messages.faq.groupSize,
    items: [
      { q: messages.faq.qBetween, a: messages.faq.aBetween },
      { q: messages.faq.qModels, a: messages.faq.aModels },
      { q: messages.faq.qSizeChart, a: messages.faq.aSizeChart },
    ],
  },
  {
    id: "shipping",
    icon: "fa-truck",
    title: messages.faq.groupShip,
    items: [
      { q: messages.faq.qShipTime, a: messages.faq.aShipTime },
      { q: messages.faq.qShipFree, a: messages.faq.aShipFree },
      { q: messages.faq.qShipWhere, a: messages.faq.aShipWhere },
    ],
  },
  {
    id: "returns",
    icon: "fa-rotate-left",
    title: messages.faq.groupReturn,
    items: [
      { q: messages.faq.qReturnDays, a: messages.faq.aReturnDays },
      { q: messages.faq.qReturnCost, a: messages.faq.aReturnCost },
      { q: messages.faq.qReturnHow, a: messages.faq.aReturnHow },
    ],
  },
  {
    id: "product",
    icon: "fa-shield-halved",
    title: messages.faq.groupProduct,
    items: [
      { q: messages.faq.qColor, a: messages.faq.aColor },
      { q: messages.faq.qAuth, a: messages.faq.aAuth },
      { q: messages.faq.qOrigin, a: messages.faq.aOrigin },
    ],
  },
];

export function FaqView({ cms }: { cms?: SitePage | null }) {
  const title = cms?.title || messages.faq.title;
  const lead = cms?.body || messages.faq.lead;
  return (
    <main>
      <nav className="bg-soft" aria-label={messages.faq.nav}>
        <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 text-xs text-cocoa sm:px-6">
          <li>
            <Link href="/" className="hover:text-ink">
              {messages.shop.breadcrumbHome}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink">{messages.faq.nav}</li>
        </ol>
      </nav>

      <header className="login-panel relative overflow-hidden text-bone">
        <div className="login-grain opacity-20" />
        <span className="login-orb -top-20 -left-12 h-56 w-56 bg-mocha/35" />
        <span className="login-orb -right-16 bottom-0 h-64 w-64 bg-bronze/20" />
        <div className="relative mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-16">
         
          <h1 className="mt-4 max-w-xl text-4xl font-light leading-snug sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-lg text-base font-light leading-8 text-oat">
            {lead}
          </p>
          {cms?.image_url ? (
            <figure className="relative mt-8 hidden h-40 max-w-md overflow-hidden rounded-2xl ring-1 ring-white/10 sm:block">
              <Image
                src={cms.image_url}
                alt=""
                fill
                sizes="400px"
                className="object-cover"
              />
            </figure>
          ) : null}
          <ul className="mt-8 flex flex-wrap gap-2">
            {groups.map((group) => (
              <li key={group.id}>
                <a
                  href={`#${group.id}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-sm text-oat transition hover:border-bronze/50 hover:text-bronze"
                >
                  <FaIcon icon={group.icon} className="text-xs text-bronze" />
                  {group.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 lg:py-20">
        <aside className="hidden lg:block">
          <nav
            className="sticky top-28"
            aria-labelledby="faq-toc"
          >
            <p id="faq-toc" className="text-xs text-muted">
              {messages.faq.toc}
            </p>
            <ul className="mt-4 space-y-1 border-r border-line pr-4">
              {groups.map((group) => (
                <li key={group.id}>
                  <a
                    href={`#${group.id}`}
                    className="block py-1.5 text-sm text-muted transition hover:text-ink"
                  >
                    {group.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="space-y-14">
          {groups.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-28">
              <SectionKicker>
                <span className="inline-flex items-center gap-2">
                  <FaIcon icon={group.icon} className="text-xs" />
                  {group.title}
                </span>
              </SectionKicker>
              <h2 className="sr-only">{group.title}</h2>
              <ul className="mt-5 divide-y divide-line rounded-[1.5rem] bg-surface px-5 shadow-card sm:px-7">
                {group.items.map((item) => (
                  <li key={item.q}>
                    <details className="group py-1">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                        {item.q}
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-bronze motion-safe:transition group-open:border-bronze/40 group-open:bg-espresso group-open:text-bronze">
                          <FaIcon
                            icon="fa-plus"
                            className="text-[10px] motion-safe:transition group-open:rotate-45"
                          />
                        </span>
                      </summary>
                      <p className="max-w-2xl pb-5 text-sm leading-8 text-muted">
                        {item.a}
                      </p>
                    </details>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-espresso px-6 py-12 text-bone sm:px-12">
          <div className="login-grain opacity-15" />
          <span className="login-orb -left-10 -top-16 h-48 w-48 bg-mocha/35" />
          <span className="login-orb -bottom-16 -right-8 h-56 w-56 bg-bronze/20" />
          <div className="relative max-w-xl">
            <h2 className="text-3xl font-light leading-snug">
              {messages.faq.stillTitle}
            </h2>
            <p className="mt-4 text-sm leading-8 text-oat">
              {messages.faq.stillBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${messages.shop.email}`}
                className="inline-flex h-12 items-center rounded-full bg-bone px-6 text-sm text-espresso"
              >
                {messages.faq.stillContact}
              </a>
              <Link
                href="/products"
                className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm text-bone transition hover:border-bronze hover:text-bronze"
              >
                {messages.faq.stillShop}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionKicker({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-sm text-mocha">
      <span className="block h-px w-8 bg-bronze" aria-hidden="true" />
      {children}
    </p>
  );
}
