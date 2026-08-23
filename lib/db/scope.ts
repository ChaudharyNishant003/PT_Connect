import type { Session } from "@/types/session";

/**
 * Builds a Prisma `where` clause enforcing multi-tenant isolation.
 *
 * Every teacher-side query against Student/Entry (or anything scoped by
 * orgId/teacherId) MUST route its `where` through this helper:
 *  - TEACHER role: scoped to their own org AND their own students only.
 *  - OWNER role: scoped to their org only (sees all teachers' students).
 */
export function scopeWhere<T extends Record<string, unknown>>(
  session: Session,
  extra: T = {} as T,
) {
  return {
    orgId: session.orgId,
    ...(session.role === "TEACHER" ? { teacherId: session.sub } : {}),
    ...extra,
  };
}
