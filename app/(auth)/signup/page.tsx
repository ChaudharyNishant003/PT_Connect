"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

export default function SignupPage() {
  const t = useTranslations();
  const router = useRouter();
  const [centerName, setCenterName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ centerName, ownerName, email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{t("auth.signupTitle")}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label={t("auth.centerName")}
          value={centerName}
          onChange={(e) => setCenterName(e.target.value)}
          required
        />
        <TextField label={t("auth.yourName")} value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
        <TextField
          label={t("auth.email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label={t("auth.password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={isSubmitting}>
          {t("auth.signup")}
        </Button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        {t("auth.alreadyHaveAccount")}{" "}
        <Link href="/login" className="font-medium text-brand">
          {t("auth.login")}
        </Link>
      </p>
    </div>
  );
}
