"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";

const uniqueTestimonials = [
  {
    name: "Adefisan Emmanuel",
    text: "The double- control for screen captures sounds incredibly smooth, Juan! It completely removes the friction of explaining context to AI agents.",
  },
  {
    name: "Amir Mirmehrkar",
    text: "I am mro visual, it hits home. I had changes in repeating context. Over and over. Across tools. Across teammates. every new doc. Every new sprint. Re-explaining the same product assumptions, goals, constrains.",
  },
  {
    name: "Ahmed Ali",
    text: "Demo > explanation, always. Tools like this make it easier to show real value instead of just describing it.",
  },
];

// Figma repeats the 3 testimonials above to fill a 6-card row.
const testimonials = [...uniqueTestimonials, ...uniqueTestimonials];

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 330, behavior: "smooth" });
  };

  return (
    <section
      className="flex w-full flex-col items-center bg-white px-6 py-16 sm:px-10 md:px-20 md:py-20"
      data-name="Section - Testimonials"
      data-theme="light"
    >
      <Container className="flex flex-col items-start gap-14">
        <h2 className="font-heading text-3xl font-bold text-grey-950 md:text-[40px] md:leading-[48px]">
          Loved by Builders
        </h2>

        <div
          ref={trackRef}
          className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="flex w-[70%] shrink-0 snap-start flex-col gap-4 sm:w-[45%] md:w-[315px]"
            >
              <div className="h-[360px] w-full overflow-hidden rounded-[20px] sm:rounded-[24px] md:rounded-[32px] bg-grey-100">
                <img
                  src="/images/testimonials/avatar-1.png"
                  alt={testimonial.name}
                  className="size-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-heading text-2xl font-bold text-grey-950">
                  {testimonial.name}
                </p>
                <p className="font-heading text-base font-medium leading-6 text-grey-500">
                  {testimonial.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full items-center justify-end gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollBy(-1)}
            className="flex h-10 w-[52px] items-center justify-center rounded-full border border-grey-150 bg-white text-primary-600 transition-colors hover:bg-grey-50"
          >
            <CaretLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollBy(1)}
            className="flex h-10 w-[52px] items-center justify-center rounded-full border border-grey-150 bg-white text-primary-600 transition-colors hover:bg-grey-50"
          >
            <CaretRight className="size-5" />
          </button>
        </div>
      </Container>
    </section>
  );
}
