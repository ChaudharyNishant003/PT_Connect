import type { EmailSender } from "@/lib/email/types";
import { consoleSender } from "@/lib/email/console-sender";

function buildSender(): EmailSender {
  const driver = process.env.EMAIL_DRIVER ?? "console";
  switch (driver) {
    case "console":
    default:
      return consoleSender;
  }
}

export const emailSender: EmailSender = buildSender();
