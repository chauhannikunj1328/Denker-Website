"use client";

import { Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { Container } from "@/components/ui/Container";

// NOTE: only the first question has answer copy in the Figma file — the
// remaining 7 need real answers from the client before shipping.
const faqs = [
  {
    question: "What is Denker?",
    answer:
      "Denker is an AI coworker designed for founders and product builders. It helps you research, analyze, automate, and complete everyday work through natural voice or text interactions.",
  },
  {
    question: "How is Denker different from ChatGPT or other AI assistants?",
    answer: "",
  },
  { question: "What kind of tasks can Denker help with?", answer: "" },
  { question: "Can I interact with Denker using voice?", answer: "" },
  { question: "Does Denker work with my existing tools?", answer: "" },
  { question: "Is my data secure?", answer: "" },
  { question: "Is Denker free to use?", answer: "" },
  { question: "How do I get started?", answer: "" },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="flex w-full flex-col items-center bg-white px-6 py-16 sm:px-10 md:px-20 md:py-20"
      data-name="Section - FAQ's"
      data-theme="light"
    >
      <Container className="flex flex-col items-start gap-12 md:flex-row md:justify-between">
        <h2 className="max-w-[320px] font-heading text-3xl font-bold text-grey-950 md:text-[40px] md:leading-[48px]">
          Frequently Asked Questions
        </h2>

        <div className="flex w-full max-w-[720px] flex-col gap-2">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.question}
                className={`w-full rounded-[20px] sm:rounded-[24px] md:rounded-[32px] border p-8 transition-colors ${
                  isOpen
                    ? "border-primary-200 bg-gradient-to-br from-white to-primary-50"
                    : "border-grey-150 bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-6 text-left"
                >
                  <div className="flex flex-col gap-2">
                    <p
                      className={`font-heading text-2xl font-bold ${
                        isOpen ? "text-primary-600" : "text-grey-950"
                      }`}
                    >
                      {faq.question}
                    </p>
                    {isOpen && faq.answer && (
                      <p className="font-heading text-base font-medium leading-6 text-grey-950">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                  {isOpen ? (
                    <Minus className="size-8 shrink-0 text-primary-600" />
                  ) : (
                    <Plus className="size-8 shrink-0 text-primary-600" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
