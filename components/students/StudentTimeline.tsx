"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import BottomSheet from "@/components/ui/BottomSheet";
import Chip from "@/components/ui/Chip";
import Button from "@/components/ui/Button";

interface Photo {
  id: string;
  url: string;
}

interface Entry {
  id: string;
  type: "CLASSWORK" | "HOMEWORK" | "TEST" | "REVISION";
  entryDate: string;
  dueDate: string | null;
  caption: string | null;
  subject: { id: string; name: string };
  photos: Photo[];
}

interface Subject {
  id: string;
  name: string;
}

const ENTRY_TYPES = ["CLASSWORK", "HOMEWORK", "TEST", "REVISION"] as const;

function groupByDate(entries: Entry[]) {
  const groups = new Map<string, Entry[]>();
  for (const entry of entries) {
    const key = new Date(entry.entryDate).toDateString();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }
  return Array.from(groups.entries());
}

export default function StudentTimeline({ studentId, subjects }: { studentId: string; subjects: Subject[] }) {
  const t = useTranslations();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ studentId });
      if (subjectFilter) params.set("subjectId", subjectFilter);
      if (typeFilter) params.set("type", typeFilter);
      const res = await fetch(`/api/entries?${params.toString()}`);
      const data = await res.json();
      setEntries(data.entries ?? []);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, subjectFilter, typeFilter]);

  async function handleDelete(entryId: string) {
    if (!confirm(t("common.delete") + "?")) return;
    await fetch(`/api/entries/${entryId}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          aria-label={`Filter ${t("students.timeline")} by subject`}
          className="min-h-[44px] rounded-lg border border-gray-300 px-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        >
          <option value="">All subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label={`Filter ${t("students.timeline")} by type`}
          className="min-h-[44px] rounded-lg border border-gray-300 px-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        >
          <option value="">All types</option>
          {ENTRY_TYPES.map((type) => (
            <option key={type} value={type}>
              {t(`addWork.entryType.${type}`)}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">{t("common.loading")}</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-gray-500">{t("students.noEntriesYet")}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {groupByDate(entries).map(([date, dateEntries]) => (
            <div key={date}>
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {new Date(date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
              </h3>
              <div className="flex flex-col gap-2">
                {dateEntries.map((entry) => (
                  <div key={entry.id} className="rounded-xl border border-gray-200 bg-white p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-sm font-semibold text-gray-900">{entry.subject.name}</span>{" "}
                        <span className="text-xs text-gray-500">{t(`addWork.entryType.${entry.type}`)}</span>
                        {entry.dueDate && (
                          <span className="ml-1 text-xs text-gray-500">
                            · Due {new Date(entry.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 text-xs">
                        <button
                          className="min-h-[36px] min-w-[36px] px-2 text-brand"
                          aria-label={`${t("common.edit")} ${entry.subject.name} entry`}
                          onClick={() => setEditingEntry(entry)}
                        >
                          {t("common.edit")}
                        </button>
                        <button
                          className="min-h-[36px] min-w-[36px] px-2 text-red-600"
                          aria-label={`${t("common.delete")} ${entry.subject.name} entry`}
                          onClick={() => handleDelete(entry.id)}
                        >
                          {t("common.delete")}
                        </button>
                      </div>
                    </div>
                    {entry.caption && <p className="mt-1 text-sm text-gray-700">{entry.caption}</p>}
                    {entry.photos.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {entry.photos.map((photo) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={photo.id}
                            src={photo.url}
                            alt={`Photo for ${entry.subject.name}`}
                            className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingEntry && (
        <EditEntrySheet
          entry={editingEntry}
          subjects={subjects}
          onClose={() => setEditingEntry(null)}
          onSaved={() => {
            setEditingEntry(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function EditEntrySheet({
  entry,
  subjects,
  onClose,
  onSaved,
}: {
  entry: Entry;
  subjects: Subject[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const t = useTranslations();
  const [type, setType] = useState(entry.type);
  const [subjectId, setSubjectId] = useState(entry.subject.id);
  const [dueDate, setDueDate] = useState(entry.dueDate ? entry.dueDate.slice(0, 10) : "");
  const [caption, setCaption] = useState(entry.caption ?? "");
  const [removedPhotoIds, setRemovedPhotoIds] = useState<string[]>([]);
  const [newPhotoKeys, setNewPhotoKeys] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const needsDueDate = type === "HOMEWORK" || type === "TEST";

  async function handleAddPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setNewPhotoKeys((prev) => [...prev, data.key]);
      }
    }
    e.target.value = "";
  }

  async function handleSave() {
    setIsSubmitting(true);
    try {
      await fetch(`/api/entries/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId,
          type,
          dueDate: needsDueDate && dueDate ? new Date(dueDate).toISOString() : null,
          caption: caption || null,
          removePhotoIds: removedPhotoIds,
          addPhotoKeys: newPhotoKeys,
        }),
      });
      onSaved();
    } finally {
      setIsSubmitting(false);
    }
  }

  const remainingPhotos = entry.photos.filter((p) => !removedPhotoIds.includes(p.id));

  return (
    <BottomSheet open onClose={onClose} title={t("common.edit")}>
      <div className="flex flex-col gap-4">
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          aria-label={t("students.subjects")}
          className="min-h-[44px] rounded-lg border border-gray-300 px-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap gap-2" role="group" aria-label={t("addWork.pickSubject")}>
          {ENTRY_TYPES.map((entryType) => (
            <Chip key={entryType} active={type === entryType} onClick={() => setType(entryType)}>
              {t(`addWork.entryType.${entryType}`)}
            </Chip>
          ))}
        </div>

        {needsDueDate && (
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-label={t("addWork.dueDate")}
            className="min-h-[44px] rounded-lg border border-gray-300 px-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        )}

        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={t("addWork.caption")}
          aria-label={t("addWork.caption")}
          className="min-h-[44px] rounded-lg border border-gray-300 px-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />

        <div className="flex flex-wrap gap-2">
          {remainingPhotos.map((photo) => (
            <div key={photo.id} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={`Photo for ${entry.subject.name}`}
                className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
              />
              <button
                type="button"
                onClick={() => setRemovedPhotoIds((prev) => [...prev, photo.id])}
                aria-label="Remove photo"
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white before:absolute before:-inset-3 before:content-['']"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-500"
          >
            {t("addWork.addMorePhotos")}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleAddPhotos}
          />
        </div>

        <Button onClick={handleSave} disabled={isSubmitting}>
          {t("common.save")}
        </Button>
      </div>
    </BottomSheet>
  );
}
