import Link from "next/link";
import { Logo } from "./logo";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/offers"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground sm:block"
          >
            Browse offers
          </Link>
          <Link
            href="/architecture"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground sm:block"
          >
            Architecture
          </Link>
          <Link
            href="/offers"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-strong"
          >
            Find discounts
          </Link>
        </nav>
      </div>
    </header>
  );
}
