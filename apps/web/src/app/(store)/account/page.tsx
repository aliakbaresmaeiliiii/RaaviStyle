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
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <p className="text-sm text-mocha">{messages.account.eyebrow}</p>
      <h1 className="mt-3 text-3xl font-medium">{messages.account.title}</h1>
      <dl className="mt-8 max-w-lg space-y-4 rounded-2xl border border-line bg-surface p-6">
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
      <form action={logout} className="mt-8">
        <button
          type="submit"
          className="h-11 rounded-full border border-line px-6 hover:border-mocha hover:text-mocha"
        >
          {messages.account.signOut}
        </button>
      </form>
    </main>
  );
}
