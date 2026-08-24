import ScrollReveal from "@/components/landing/ScrollReveal";

export default function ProblemSection() {
  return (
    <section className="border-y border-black/5 bg-white">
      <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 sm:py-20">
        <ScrollReveal>
          <p className="font-display text-2xl leading-snug text-[#12211d] sm:text-3xl">
            Parents come home exhausted, and the only record of what their child
            learned today is buried in a notebook nobody opens.
          </p>
        </ScrollReveal>
        <ScrollReveal delayMs={120}>
          <p className="mx-auto mt-5 max-w-xl text-base text-[#6f7d77]">
            Teachers already know the work. PT Connect just gets it out of the
            backpack and onto a phone &mdash; without slowing down the class.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
