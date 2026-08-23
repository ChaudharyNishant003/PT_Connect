import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { resolveParentToken } from "@/lib/parent/resolveToken";
import { storage } from "@/lib/storage";
import ParentHeader from "@/components/parent/ParentHeader";
import TodaysUpdateSection from "@/components/parent/TodaysUpdateSection";
import EntrySection from "@/components/parent/EntrySection";
import HistoryList from "@/components/parent/HistoryList";
import type { ParentEntry } from "@/components/parent/EntryCard";

const HISTORY_PAGE_SIZE = 20;

async function withPhotoUrls<T extends { photos: { id: string; url: string }[] }>(entries: T[]): Promise<T[]> {
  return Promise.all(
    entries.map(async (entry) => ({
      ...entry,
      photos: await Promise.all(
        entry.photos.map(async (photo) => ({ ...photo, url: await storage.getUrl(photo.url) })),
      ),
    })),
  );
}

export default async function ParentDashboardPage({ params }: { params: { token: string } }) {
  const student = await resolveParentToken(params.token);
  if (!student) {
    notFound();
  }

  const t = await getTranslations("parent");

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const [todayEntriesRaw, pendingHomeworkRaw, upcomingTestsRaw, needsRevisionRaw, historyRaw] = await Promise.all([
    prisma.entry.findMany({
      where: { studentId: student.id, entryDate: { gte: startOfToday, lt: startOfTomorrow } },
      include: { photos: { orderBy: { sortOrder: "asc" } }, subject: true },
      orderBy: { entryDate: "desc" },
    }),
    prisma.entry.findMany({
      where: { studentId: student.id, type: "HOMEWORK" },
      include: { photos: { orderBy: { sortOrder: "asc" } }, subject: true },
      orderBy: [{ dueDate: "asc" }, { entryDate: "desc" }],
      take: 20,
    }),
    prisma.entry.findMany({
      where: { studentId: student.id, type: "TEST" },
      include: { photos: { orderBy: { sortOrder: "asc" } }, subject: true },
      orderBy: [{ dueDate: "asc" }, { entryDate: "desc" }],
      take: 20,
    }),
    prisma.entry.findMany({
      where: { studentId: student.id, type: "REVISION" },
      include: { photos: { orderBy: { sortOrder: "asc" } }, subject: true },
      orderBy: { entryDate: "desc" },
      take: 20,
    }),
    prisma.entry.findMany({
      where: { studentId: student.id },
      include: { photos: { orderBy: { sortOrder: "asc" } }, subject: true },
      orderBy: { entryDate: "desc" },
      take: HISTORY_PAGE_SIZE + 1,
    }),
  ]);

  const [todayEntries, pendingHomework, upcomingTests, needsRevision] = await Promise.all([
    withPhotoUrls(todayEntriesRaw),
    withPhotoUrls(pendingHomeworkRaw),
    withPhotoUrls(upcomingTestsRaw),
    withPhotoUrls(needsRevisionRaw),
  ]);

  const historyHasMore = historyRaw.length > HISTORY_PAGE_SIZE;
  const historyPage = await withPhotoUrls(historyHasMore ? historyRaw.slice(0, HISTORY_PAGE_SIZE) : historyRaw);

  const serialize = (entries: typeof todayEntries): ParentEntry[] =>
    entries.map((e) => ({
      id: e.id,
      type: e.type,
      entryDate: e.entryDate.toISOString(),
      dueDate: e.dueDate ? e.dueDate.toISOString() : null,
      caption: e.caption,
      subject: { name: e.subject.name, color: e.subject.color },
      photos: e.photos.map((p) => ({ id: p.id, url: p.url })),
    }));

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <ParentHeader
        studentName={student.name}
        centerName={student.organization.name}
        teacherName={student.teacher.name}
      />
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6">
        <TodaysUpdateSection
          title={t("today")}
          entries={serialize(todayEntries)}
          emptyMessage={t("noUpdatesToday")}
        />
        <EntrySection title={t("pendingHomework")} entries={serialize(pendingHomework)} />
        <EntrySection title={t("upcomingTests")} entries={serialize(upcomingTests)} urgent />
        <EntrySection title={t("needsRevision")} entries={serialize(needsRevision)} />
        <HistoryList
          token={params.token}
          initialEntries={serialize(historyPage)}
          initialCursor={historyHasMore ? historyPage[historyPage.length - 1]?.id ?? null : null}
        />
      </main>
    </div>
  );
}
