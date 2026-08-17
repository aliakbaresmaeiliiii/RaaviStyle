import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PhoneForm } from "@/components/auth/phone-form";
import { getCustomer } from "@/lib/auth";
import { messages } from "@/lib/i18n";

export const metadata: Metadata = {
  title: `${messages.login.formTitle} | ${messages.meta.title}`,
};

export default async function LoginPage() {
  const customer = await getCustomer();

  if (customer) {
    redirect("/");
  }

  return <PhoneForm />;
}

