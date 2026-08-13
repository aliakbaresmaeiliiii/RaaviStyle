"use client";

import { usePathname } from "next/navigation";
import { messages } from "@/lib/i18n";

export function AuthProgress() {
  const pathname = usePathname();
  const isOtp = pathname.includes("/otp");

  return (
    <ol className="mb-8 flex items-center gap-3 text-sm">
      <li
        className={`flex items-center gap-2 ${
          isOtp ? "text-muted" : "text-ink"
        }`}
      >
        <span
          className={`flex size-6 items-center justify-center rounded-full text-xs ${
            isOtp ? "bg-soft text-muted" : "bg-mocha text-bone"
          }`}
        >
          ۱
        </span>
        {messages.login.stepPhone}
      </li>
      <span className="h-px flex-1 bg-line" aria-hidden="true" />
      <li
        className={`flex items-center gap-2 ${
          isOtp ? "text-ink" : "text-muted"
        }`}
      >
        <span
          className={`flex size-6 items-center justify-center rounded-full text-xs ${
            isOtp ? "bg-mocha text-bone" : "bg-soft text-muted"
          }`}
        >
          ۲
        </span>
        {messages.login.stepCode}
      </li>
    </ol>
  );
}
