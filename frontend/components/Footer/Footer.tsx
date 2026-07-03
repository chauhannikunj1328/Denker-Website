import Image from "next/image";
import {
  ChatCircle,
  Envelope,
  LinkedinLogo,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";

const pageLinks = [
  "Home",
  "Features",
  "Pricing",
  "Docs",
  "Blog",
  "Traction",
  "Community",
];
const infoLinks = ["Contact", "Privacy", "Terms of use", "Cookies"];

// Social links — update `href` with the real destinations when available.
const socialLinks = [
  { label: "LinkedIn", href: "#", Icon: LinkedinLogo },
  { label: "X (Twitter)", href: "#", Icon: XLogo },
  { label: "YouTube", href: "#", Icon: YoutubeLogo },
  { label: "Email", href: "#", Icon: Envelope },
  { label: "Message us", href: "#", Icon: ChatCircle },
];

export function Footer() {
  return (
    <footer
      className="flex w-full flex-col items-center bg-white px-6 pt-8 pb-6 sm:px-10 md:px-20"
      data-name="Section - Footer"
      data-theme="light"
    >
      <Container className="flex flex-col items-start gap-6">
        <div className="flex w-full flex-col items-start justify-between gap-10 md:flex-row">
          <div className="flex w-full max-w-[480px] flex-col items-start gap-4">
            <div className="flex items-center gap-2">
              <Image src="/images/brand/brand-icon.svg" alt="" width={24} height={24} />
              <Image
                src="/images/brand/brand-text-dark.svg"
                alt="Denker"
                width={64}
                height={16}
              />
            </div>
            {/* NOTE: Figma uses placeholder Lorem ipsum copy here — swap for a
                real company description. */}
            <p className="font-heading text-base font-medium leading-6 text-grey-500">
              Lorem ipsum dolor sit amet consectetur. Dictum viverra non ante
              dui integer a. Sapien porta in imperdiet dui. Donec congue
              elementum libero id mauris amet dignissim eu. At quis ultrices
              interdum integer odio morbi mauris est.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-grey-950 transition-colors hover:text-primary-600"
                >
                  <Icon weight="regular" size={24} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex w-full gap-16 sm:w-auto sm:gap-24">
            <div className="flex w-[200px] flex-col items-start gap-4">
              <p className="font-heading text-base font-bold text-grey-950">Pages</p>
              <div className="flex flex-col items-start gap-3">
                {pageLinks.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="font-body text-base font-medium text-grey-500 transition-colors hover:text-primary-600"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex w-[200px] flex-col items-start gap-4">
              <p className="font-heading text-base font-bold text-grey-950">
                Information
              </p>
              <div className="flex flex-col items-start gap-3">
                {infoLinks.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="font-body text-base font-medium text-grey-500 transition-colors hover:text-primary-600"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-grey-100" />

        <p className="w-full text-center font-heading text-base font-medium text-grey-500">
          © 2026 Denker AI. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
