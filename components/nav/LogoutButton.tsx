"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LogoutButton({ label }: { label: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="min-h-[36px] rounded-full border border-gray-300 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      {label}
    </button>
  );
}
