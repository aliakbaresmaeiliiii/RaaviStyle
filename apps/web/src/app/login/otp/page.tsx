import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OtpForm } from "@/components/auth/otp-form";
import { getCustomer } from "@/lib/auth";
import { messages } from "@/lib/i18n";
import { normalizePhone } from "@/lib/phone";

export const metadata: Metadata = {
  title: `${messages.login.verifyTitle} | ${messages.meta.title}`,
};

export default async function OtpPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const customer = await getCustomer();

  if (customer) {
    redirect("/account");
  }

  const { phone: rawPhone } = await searchParams;
  const phone = normalizePhone(rawPhone ?? "");

  if (!phone) {
    redirect("/login");
  }

  return <OtpForm phone={phone} />;
}
