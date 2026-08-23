import type { EmailSender } from "@/lib/email/types";

export const consoleSender: EmailSender = {
  async send({ to, subject, html }) {
    console.log(`\n[email:console] To: ${to}\nSubject: ${subject}\n${html}\n`);
  },
};
