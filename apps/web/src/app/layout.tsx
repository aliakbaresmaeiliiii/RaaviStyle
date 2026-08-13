import type { Metadata } from "next";
import { messages } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: messages.meta.title,
  description: messages.meta.description,
  openGraph: {
    locale: "fa_IR",
    siteName: messages.brand,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa-IR" dir="rtl">
      <head>
        <link rel="stylesheet" href="/fonts/fontawesome.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
