"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

interface StudentDetails {
  id: string;
  name: string;
  grade: string | null;
  parentName: string | null;
  parentPhone: string | null;
}

export default function StudentDetailsCard({ student }: { student: StudentDetails }) {
  const t = useTranslations();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(student.name);
  const [grade, setGrade] = useState(student.grade ?? "");
  const [parentName, setParentName] = useState(student.parentName ?? "");
  const [parentPhone, setParentPhone] = useState(student.parentPhone ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(`/api/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, grade, parentName, parentPhone }),
      });
      setEditing(false);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleArchive() {
    if (!confirm(t("students.archiveStudent") + "?")) return;
    await fetch(`/api/students/${student.id}`, { method: "DELETE" });
    router.push("/students");
    router.refresh();
  }

  if (editing) {
    return (
      <form onSubmit={handleSave} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <TextField label={t("students.name")} value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField label={t("students.grade")} value={grade} onChange={(e) => setGrade(e.target.value)} />
        <TextField
          label={t("students.parentName")}
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
        />
        <TextField
          label={t("students.parentPhone")}
          value={parentPhone}
          onChange={(e) => setParentPhone(e.target.value)}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {t("common.save")}
          </Button>
          <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
            {t("common.cancel")}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{student.name}</h1>
          {student.grade && <p className="text-sm text-gray-500">{student.grade}</p>}
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label={`${t("common.edit")} ${student.name}`}
          className="min-h-[44px] px-2 text-sm font-medium text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          {t("common.edit")}
        </button>
      </div>
      {(student.parentName || student.parentPhone) && (
        <p className="text-sm text-gray-600">
          {[student.parentName, student.parentPhone].filter(Boolean).join(" · ")}
        </p>
      )}
      <button
        type="button"
        onClick={handleArchive}
        className="mt-2 min-h-[36px] self-start text-xs text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        {t("students.archiveStudent")}
      </button>
    </div>
  );
}
