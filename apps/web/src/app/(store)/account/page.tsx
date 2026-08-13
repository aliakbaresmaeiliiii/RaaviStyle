import Link from "next/link";
import { redirect } from "next/navigation";
import { getCustomer, logout } from "@/lib/auth";
import { messages } from "@/lib/i18n";
import { formatPhoneForDisplay } from "@/lib/phone";

export default async function AccountPage() {
  const customer = await getCustomer();

  if (!customer) {
    redirect("/login");
  }

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-10">
      <p className="text-sm text-mocha">{messages.account.eyebrow}</p>
      <h1 className="mt-2 text-3xl font-medium">{messages.account.welcome}</h1>
      <p className="mt-2 text-sm leading-7 text-muted">{messages.account.hint}</p>
      <dl className="mt-8 space-y-4 rounded-2xl bg-surface p-6 shadow-card">
        <div>
          <dt className="text-sm text-muted">{messages.account.phone}</dt>
          <dd className="mt-1" dir="ltr">
            {formatPhoneForDisplay(customer.phone ?? "")}
          </dd>
        </div>
        {customer.first_name || customer.last_name ? (
          <div>
            <dt className="text-sm text-muted">{messages.account.name}</dt>
            <dd className="mt-1">
              {[customer.first_name, customer.last_name]
                .filter(Boolean)
                .join(" ")}
            </dd>
          </div>
        ) : null}
      </dl>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/products"
          className="inline-flex h-11 items-center rounded-full bg-espresso px-6 text-sm text-white"
        >
          {messages.account.continueShopping}
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="h-11 rounded-full border border-line px-6 hover:border-mocha hover:text-mocha"
          >
            {messages.account.signOut}
          </button>
        </form>
      </div>
    </main>
  );
}
