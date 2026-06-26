"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Bank } from "@/lib/types";
import { ALL_NETWORKS, ALL_TIERS } from "@/lib/utils";

const selectClass =
  "w-full appearance-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

export function CardSelector({ banks }: { banks: Bank[] }) {
  const router = useRouter();
  const [bankId, setBankId] = useState("");
  const [network, setNetwork] = useState("");
  const [tier, setTier] = useState("");

  function submit() {
    const params = new URLSearchParams();
    if (bankId) params.set("bank", bankId);
    if (network) params.set("network", network);
    if (tier) params.set("tier", tier);
    const qs = params.toString();
    router.push(qs ? `/offers?${qs}` : "/offers");
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-xl shadow-brand/5 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Your bank">
          <select
            className={selectClass}
            value={bankId}
            onChange={(e) => setBankId(e.target.value)}
          >
            <option value="">Any bank</option>
            {banks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Card network">
          <select
            className={selectClass}
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
          >
            <option value="">Any network</option>
            {ALL_NETWORKS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Card tier">
          <select
            className={selectClass}
            value={tier}
            onChange={(e) => setTier(e.target.value)}
          >
            <option value="">Any tier</option>
            {ALL_TIERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <button
        onClick={submit}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-strong"
      >
        <Search className="h-4 w-4" />
        Find my discounts
      </button>
    </div>
  );
}
