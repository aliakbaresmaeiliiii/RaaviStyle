"use client";

import { useEffect, useState } from "react";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export function OfferCountdown({ seconds = 8 * 60 * 60 }: { seconds?: number }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLeft((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const hours = Math.floor(left / 3600);
  const minutes = Math.floor((left % 3600) / 60);
  const secs = left % 60;

  return (
    <div dir="ltr" className="flex items-center gap-1 text-sm font-medium">
      <span className="rounded-md bg-surface px-1.5 py-0.5 text-sale">
        {pad(secs)}
      </span>
      <span>:</span>
      <span className="rounded-md bg-surface px-1.5 py-0.5 text-sale">
        {pad(minutes)}
      </span>
      <span>:</span>
      <span className="rounded-md bg-surface px-1.5 py-0.5 text-sale">
        {pad(hours)}
      </span>
    </div>
  );
}
