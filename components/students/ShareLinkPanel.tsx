"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import QRCode from "qrcode";
import Button from "@/components/ui/Button";

interface Token {
  id: string;
  token: string;
  label: string | null;
}

export default function ShareLinkPanel({ studentId, tokens }: { studentId: string; tokens: Token[] }) {
  const t = useTranslations("students");
  const router = useRouter();
  const [qrFor, setQrFor] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function linkFor(token: string) {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    return `${base}/p/${token}`;
  }

  async function copyLink(token: Token) {
    await navigator.clipboard.writeText(linkFor(token.token));
    setCopiedId(token.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  async function showQr(token: Token) {
    const dataUrl = await QRCode.toDataURL(linkFor(token.token), { width: 240, margin: 1 });
    setQrDataUrl(dataUrl);
    setQrFor(token.id);
  }

  async function regenerate(token: Token) {
    if (!confirm(`${t("regenerateLink")}?`)) return;
    await fetch(`/api/students/${studentId}/tokens/${token.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "regenerate" }),
    });
    router.refresh();
  }

  async function createToken() {
    await fetch(`/api/students/${studentId}/tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-base font-bold text-gray-900">{t("shareLink")}</h2>
      <div className="flex flex-col gap-3">
        {tokens.map((token) => (
          <div key={token.id} className="flex flex-col gap-2 rounded-lg bg-gray-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm text-gray-700">{token.label ?? linkFor(token.token)}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => copyLink(token)}>
                {copiedId === token.id ? "Copied!" : t("copyLink")}
              </Button>
              <Button variant="secondary" onClick={() => showQr(token)}>
                {t("showQr")}
              </Button>
              <Button variant="secondary" onClick={() => regenerate(token)}>
                {t("regenerateLink")}
              </Button>
            </div>
            {qrFor === token.id && qrDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="QR code" width={160} height={160} className="rounded-lg" />
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={createToken} className="mt-3 text-sm font-medium text-brand">
        + New link
      </button>
    </div>
  );
}
