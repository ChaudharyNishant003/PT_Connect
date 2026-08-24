"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Chip from "@/components/ui/Chip";

const PRESET_SUBJECTS = ["Math", "Science", "English", "Hindi", "Social Studies"];

export default function SubjectPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (subjects: string[]) => void;
}) {
  const t = useTranslations("students");
  const [customValue, setCustomValue] = useState("");

  function toggle(name: string) {
    onChange(selected.includes(name) ? selected.filter((s) => s !== name) : [...selected, name]);
  }

  function addCustom() {
    const trimmed = customValue.trim();
    if (!trimmed || selected.includes(trimmed)) return;
    onChange([...selected, trimmed]);
    setCustomValue("");
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-gray-700">{t("subjects")}</span>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t("subjects")}>
        {PRESET_SUBJECTS.map((name) => (
          <Chip key={name} type="button" active={selected.includes(name)} onClick={() => toggle(name)}>
            {name}
          </Chip>
        ))}
        {selected
          .filter((s) => !PRESET_SUBJECTS.includes(s))
          .map((name) => (
            <Chip key={name} type="button" active onClick={() => toggle(name)}>
              {name}
            </Chip>
          ))}
      </div>
      <div className="flex gap-2">
        <label htmlFor="subject-picker-custom" className="sr-only">
          {t("customSubject")}
        </label>
        <input
          id="subject-picker-custom"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder={t("customSubject")}
          className="min-h-[44px] flex-1 rounded-lg border border-gray-300 px-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
        <button
          type="button"
          onClick={addCustom}
          className="min-h-[44px] rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          {t("addSubject")}
        </button>
      </div>
    </div>
  );
}
