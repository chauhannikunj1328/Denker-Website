import { BlurText } from "@/components/ui/BlurText";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section
      className="relative flex w-full flex-col items-center overflow-hidden bg-grey-950 px-6 pt-32 pb-0 sm:px-10 sm:pt-40 md:px-20"
      data-name="Section - Hero"
      data-theme="dark"
    >
      <Container className="flex flex-col items-center gap-14">
        <div className="relative z-10 mx-auto flex w-full max-w-[880px] flex-col items-center gap-2 text-center">
          <p className="font-body text-base font-medium text-primary-400">
            Built for Founders &amp; Product Builders
          </p>
          <BlurText
            as="h1"
            className="font-heading text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-[56px] md:leading-[60px]"
            text="Never again follow every AI conversation manually, let your AI coworker follow where you work"
          />
        </div>

        <div className="relative z-10 flex w-full flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-start">
          <Button variant="primary" href="#reach-out" className="w-full sm:w-auto">
            Get Started
          </Button>
          <Button variant="secondary" href="#" className="w-full sm:w-auto">
            Download Denker
          </Button>
        </div>

        <div className="relative h-[420px] w-full sm:h-[560px] md:h-[720px]">
          <div className="hero-dashboard-radius absolute inset-0 border border-grey-700 bg-gradient-to-b from-grey-900 to-grey-950 shadow-[0_0_120px_rgba(74,191,115,0.08)]" />
          <img
            src="/images/hero/dashboard-glow.svg"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-[-10px] h-1/2 w-full object-cover opacity-80"
          />
        </div>
      </Container>
    </section>
  );
}
