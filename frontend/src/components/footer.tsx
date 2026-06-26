import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm text-muted">
              The single place to discover and compare bank-card discounts across
              Pakistan.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm">
            <div>
              <p className="font-semibold text-foreground">Explore</p>
              <ul className="mt-3 space-y-2 text-muted">
                <li>
                  <Link href="/offers" className="hover:text-foreground">
                    All offers
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="hover:text-foreground">
                    How it works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground">Company</p>
              <ul className="mt-3 space-y-2 text-muted">
                <li>About</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-xs text-muted">
          <p>
            Sample data shown for demonstration only — offers are illustrative and
            not verified. Always confirm terms with your bank. © {year} Discountee.
          </p>
        </div>
      </div>
    </footer>
  );
}
