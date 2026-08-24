"use client";

import { useTranslations } from "next-intl";

interface SubjectTab {
  name: string;
  status: "none" | "partial" | "full";
}

export default function SubjectTabStrip({
  studentLabel,
  tabs,
  onPick,
  onBack,
  doneTodayCount,
  totalStudents,
}: {
  studentLabel: string;
  tabs: SubjectTab[];
  onPick: (subjectName: string) => void;
  onBack: () => void;
  doneTodayCount: number;
  totalStudents: number;
}) {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="text-sm font-medium text-brand">
          ← {t("common.back")}
        </button>
        <span className="text-xs font-medium text-gray-500">
          {t("addWork.doneToday", { done: doneTodayCount, total: totalStudents })}
        </span>
      </div>
      <p className="text-sm text-gray-600">{studentLabel}</p>
      <h1 className="text-xl font-bold text-gray-900">{t("addWork.pickSubject")}</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            type="button"
            onClick={() => onPick(tab.name)}
            aria-label={
              tab.status === "full"
                ? `${tab.name}, logged for all selected students today`
                : tab.status === "partial"
                  ? `${tab.name}, logged for some selected students today`
                  : tab.name
            }
            className="relative flex min-h-[64px] items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-base font-semibold text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            {tab.name}
            {tab.status === "full" && (
              <span
                aria-hidden="true"
                className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white"
              >
                ✓
              </span>
            )}
            {tab.status === "partial" && (
              <span aria-hidden="true" className="absolute right-2 top-2 h-3 w-3 rounded-full bg-amber-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
