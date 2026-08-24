import Link from "next/link";

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[#f4f8f7]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <span className="font-display text-2xl italic text-brand">PT Connect</span>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden min-h-[44px] items-center rounded-full px-4 text-sm font-semibold text-brand-dark transition-colors hover:bg-black/5 sm:inline-flex"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex min-h-[44px] items-center rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Start free
          </Link>
        </nav>
      </div>
    </header>
  );
}
