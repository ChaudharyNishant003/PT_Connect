export type TeacherRole = "OWNER" | "TEACHER";

export interface Session {
  sub: string;
  orgId: string;
  role: TeacherRole;
  name: string;
}
