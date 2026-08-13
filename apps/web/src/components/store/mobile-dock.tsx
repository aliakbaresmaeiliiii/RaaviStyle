import Link from "next/link";
import { FaIcon } from "@/components/fa-icon";
import { getCustomer } from "@/lib/auth";
import { messages } from "@/lib/i18n";

export async function MobileDock() {
  const customer = await getCustomer();

  const items = [
    { href: "/", icon: "fa-house", label: messages.shop.home },
    { href: "/products", icon: "fa-table-cells", label: messages.shop.categories },
    { href: "/cart", icon: "fa-cart-shopping", label: messages.shop.cart },
    {
      href: customer ? "/account" : "/login",
      icon: "fa-user",
      label: customer ? messages.nav.account : messages.nav.signIn,
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white sm:hidden">
      <ul className="grid grid-cols-4 text-xs">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex flex-col items-center gap-1 py-2 text-muted"
            >
              <FaIcon icon={item.icon} />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
