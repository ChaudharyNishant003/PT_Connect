import { NextRequest, NextResponse } from "next/server";
import { LOCALE_COOKIE, resolveLocale } from "@/i18n/request";

export async function POST(request: NextRequest) {
  const { locale } = await request.json().catch(() => ({ locale: undefined }));
  const resolved = resolveLocale(locale);

  const response = NextResponse.json({ locale: resolved });
  response.cookies.set(LOCALE_COOKIE, resolved, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}
