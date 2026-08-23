"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import SubjectPicker from "@/components/students/SubjectPicker";

export default function NewStudentPage() {
  const t = useTranslations("students");
  const router = useRouter();
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [subjects, setSubjects] = useState<string[]>(["Math", "Science", "English"]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (subjects.length === 0) {
      setError("Add at least one subject");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, grade, parentName, parentPhone, subjects }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong");
        return;
      }
      const data = await res.json();
      router.push(`/students/${data.student.id}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">{t("addStudent")}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField label={t("name")} value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField label={t("grade")} value={grade} onChange={(e) => setGrade(e.target.value)} />
        <TextField
          label={t("parentName")}
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
        />
        <TextField
          label={t("parentPhone")}
          value={parentPhone}
          onChange={(e) => setParentPhone(e.target.value)}
        />
        <SubjectPicker selected={subjects} onChange={setSubjects} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={isSubmitting}>
          {t("addStudent")}
        </Button>
      </form>
    </div>
  );
}
