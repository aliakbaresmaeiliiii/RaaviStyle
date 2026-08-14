import type { Metadata } from "next";
import { AboutView } from "@/components/store/about-view";
import { messages } from "@/lib/i18n";

export const metadata: Metadata = {
  title: `${messages.about.nav} | ${messages.meta.title}`,
  description: messages.about.metaDescription,
};

export default function AboutPage() {
  return <AboutView />;
}
