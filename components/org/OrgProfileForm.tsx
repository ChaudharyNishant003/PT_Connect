"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

interface Org {
  name: string;
  contactEmail: string | null;
  contactPhone: string | null;
}

export default function OrgProfileForm({ organization }: { organization: Org }) {
  const t = useTranslations();
  const router = useRouter();
  const [name, setName] = useState(organization.name);
  const [contactEmail, setContactEmail] = useState(organization.contactEmail ?? "");
  const [contactPhone, setContactPhone] = useState(organization.contactPhone ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/api/org", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contactEmail: contactEmail || null, contactPhone: contactPhone || null }),
      });
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-base font-bold text-gray-900">{t("org.orgProfile")}</h2>
      <TextField label="Center name" value={name} onChange={(e) => setName(e.target.value)} required />
      <TextField
        label="Contact email"
        type="email"
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
      />
      <TextField label="Contact phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
      <Button type="submit" disabled={isSubmitting} className="self-start">
        {t("common.save")}
      </Button>
    </form>
  );
}
