import type { Metadata } from "next";
import { FaqView } from "@/components/store/faq-view";
import { messages } from "@/lib/i18n";

export const metadata: Metadata = {
  title: `${messages.faq.nav} | ${messages.meta.title}`,
  description: messages.faq.metaDescription,
};

export default function FaqPage() {
  return <FaqView />;
}
