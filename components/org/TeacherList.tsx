"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

interface Teacher {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "TEACHER";
  isActive: boolean;
}

export default function TeacherList({ teachers }: { teachers: Teacher[] }) {
  const t = useTranslations("org");
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function toggleActive(teacher: Teacher) {
    await fetch(`/api/teachers/${teacher.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !teacher.isActive }),
    });
    router.refresh();
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInviteLink(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      setInviteLink(data.acceptUrl);
      setName("");
      setEmail("");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-base font-bold text-gray-900">{t("teachers")}</h2>
      <ul className="flex flex-col gap-2">
        {teachers.map((teacher) => (
          <li key={teacher.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <div>
              <p className="text-sm font-medium text-gray-800">{teacher.name}</p>
              <p className="text-xs text-gray-500">
                {teacher.email} · {teacher.role === "OWNER" ? t("owner") : t("teacher")}
              </p>
            </div>
            {teacher.role !== "OWNER" && (
              <button
                type="button"
                onClick={() => toggleActive(teacher)}
                aria-label={`${teacher.isActive ? t("deactivate") : "Activate"} ${teacher.name}`}
                className={`min-h-[36px] px-2 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${teacher.isActive ? "text-red-600" : "text-green-600"}`}
              >
                {teacher.isActive ? t("deactivate") : "Activate"}
              </button>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleInvite} className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
        <h3 className="text-sm font-semibold text-gray-800">{t("inviteTeacher")}</h3>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {inviteLink && (
          <p className="break-all rounded-lg bg-brand/5 p-2 text-xs text-brand">
            Invite link (dev mode, share this): {inviteLink}
          </p>
        )}
        <Button type="submit" disabled={isSubmitting} className="self-start">
          {t("inviteTeacher")}
        </Button>
      </form>
    </div>
  );
}
