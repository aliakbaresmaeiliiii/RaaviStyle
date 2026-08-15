import type { Metadata } from "next";
import { AboutView } from "@/components/store/about-view";
import { messages } from "@/lib/i18n";
import { loadStoreProducts } from "@/lib/medusa-catalog";
import { loadSitePage } from "@/lib/medusa-cms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: `${messages.about.nav} | ${messages.meta.title}`,
  description: messages.about.metaDescription,
};

export default async function AboutPage() {
  const [products, cms] = await Promise.all([
    loadStoreProducts(),
    loadSitePage("about"),
  ]);

  return <AboutView products={products} cms={cms} />;
}
