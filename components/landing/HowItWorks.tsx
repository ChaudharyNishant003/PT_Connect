import ScrollReveal from "@/components/landing/ScrollReveal";

const STEPS = [
  {
    title: "Pick a student, tap a subject",
    body: "Group tuition? Select every student in the batch at once and log the same lesson to all of them in one pass.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="9" cy="8" r="3" />
        <path d="M4 20c0-3 2-5 5-5s5 2 5 5" strokeLinecap="round" />
        <circle cx="17.5" cy="7.5" r="1.6" />
        <path d="M14.8 12.2c1.9-.4 4 .7 4.9 3.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Snap a photo",
    body: "The camera opens the moment you tap. Photograph the notebook, tag it Homework, Test, or Revision — done.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="7" width="18" height="13" rx="2.5" />
        <path d="M8 7l1.4-2.4A1.5 1.5 0 0 1 10.7 4h2.6a1.5 1.5 0 0 1 1.3.76L16 7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="13.5" r="3.2" />
      </svg>
    ),
  },
  {
    title: "Parent sees it instantly",
    body: "The link updates itself. No app, no login — just today's work, homework due dates, and what needs revision.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={1.5}>
        <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
        <path d="M10 19h4" strokeLinecap="round" />
        <circle cx="16.5" cy="6.5" r="2.5" fill="currentColor" stroke="none" className="text-amber-500" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <ScrollReveal className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">How it works</p>
        <h2 className="mt-3 text-balance font-display text-3xl text-[#12211d] sm:text-4xl">
          Three steps. Under twenty seconds.
        </h2>
      </ScrollReveal>

      <ol className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
        {STEPS.map((step, index) => (
          <ScrollReveal key={step.title} delayMs={index * 110}>
            <li className="relative flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                  {step.icon}
                </span>
                <span className="font-display text-3xl italic text-brand/30">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#12211d]">{step.title}</h3>
              <p className="text-sm leading-relaxed text-[#6f7d77]">{step.body}</p>
            </li>
          </ScrollReveal>
        ))}
      </ol>
    </section>
  );
}
