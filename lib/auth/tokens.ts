import { nanoid } from "nanoid";

export function generateParentToken(): string {
  return nanoid(24);
}

export function generateInviteToken(): string {
  return nanoid(32);
}

export function generatePasswordResetToken(): string {
  return nanoid(32);
}
