import Link from "next/link";
import PhonePreview from "@/components/landing/PhonePreview";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[560px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(29,78,95,0.12),transparent)]"
      />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-28">
        <div>
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.16em] text-brand [animation-delay:0ms]">
            For tuition centers &amp; independent teachers
          </p>
          <h1 className="mt-4 animate-fade-up text-balance font-display text-[2.6rem] leading-[1.08] text-[#12211d] [animation-delay:80ms] sm:text-[3.4rem]">
            Class notes that reach parents{" "}
            <span className="italic text-brand">before dinner.</span>
          </h1>
          <p className="mt-6 max-w-lg animate-fade-up text-lg leading-relaxed text-[#45524d] [animation-delay:160ms]">
            Snap a photo of today&rsquo;s work, tag it in seconds, and parents get an
            instant update &mdash; no app to install, no account to create. Built for
            teachers who don&rsquo;t have time to type.
          </p>
          <div className="mt-9 flex animate-fade-up flex-wrap items-center gap-3 [animation-delay:240ms]">
            <Link
              href="/signup"
              className="inline-flex min-h-[52px] items-center rounded-full bg-brand px-7 text-base font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              Start free
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-[52px] items-center rounded-full border border-black/10 bg-white px-7 text-base font-semibold text-[#12211d] transition-colors hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              Log in
            </Link>
          </div>
          <p className="mt-5 animate-fade-up text-sm text-[#6f7d77] [animation-delay:300ms]">
            Free to start &middot; No credit card &middot; Works in Hindi &amp; English
          </p>
        </div>

        <div className="animate-fade-up [animation-delay:200ms]">
          <PhonePreview />
        </div>
      </div>
    </section>
  );
}
