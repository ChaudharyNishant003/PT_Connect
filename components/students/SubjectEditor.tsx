"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface Subject {
  id: string;
  name: string;
  sortOrder: number;
}

export default function SubjectEditor({ studentId, subjects }: { studentId: string; subjects: Subject[] }) {
  const t = useTranslations("students");
  const router = useRouter();
  const [newSubject, setNewSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function addSubject(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newSubject.trim();
    if (!trimmed) return;
    setIsSubmitting(true);
    try {
      await fetch(`/api/students/${studentId}/subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      setNewSubject("");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeSubject(subjectId: string) {
    await fetch(`/api/students/${studentId}/subjects/${subjectId}`, { method: "DELETE" });
    router.refresh();
  }

  async function move(index: number, direction: -1 | 1) {
    const reordered = [...subjects];
    const target = index + direction;
    if (target < 0 || target >= reordered.length) return;
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    await fetch(`/api/students/${studentId}/subjects`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: reordered.map((s) => s.id) }),
    });
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-base font-bold text-gray-900">{t("subjects")}</h2>
      <ul className="flex flex-col gap-2">
        {subjects.map((subject, index) => (
          <li key={subject.id} className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2">
            <span className="text-sm font-medium text-gray-800">{subject.name}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="min-h-[32px] min-w-[32px] rounded text-gray-500 disabled:opacity-30"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === subjects.length - 1}
                className="min-h-[32px] min-w-[32px] rounded text-gray-500 disabled:opacity-30"
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeSubject(subject.id)}
                className="min-h-[32px] min-w-[32px] rounded text-red-500"
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={addSubject} className="mt-3 flex gap-2">
        <input
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          placeholder={t("customSubject")}
          className="min-h-[40px] flex-1 rounded-lg border border-gray-300 px-3 text-sm focus:border-brand focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-[40px] rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700"
        >
          {t("addSubject")}
        </button>
      </form>
    </div>
  );
}
