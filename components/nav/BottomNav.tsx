import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function BottomNav() {
  const t = await getTranslations();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white sm:hidden">
      <div className="mx-auto flex max-w-3xl items-stretch justify-around">
        <Link
          href="/dashboard"
          className="flex min-h-[56px] flex-1 items-center justify-center text-sm font-medium text-gray-600"
        >
          {t("dashboard.title")}
        </Link>
        <Link
          href="/entries/add"
          className="flex min-h-[56px] flex-1 items-center justify-center text-sm font-bold text-brand"
        >
          + {t("dashboard.addTodaysWork")}
        </Link>
        <Link
          href="/students"
          className="flex min-h-[56px] flex-1 items-center justify-center text-sm font-medium text-gray-600"
        >
          {t("students.title")}
        </Link>
      </div>
    </nav>
  );
}
