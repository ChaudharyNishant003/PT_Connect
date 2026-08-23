import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { requireTeacher } from "@/lib/auth/guards";
import { scopeWhere } from "@/lib/db/scope";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

export default async function StudentsPage() {
  const session = await requireTeacher();
  const t = await getTranslations("students");

  const students = await prisma.student.findMany({
    where: scopeWhere(session, { isArchived: false }),
    include: { subjects: true, teacher: { select: { name: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <Link href="/students/new">
          <Button>+ {t("addStudent")}</Button>
        </Link>
      </div>

      {students.length === 0 ? (
        <EmptyState
          title={t("noEntriesYet")}
          action={
            <Link href="/students/new">
              <Button>+ {t("addStudent")}</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {students.map((student) => (
            <Link
              key={student.id}
              href={`/students/${student.id}`}
              className="rounded-xl border border-gray-200 bg-white p-4 hover:border-brand"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{student.name}</p>
                  {student.grade && <p className="text-xs text-gray-500">{student.grade}</p>}
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {student.subjects.map((s) => s.name).join(" · ")}
                {session.role === "OWNER" && ` · ${student.teacher.name}`}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
