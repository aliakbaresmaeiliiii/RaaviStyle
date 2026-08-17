import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { messages } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: messages.meta.title,
  description: messages.meta.description,
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    locale: "fa_IR",
    siteName: messages.brand,
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa-IR" dir="rtl" suppressHydrationWarning>
      <head>
        {/* <script dangerouslySetInnerHTML={{ __html: themeInitScript }} /> */}
        <link rel="stylesheet" href="/fonts/fontawesome.css" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
