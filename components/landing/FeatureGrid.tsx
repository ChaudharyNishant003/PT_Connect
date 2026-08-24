import ScrollReveal from "@/components/landing/ScrollReveal";

const FEATURES = [
  {
    title: "Under 20 seconds a subject",
    body: "Three taps from opening the app to a saved entry. Every extra field had to earn its place.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.5}>
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Log once, send to the whole batch",
    body: "Teaching the same lesson to five students? Select them all and save one entry that reaches every parent.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="8.5" cy="8.5" r="3" />
        <circle cx="16" cy="10" r="2.3" />
        <path d="M3.5 20c0-3.2 2.3-5.5 5.5-5.5s5.5 2.3 5.5 5.5" strokeLinecap="round" />
        <path d="M15 15.2c2.3.3 3.9 1.9 4 4.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Nothing for parents to install",
    body: "One link over WhatsApp is all it takes. No account, no password, no app-store detour.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.5}>
        <path d="M9.5 14.5 14.5 9.5" strokeLinecap="round" />
        <path d="M11 6.5 12.6 4.9a3.2 3.2 0 0 1 4.5 4.5L15.5 11" strokeLinecap="round" />
        <path d="M13 17.5 11.4 19.1a3.2 3.2 0 0 1-4.5-4.5L8.5 13" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Built for whole centers, not just solo teachers",
    body: "Every teacher sees only their own students. Owners see the full roster across the center.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.5}>
        <path d="M4 20V9.5L12 4l8 5.5V20" strokeLinejoin="round" />
        <path d="M9 20v-6h6v6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Hindi and English, one tap apart",
    body: "Teachers and parents each choose their own language, and it stays that way.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.4 2.5 3.6 5.6 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.6-3.6-9S9.6 5.5 12 3Z" />
      </svg>
    ),
  },
  {
    title: "Homework, tests, and revision — sorted automatically",
    body: "Every entry lands in the right bucket on the parent's screen, nearest due date first.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" />
        <path d="M3.5 9.5h17" />
        <path d="M8 2.5v4M16 2.5v4" strokeLinecap="round" />
        <circle cx="8.2" cy="14" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="14" r="1" fill="currentColor" stroke="none" />
        <circle cx="8.2" cy="17.2" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="border-y border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <ScrollReveal className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">What you get</p>
          <h2 className="mt-3 text-balance font-display text-3xl text-[#12211d] sm:text-4xl">
            Everything a busy tuition center actually needs.
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <ScrollReveal key={feature.title} delayMs={(index % 3) * 90}>
              <div className="group h-full rounded-2xl border border-black/5 bg-[#f4f8f7] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/20 hover:bg-white hover:shadow-lg">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand shadow-sm transition-colors group-hover:bg-brand group-hover:text-white">
                  {feature.icon}
                </span>
                <h3 className="mt-4 text-base font-bold leading-snug text-[#12211d]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6f7d77]">{feature.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
