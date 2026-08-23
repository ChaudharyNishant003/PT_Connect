import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireTeacher } from "@/lib/auth/guards";
import { getTranslations } from "next-intl/server";
import OrgProfileForm from "@/components/org/OrgProfileForm";
import TeacherList from "@/components/org/TeacherList";

export default async function OrgSettingsPage() {
  const session = await requireTeacher();
  if (session.role !== "OWNER") {
    redirect("/dashboard");
  }
  const t = await getTranslations("org");

  const [organization, teachers] = await Promise.all([
    prisma.organization.findUniqueOrThrow({ where: { id: session.orgId } }),
    prisma.teacher.findMany({
      where: { orgId: session.orgId },
      select: { id: true, name: true, email: true, role: true, isActive: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">{t("settingsTitle")}</h1>
      <OrgProfileForm organization={organization} />
      <TeacherList teachers={teachers} />
    </div>
  );
}
