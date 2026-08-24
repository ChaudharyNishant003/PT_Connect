import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="bg-[#12211d]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 border-t border-white/10 px-5 py-8 text-center text-sm text-white/50 sm:flex-row sm:justify-between sm:px-8 sm:text-left">
        <span className="font-display text-lg italic text-white/80">PT Connect</span>
        <p>Built for tuition centers &amp; independent teachers.</p>
        <Link href="/login" className="font-medium text-white/70 hover:text-white">
          Teacher log in →
        </Link>
      </div>
    </footer>
  );
}
