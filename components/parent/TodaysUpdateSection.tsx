import EntryCard, { type ParentEntry } from "@/components/parent/EntryCard";

export default function TodaysUpdateSection({
  title,
  entries,
  emptyMessage,
}: {
  title: string;
  entries: ParentEntry[];
  emptyMessage: string;
}) {
  const bySubject = new Map<string, ParentEntry[]>();
  for (const entry of entries) {
    const key = entry.subject.name;
    if (!bySubject.has(key)) bySubject.set(key, []);
    bySubject.get(key)!.push(entry);
  }

  return (
    <section>
      <h2 className="mb-2 text-base font-bold text-gray-900">{title}</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {Array.from(bySubject.entries()).map(([subjectName, subjectEntries]) => (
            <div key={subjectName}>
              <h3 className="mb-1.5 text-sm font-semibold text-brand">{subjectName}</h3>
              <div className="flex flex-col gap-2">
                {subjectEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} showSubject={false} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
