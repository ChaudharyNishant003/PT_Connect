import Skeleton from "@/components/ui/Skeleton";

export default function ParentLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </header>
      <main
        className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </main>
    </div>
  );
}
