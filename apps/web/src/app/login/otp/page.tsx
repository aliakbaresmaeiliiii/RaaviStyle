import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OtpForm } from "@/components/auth/otp-form";
import { getCustomer } from "@/lib/auth";
import { messages } from "@/lib/i18n";
import { normalizePhone } from "@/lib/phone";

export const metadata: Metadata = {
  title: `${messages.login.stepCode} | ${messages.meta.title}`,
};

type OtpPageProps = {
  searchParams: Promise<{ phone?: string }>;
};

export default async function OtpPage({ searchParams }: OtpPageProps) {
  const customer = await getCustomer();

  if (customer) {
    redirect("/account");
  }

  const { phone } = await searchParams;
  const normalized = normalizePhone(phone ?? "");

  if (!normalized) {
    redirect("/login");
  }

  return <OtpForm phone={normalized} />;
}
