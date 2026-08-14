import type { Metadata } from "next";
import { FaqView } from "@/components/store/faq-view";
import { messages } from "@/lib/i18n";
import { loadSitePage } from "@/lib/medusa-cms";

export const metadata: Metadata = {
  title: `${messages.faq.nav} | ${messages.meta.title}`,
  description: messages.faq.metaDescription,
};

export default async function FaqPage() {
  const cms = await loadSitePage("faq");
  return <FaqView cms={cms} />;
}
