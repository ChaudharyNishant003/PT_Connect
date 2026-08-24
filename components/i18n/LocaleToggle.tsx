"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Locale } from "@/i18n/request";

export default function LocaleToggle() {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function setLocale(next: Locale) {
    if (next === locale || isPending) return;
    startTransition(async () => {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      router.refresh();
    });
  }

  return (
    <div
      className="inline-flex rounded-full border border-gray-300 bg-white p-0.5 text-sm"
      role="group"
      aria-label={t("language")}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`min-h-[36px] rounded-full px-3 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
          locale === "en" ? "bg-brand text-white" : "text-gray-600"
        }`}
      >
        {t("english")}
      </button>
      <button
        type="button"
        onClick={() => setLocale("hi")}
        aria-pressed={locale === "hi"}
        className={`min-h-[36px] rounded-full px-3 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
          locale === "hi" ? "bg-brand text-white" : "text-gray-600"
        }`}
      >
        {t("hindi")}
      </button>
    </div>
  );
}
