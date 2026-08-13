"use client";

import { usePathname } from "next/navigation";
import { messages } from "@/lib/i18n";

export function AuthProgress() {
  const pathname = usePathname();
  const isOtp = pathname.includes("/otp");

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-xs text-cocoa">
        <span>{messages.login.stepPhone}</span>
        <span>{messages.login.stepCode}</span>
      </div>
      <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-oat">
        <div
          className={`h-full bg-mocha transition-all duration-500 ${
            isOtp ? "w-full" : "w-1/2"
          }`}
        />
      </div>
    </div>
  );
}
