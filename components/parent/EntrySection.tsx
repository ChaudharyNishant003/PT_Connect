import EntryCard, { type ParentEntry } from "@/components/parent/EntryCard";

export default function EntrySection({
  title,
  entries,
  emptyMessage,
  urgent = false,
}: {
  title: string;
  entries: ParentEntry[];
  emptyMessage?: string;
  urgent?: boolean;
}) {
  if (entries.length === 0 && !emptyMessage) return null;

  return (
    <section>
      <h2 className={`mb-2 text-base font-bold ${urgent ? "text-red-700" : "text-gray-900"}`}>{title}</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </section>
  );
}
