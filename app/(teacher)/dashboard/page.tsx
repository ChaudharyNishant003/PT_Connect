import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { requireTeacher } from "@/lib/auth/guards";
import { scopeWhere } from "@/lib/db/scope";
import Button from "@/components/ui/Button";

export default async function DashboardPage() {
  const session = await requireTeacher();
  const t = await getTranslations();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const students = await prisma.student.findMany({
    where: scopeWhere(session, { isArchived: false }),
    select: { id: true },
  });

  const doneTodayCount = await prisma.entry.groupBy({
    by: ["studentId"],
    where: {
      studentId: { in: students.map((s) => s.id) },
      entryDate: { gte: startOfToday, lt: startOfTomorrow },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("dashboard.welcome", { name: session.name })}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {t("dashboard.progress", { done: doneTodayCount.length, total: students.length })}
        </p>
      </div>

      <Link href="/entries/add">
        <Button className="w-full py-4 text-base">+ {t("dashboard.addTodaysWork")}</Button>
      </Link>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/students"
          className="rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-800"
        >
          {t("students.title")}
        </Link>
        {session.role === "OWNER" && (
          <Link
            href="/org/settings"
            className="rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-800"
          >
            {t("org.settingsTitle")}
          </Link>
        )}
      </div>
    </div>
  );
}
