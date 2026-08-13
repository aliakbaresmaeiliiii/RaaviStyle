import { messages } from "@/lib/i18n";

export function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      {messages.shop.skipToContent}
    </a>
  );
}
