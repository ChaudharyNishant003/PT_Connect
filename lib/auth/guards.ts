import { getSession } from "@/lib/auth/session";
import type { Session } from "@/types/session";

export class AuthError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function requireTeacher(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new AuthError(401, "Not authenticated");
  }
  return session;
}

export async function requireOwner(): Promise<Session> {
  const session = await requireTeacher();
  if (session.role !== "OWNER") {
    throw new AuthError(403, "Owner access required");
  }
  return session;
}
