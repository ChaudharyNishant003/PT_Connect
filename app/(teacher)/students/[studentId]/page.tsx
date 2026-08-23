import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireTeacher } from "@/lib/auth/guards";
import { scopeWhere } from "@/lib/db/scope";
import { getTranslations } from "next-intl/server";
import StudentDetailsCard from "@/components/students/StudentDetailsCard";
import SubjectEditor from "@/components/students/SubjectEditor";
import ShareLinkPanel from "@/components/students/ShareLinkPanel";
import StudentTimeline from "@/components/students/StudentTimeline";

export default async function StudentDetailPage({ params }: { params: { studentId: string } }) {
  const session = await requireTeacher();
  const t = await getTranslations("students");

  const student = await prisma.student.findFirst({
    where: scopeWhere(session, { id: params.studentId }),
    include: {
      subjects: { orderBy: { sortOrder: "asc" } },
      parentAccessTokens: { where: { isActive: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!student) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <StudentDetailsCard student={student} />
      <SubjectEditor studentId={student.id} subjects={student.subjects} />
      <ShareLinkPanel studentId={student.id} tokens={student.parentAccessTokens} />
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-base font-bold text-gray-900">{t("timeline")}</h2>
        <StudentTimeline studentId={student.id} subjects={student.subjects} />
      </div>
    </div>
  );
}
