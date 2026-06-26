"use client";

import { useState } from "react";
import { Check, Flag } from "lucide-react";

export function ReportOfferButton() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <span className="inline-flex items-center gap-2 text-sm font-medium text-brand">
        <Check className="h-4 w-4" />
        Thanks — we&apos;ll re-check this offer.
      </span>
    );
  }

  return (
    <button
      onClick={() => setDone(true)}
      className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition-colors hover:border-foreground/30 hover:text-foreground"
    >
      <Flag className="h-4 w-4" />
      Report incorrect offer
    </button>
  );
}
