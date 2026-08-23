"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

export default function ForgotPasswordPage() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{t("auth.forgotPassword")}</h1>
      {submitted ? (
        <p className="text-sm text-gray-700">
          If an account exists for that email, a reset link has been sent (check the server console in dev).
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label={t("auth.email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={isSubmitting}>
            {t("auth.resetPassword")}
          </Button>
        </form>
      )}
    </div>
  );
}
