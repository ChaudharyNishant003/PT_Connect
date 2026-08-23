import { prisma } from "@/lib/db";
import { requireTeacher } from "@/lib/auth/guards";
import { scopeWhere } from "@/lib/db/scope";
import AddTodaysWorkFlow from "@/components/entries-add/AddTodaysWorkFlow";

export default async function AddEntryPage() {
  const session = await requireTeacher();

  const students = await prisma.student.findMany({
    where: scopeWhere(session, { isArchived: false }),
    include: { subjects: { orderBy: { sortOrder: "asc" } } },
    orderBy: { name: "asc" },
  });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const todayEntries = await prisma.entry.findMany({
    where: {
      studentId: { in: students.map((s) => s.id) },
      entryDate: { gte: startOfToday, lt: startOfTomorrow },
    },
    select: { studentId: true, subjectId: true },
  });

  return (
    <AddTodaysWorkFlow
      students={students.map((s) => ({ id: s.id, name: s.name, grade: s.grade, subjects: s.subjects }))}
      initialLoggedKeys={todayEntries.map((e) => `${e.studentId}:${e.subjectId}`)}
    />
  );
}
