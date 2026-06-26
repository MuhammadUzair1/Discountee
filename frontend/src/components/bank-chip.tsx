import type { Bank } from "@/lib/types";
import { cn } from "@/lib/utils";

export function BankChip({
  bank,
  size = "sm",
}: {
  bank?: Bank;
  size?: "sm" | "lg";
}) {
  if (!bank) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md font-bold text-white",
        size === "sm" ? "h-7 w-7 text-[10px]" : "h-11 w-11 text-xs",
      )}
      style={{ backgroundColor: bank.color }}
      aria-hidden
    >
      {bank.monogram}
    </span>
  );
}
