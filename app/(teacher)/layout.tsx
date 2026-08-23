import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import TopNav from "@/components/nav/TopNav";
import BottomNav from "@/components/nav/BottomNav";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 sm:pb-0">
      <TopNav session={session} />
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
      <BottomNav />
    </div>
  );
}
