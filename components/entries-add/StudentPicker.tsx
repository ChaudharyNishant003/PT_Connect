"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import type { StudentDTO } from "@/components/entries-add/useAddTodaysWorkFlow";

export default function StudentPicker({
  students,
  selectedStudentIds,
  onToggle,
  onContinue,
}: {
  students: StudentDTO[];
  selectedStudentIds: Set<string>;
  onToggle: (studentId: string) => void;
  onContinue: () => void;
}) {
  const t = useTranslations();
  const [search, setSearch] = useState("");

  const filtered = students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-4 pb-20">
      <h1 className="text-xl font-bold text-gray-900">{t("addWork.pickStudents")}</h1>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("common.search")}
        className="min-h-[44px] rounded-lg border border-gray-300 px-3 text-base focus:border-brand focus:outline-none"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {filtered.map((student) => {
          const selected = selectedStudentIds.has(student.id);
          return (
            <button
              key={student.id}
              type="button"
              onClick={() => onToggle(student.id)}
              aria-pressed={selected}
              className={`relative flex flex-col items-center gap-2 rounded-xl border p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                selected ? "border-brand bg-brand/5" : "border-gray-200 bg-white"
              }`}
            >
              {selected && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs text-white">
                  ✓
                </span>
              )}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-lg font-bold text-brand">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-800">{student.name}</span>
            </button>
          );
        })}
      </div>

      {selectedStudentIds.size > 0 && (
        <div className="fixed inset-x-0 bottom-16 z-10 flex justify-center px-4 sm:bottom-4">
          <div className="flex w-full max-w-md items-center justify-between rounded-xl bg-white p-3 shadow-lg ring-1 ring-gray-200">
            <span className="text-sm font-medium text-gray-700">
              {t("addWork.selected", { count: selectedStudentIds.size })}
            </span>
            <Button onClick={onContinue}>{t("common.continue")}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
