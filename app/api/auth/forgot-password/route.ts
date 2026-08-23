import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generatePasswordResetToken } from "@/lib/auth/tokens";
import { forgotPasswordSchema } from "@/lib/validation/auth";
import { toErrorResponse } from "@/lib/api/errors";
import { emailSender } from "@/lib/email";

const RESET_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  try {
    const body = forgotPasswordSchema.parse(await request.json());

    const teacher = await prisma.teacher.findUnique({ where: { email: body.email } });

    if (teacher) {
      const token = generatePasswordResetToken();
      await prisma.passwordResetToken.create({
        data: { teacherId: teacher.id, token, expiresAt: new Date(Date.now() + RESET_EXPIRY_MS) },
      });
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/reset-password/${token}`;
      await emailSender.send({
        to: teacher.email,
        subject: "Reset your PT Connect password",
        html: `<p><a href="${resetUrl}">Click here to reset your password</a>. This link expires in 1 hour.</p>`,
      });
    }

    // Always return a generic success response, whether or not the email exists,
    // so this endpoint can't be used to enumerate registered accounts.
    return NextResponse.json({ ok: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
