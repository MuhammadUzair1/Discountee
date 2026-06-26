import Link from "next/link";
import { BadgePercent } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2", className)}
      aria-label="Discountee home"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
        <BadgePercent className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <span className="text-lg font-semibold tracking-tight text-foreground">
        Discount<span className="text-brand">ee</span>
      </span>
    </Link>
  );
}
