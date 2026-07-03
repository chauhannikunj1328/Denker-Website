import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function CTABanner() {
  return (
    <section
      className="flex w-full flex-col items-center bg-white px-6 py-[100px] sm:px-10 md:px-20"
      data-name="Section - CTA"
      data-theme="light"
    >
      <Container>
        <div className="cta-radial-glow relative flex h-[580px] w-full flex-col items-center gap-8 overflow-hidden rounded-[20px] px-6 py-16 sm:h-[500px] sm:rounded-[24px] sm:px-10 sm:py-20 md:h-auto md:rounded-[32px] md:py-24">
          <div className="flex max-w-[600px] flex-col items-center gap-2 text-center text-white">
            <h2 className="font-heading text-3xl font-bold md:text-[40px] md:leading-[48px]">
              Built in Public. Trusted by Builders.
            </h2>
            <p className="font-heading text-lg font-medium leading-7 sm:text-xl">
              Explore Denker across the platforms where founders and product
              builders discover, collaborate, and contribute.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              href="#reach-out"
              className="bg-white text-grey-950 hover:bg-grey-50"
            >
              Get Started
            </Button>
            <Button
              variant="secondary"
              href="#"
              className="border-white bg-transparent hover:border-grey-100 hover:bg-white/10"
            >
              Download Denker
            </Button>
          </div>

          {/* Decorative "agent at work" bubble composites (Marketer+Designer
              on the left, Denker+Sales on the right) — each pair is already
              combined, rotated, and cursor-annotated in the source image, so
              they're placed as single assets rather than reconstructed with
              CSS. Shown at every breakpoint, sized down for mobile/tablet so
              they still fit alongside the centered heading/buttons. */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <Image
              src="/images/cta/cta-left-side-image.png"
              alt=""
              width={1091}
              height={786}
              className="absolute bottom-[calc(-2%+60px)] left-[-3%] w-[180px] sm:bottom-[calc(-2%)] sm:w-[330px] md:bottom-[calc(-2%-60px)] md:w-[315px] xl:w-[360px]"
            />
            <Image
              src="/images/cta/cta-right-side-image.png"
              alt=""
              width={1260}
              height={810}
              className="absolute bottom-[calc(-2%+60px)] right-[-3%] w-[216px] sm:bottom-[calc(-2%)] sm:w-[390px] md:bottom-[calc(-2%-60px)] md:w-[375px] xl:w-[420px]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
