import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/auth/guards";
import { generateInviteToken } from "@/lib/auth/tokens";
import { inviteSchema } from "@/lib/validation/auth";
import { toErrorResponse } from "@/lib/api/errors";
import { emailSender } from "@/lib/email";

const INVITE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const session = await requireOwner();
    const body = inviteSchema.parse(await request.json());

    const existing = await prisma.teacher.findUnique({ where: { email: body.email } });
    if (existing) {
      return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
    }

    const token = generateInviteToken();

    const teacher = await prisma.$transaction(async (tx) => {
      const teacher = await tx.teacher.create({
        data: {
          orgId: session.orgId,
          name: body.name,
          email: body.email,
          passwordHash: "",
          role: "TEACHER",
        },
      });
      await tx.inviteToken.create({
        data: {
          orgId: session.orgId,
          teacherId: teacher.id,
          token,
          expiresAt: new Date(Date.now() + INVITE_EXPIRY_MS),
        },
      });
      return teacher;
    });

    const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/accept-invite/${token}`;

    await emailSender.send({
      to: body.email,
      subject: "You've been invited to PT Connect",
      html: `<p>You've been invited to join as a teacher. <a href="${acceptUrl}">Set your password</a> to get started.</p>`,
    });

    return NextResponse.json({ ok: true, teacherId: teacher.id, acceptUrl }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
