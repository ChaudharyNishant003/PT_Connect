import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { signupSchema } from "@/lib/validation/auth";
import { toErrorResponse } from "@/lib/api/errors";

export async function POST(request: NextRequest) {
  try {
    const body = signupSchema.parse(await request.json());

    const existing = await prisma.teacher.findUnique({ where: { email: body.email } });
    if (existing) {
      return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(body.password);

    const { org, teacher } = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({ data: { name: body.centerName } });
      const teacher = await tx.teacher.create({
        data: {
          orgId: org.id,
          name: body.ownerName,
          email: body.email,
          passwordHash,
          role: "OWNER",
        },
      });
      return { org, teacher };
    });

    await setSessionCookie({ sub: teacher.id, orgId: org.id, role: "OWNER", name: teacher.name });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
