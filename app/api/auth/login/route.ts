import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/auth";
import { toErrorResponse } from "@/lib/api/errors";

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.parse(await request.json());

    const teacher = await prisma.teacher.findUnique({ where: { email: body.email } });
    if (!teacher || !teacher.isActive) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await verifyPassword(body.password, teacher.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await setSessionCookie({
      sub: teacher.id,
      orgId: teacher.orgId,
      role: teacher.role,
      name: teacher.name,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
