import { useTranslations } from "next-intl";
import EntryPhotoGrid from "@/components/parent/EntryPhotoGrid";

export interface ParentEntry {
  id: string;
  type: "CLASSWORK" | "HOMEWORK" | "TEST" | "REVISION";
  entryDate: string;
  dueDate: string | null;
  caption: string | null;
  subject: { name: string; color: string | null };
  photos: { id: string; url: string }[];
}

const TYPE_STYLES: Record<ParentEntry["type"], string> = {
  CLASSWORK: "bg-gray-100 text-gray-700",
  HOMEWORK: "bg-amber-100 text-amber-800",
  TEST: "bg-red-100 text-red-800",
  REVISION: "bg-purple-100 text-purple-800",
};

export default function EntryCard({ entry, showSubject = true }: { entry: ParentEntry; showSubject?: boolean }) {
  const t = useTranslations("addWork");

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      <div className="flex flex-wrap items-center gap-2">
        {showSubject && <span className="text-sm font-semibold text-gray-900">{entry.subject.name}</span>}
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_STYLES[entry.type]}`}>
          {t(`entryType.${entry.type}`)}
        </span>
        {entry.dueDate && (
          <span className="text-xs text-gray-500">
            Due {new Date(entry.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      {entry.caption && <p className="mt-1 text-sm text-gray-700">{entry.caption}</p>}
      <EntryPhotoGrid photos={entry.photos} label={`${entry.subject.name} ${t(`entryType.${entry.type}`).toLowerCase()}`} />
    </div>
  );
}
