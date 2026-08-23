"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import EntryCard, { type ParentEntry } from "@/components/parent/EntryCard";
import Button from "@/components/ui/Button";

function groupByDate(entries: ParentEntry[]) {
  const groups = new Map<string, ParentEntry[]>();
  for (const entry of entries) {
    const key = new Date(entry.entryDate).toDateString();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }
  return Array.from(groups.entries());
}

export default function HistoryList({
  token,
  initialEntries,
  initialCursor,
}: {
  token: string;
  initialEntries: ParentEntry[];
  initialCursor: string | null;
}) {
  const t = useTranslations("parent");
  const [entries, setEntries] = useState(initialEntries);
  const [cursor, setCursor] = useState(initialCursor);
  const [isLoading, setIsLoading] = useState(false);

  async function loadMore() {
    if (!cursor || isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/parent/${token}/history?cursor=${cursor}`);
      const data = await res.json();
      setEntries((prev) => [...prev, ...data.entries]);
      setCursor(data.nextCursor);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section>
      <h2 className="mb-2 text-base font-bold text-gray-900">{t("history")}</h2>
      <div className="flex flex-col gap-4">
        {groupByDate(entries).map(([date, dateEntries]) => (
          <div key={date}>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {new Date(date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
            </h3>
            <div className="flex flex-col gap-2">
              {dateEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {cursor && (
        <Button variant="secondary" className="mt-4 w-full" onClick={loadMore} disabled={isLoading}>
          {t("loadMore")}
        </Button>
      )}
    </section>
  );
}
