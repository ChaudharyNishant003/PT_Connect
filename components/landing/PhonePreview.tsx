export default function PhonePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[300px] animate-[drift_9s_ease-in-out_infinite]">
      <div className="absolute -inset-10 -z-10 rounded-full bg-gradient-to-br from-brand/25 via-amber-200/30 to-transparent blur-3xl" />

      <div className="relative rounded-[2.25rem] border border-black/10 bg-[#0f2129] p-2 shadow-[0_30px_60px_-20px_rgba(15,33,41,0.45)]">
        <div className="absolute left-1/2 top-2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-black/40" />
        <div className="overflow-hidden rounded-[1.85rem] bg-[#f4f8f7]">
          {/* mimicked parent-dashboard header */}
          <div className="flex items-center gap-2.5 border-b border-black/5 bg-white px-4 py-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
              A
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold text-[#12211d]">Aarav Mehta</p>
              <p className="truncate text-[10.5px] text-[#6f7d77]">Sunrise Tuition · Asha Verma</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-4 py-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#12211d]">Today&rsquo;s update</p>

            <div className="rounded-xl border border-black/5 bg-white p-2.5 shadow-sm">
              <div className="mb-1.5 flex items-center gap-1.5">
                <span className="rounded-full bg-[#dde8e7] px-2 py-0.5 text-[9.5px] font-semibold text-brand-dark">
                  Math
                </span>
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-[9.5px] font-medium text-[#45524d]">
                  Class Work
                </span>
              </div>
              <div className="h-14 w-full rounded-lg bg-gradient-to-br from-brand/15 to-amber-100" />
            </div>

            <div className="rounded-xl border border-black/5 bg-white p-2.5 shadow-sm">
              <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-[#dde8e7] px-2 py-0.5 text-[9.5px] font-semibold text-brand-dark">
                  Science
                </span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9.5px] font-semibold text-amber-800">
                  Homework · Due Mon
                </span>
              </div>
              <p className="text-[10.5px] leading-snug text-[#45524d]">Exercise 3, questions 1&ndash;10</p>
            </div>

            <div className="mt-1 flex items-center justify-center gap-1.5 text-[9.5px] font-medium text-[#6f7d77]">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse-soft" />
              Updated 2 minutes ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
