import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { FaIcon } from "@/components/fa-icon";
import { messages } from "@/lib/i18n";

export function StoreFooter() {
  return (
    <footer className="mt-10 border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandLogo className="h-14" />
          <p className="mt-4 text-sm leading-7 text-muted">
            {messages.shop.footerAbout}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-medium">{messages.shop.footerShop}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/products" className="hover:text-mocha">
                {messages.shop.allCategories}
              </Link>
            </li>
            <li>
              <Link href="/products?cat=sale" className="hover:text-mocha">
                {messages.shop.amazing}
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-mocha">
                {messages.nav.signIn}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-medium">{messages.shop.footerHelp}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>{messages.shop.shipping}</li>
            <li>{messages.shop.returns}</li>
            <li>{messages.shop.faq}</li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-medium">{messages.shop.footerContact}</h2>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted">
            <FaIcon icon="fa-phone" />
            {messages.shop.phone}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <FaIcon icon="fa-envelope" />
            {messages.shop.email}
          </p>
        </div>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">
        {messages.shop.copyright}
      </p>
    </footer>
  );
}
