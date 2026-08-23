import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Session } from "@/types/session";
import LocaleToggle from "@/components/i18n/LocaleToggle";
import LogoutButton from "@/components/nav/LogoutButton";

export default async function TopNav({ session }: { session: Session }) {
  const t = await getTranslations();

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/dashboard" className="text-lg font-bold text-brand">
          {t("common.appName")}
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-medium text-gray-600 sm:flex">
          <Link href="/dashboard">{t("dashboard.title")}</Link>
          <Link href="/students">{t("students.title")}</Link>
          {session.role === "OWNER" && <Link href="/org/settings">{t("org.settingsTitle")}</Link>}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleToggle />
          <LogoutButton label={t("auth.logout")} />
        </div>
      </div>
    </header>
  );
}
