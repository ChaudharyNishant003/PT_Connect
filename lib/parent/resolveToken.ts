import { prisma } from "@/lib/db";

export async function resolveParentToken(token: string) {
  const record = await prisma.parentAccessToken.findUnique({
    where: { token },
    include: {
      student: {
        include: {
          organization: true,
          teacher: { select: { name: true } },
          subjects: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });

  if (!record || !record.isActive || record.revokedAt) {
    return null;
  }

  await prisma.parentAccessToken.update({
    where: { id: record.id },
    data: { lastAccessedAt: new Date() },
  });

  return record.student;
}
