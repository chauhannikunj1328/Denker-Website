import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function CTABanner() {
  return (
    <section
      className="flex w-full flex-col items-center bg-white px-6 py-4 sm:px-10 md:px-20"
      data-name="Section - CTA"
      data-theme="light"
    >
      <Container>
        <div className="flex w-full flex-col items-start justify-between gap-10 rounded-[20px] sm:rounded-[24px] md:rounded-[32px] bg-gradient-to-br from-primary-400 via-primary-600 to-primary-600 p-8 md:p-20">
          <div className="flex flex-col gap-2 text-white">
            <h2 className="font-heading text-3xl font-bold md:text-[40px] md:leading-[48px]">
              Built in Public. Trusted by Builders.
            </h2>
            <p className="max-w-[720px] font-heading text-xl font-medium leading-7">
              Explore Denker across the platforms where founders and product
              builders discover, collaborate, and contribute.
            </p>
          </div>
          <div className="flex items-start gap-2">
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
        </div>
      </Container>
    </section>
  );
}
