import Link from "next/link";
import ScrollReveal from "@/components/landing/ScrollReveal";

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[#12211d]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/40 blur-3xl animate-drift"
      />
      <div className="relative mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 sm:py-24">
        <ScrollReveal>
          <h2 className="text-balance font-display text-3xl text-white sm:text-4xl">
            Stop hunting through notebooks.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-white/70">
            Set up your center in a couple of minutes. Your first update can reach a
            parent tonight.
          </p>
        </ScrollReveal>
        <ScrollReveal delayMs={120}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex min-h-[52px] items-center rounded-full bg-white px-7 text-base font-semibold text-[#12211d] shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#12211d]"
            >
              Start free
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-[52px] items-center rounded-full border border-white/25 px-7 text-base font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#12211d]"
            >
              Log in
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
