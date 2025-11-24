"use client";

import Link from "next/link";
import { DiscordLogoIcon, GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { Linkedin, Youtube } from "lucide-react";
import { TextHoverEffect } from "@/components/ui/Text-Hover-Effects";
import Image from "next/image";
import { Button } from "./ui/button";
import { Typewriter } from "@/components/ui/typewriter";

const footerNavs = [
  {
    label: "Products",
    items: [
      {
        href: "/",
        name: "WorqHat",
      },
      {
        href: "/no-code-apps",
        name: "No Code Apps",
      },
      {
        href: "/workflows",
        name: "Workflows",
      },
      {
        href: "/database",
        name: "Database",
      },
      {
        href: "/docs",
        name: "Docs",
      },
      {
        href: "/worqhat-ai",
        name: "WorqHat AI",
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        href: "/our-story",
        name: "About",
      },
      {
        href: "https://careers.worqhat.com",
        name: "Careers",
      },
      {
        href: "mailto:support@worqhat.com",
        name: "Support",
      },
      {
        href: "https://worqhat.substack.com/",
        name: "Blog",
      },
      {
        href: "https://community.worqhat.com/",
        name: "Forum",
      },
      {
        href: "/startup-fund",
        name: "Startup Fund",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        href: "https://docs.worqhat.com/",
        name: "Dev Docs",
      },
      {
        href: "https://docs.worqhat.com/api-reference",
        name: "API Reference",
      },
      {
        href: "https://status.worqhat.com/",
        name: "Status",
      },
      {
        href: "https://updates.worqhat.com/",
        name: "Changelog",
      },
    ],
  },
  {
    label: "Company",
    items: [
      {
        href: "/use-cases",
        name: "Use Cases",
      },
      {
        href: "/pricing",
        name: "Pricing",
      },
      {
        href: "/demo",
        name: "Book a Demo",
      },
      {
        href: "https://discord.com/invite/KHh9mguKBx",
        name: "Discord",
      },
    ],
  },
  {
    label: " ",
    items: [],
  },
];

const footerSocials = [
  {
    href: "https://discord.com/invite/KHh9mguKBx",
    name: "Discord",
    icon: <DiscordLogoIcon className="size-4" />,
  },
  {
    href: "https://x.com/worqhat",
    name: "Twitter",
    icon: <TwitterLogoIcon className="size-4" />,
  },
  {
    href: "https://www.linkedin.com/company/worqhat/",
    name: "LinkedIn",
    icon: <Linkedin className="size-4" />,
  },
  {
    href: "https://www.youtube.com/@worqhat",
    name: "YouTube",
    icon: <Youtube className="size-4" />,
  },
  {
    href: "https://github.com/worqhat",
    name: "GitHub",
    icon: <GitHubLogoIcon className="size-4" />,
  },
];

const footerButtons = [
  {
    href: "https://worqhat.app",
    name: "START FOR FREE",
    variant: "default",
  },
  {
    href: "/demo",
    name: "BOOK A DEMO",
    variant: "outline",
  },
];

const legalLinks = [
  {
    href: "/terms-of-use",
    name: "TERMS OF USE",
  },
  {
    href: "/privacy-policy",
    name: "PRIVACY POLICY",
  },
  {
    href: "/security",
    name: "SECURITY",
  },
];

const LOGO_URL = "https://assets.worqhat.com/logos/worqhat-logo-dark.png";

export default function SiteFooter() {
  return (
    <footer className="z-10 relative mt-auto">
      <div className="mx-auto w-full">
        <div className="w-full h-full md:text-4xl lg:text-5xl sm:text-3xl text-2xl flex flex-row items-start justify-start bg-transparent font-normal overflow-hidden py-16 px-8 pt-48">
          <div className="whitespace-pre-wrap">
            <span>{"We're empowering everyone to "}</span>
            <Typewriter
              text={[
                "build without code",
                "create powerful software",
                "turn ideas into reality",
                "launch in minutes, not months",
                "build like a developer, without being one",
                "join the no-code revolution",
                "create the future they imagine",
              ]}
              speed={70}
              className="text-yellow-500"
              waitTime={1500}
              deleteSpeed={40}
              cursorChar={"_"}
            />
          </div>
        </div>
        <div className="p-4 px-8 py-16 grid grid-cols-1 md:grid-cols-6 gap-8 z-60">
          {footerNavs.map((nav) => (
            <div key={nav.label}>
              <h2 className="mb-6 text-sm font-medium uppercase tracking-tighter text-white">
                {nav.label}
              </h2>
              <ul className="grid gap-2">
                {nav.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="cursor-pointer text-sm font-[450] text-gray-400 transition-colors duration-200 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-4">
            {footerButtons.map((button) => (
              <Button
                key={button.name}
                variant={button.variant as "outline" | "default"}
                className="w-full cursor-pointer"
                onClick={() => {
                  window.open(button.href);
                }}
              >
                {button.name}
              </Button>
            ))}
            <div className="mt-8">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-xs text-gray-400 hover:text-white transition-colors duration-200 mb-2"
                >
                  {link.name}
                </Link>
              ))}
              <p className="text-xs text-gray-400 mt-4">
                Winlysis Private Limited | {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-gray-800 px-8 py-4 sm:flex sm:flex-row sm:items-center sm:justify-between">
          <div className="flex space-x-5 sm:mt-0 sm:justify-center">
            {footerSocials.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="fill-gray-400 text-gray-400 hover:fill-white hover:text-white transition-colors duration-200"
                target="_blank"
                rel="noreferrer noopener"
              >
                {social.icon}
                <span className="sr-only">{social.name}</span>
              </Link>
            ))}
          </div>
          <span className="text-sm text-gray-400 sm:text-center">
            <Link href="/" className="cursor-pointer hover:text-white">
              <Image
                src={LOGO_URL}
                width={107.14}
                height={48}
                className="h-12 relative"
                alt="logo"
              />
            </Link>
          </span>
        </div>
        <div className="h-80 flex items-center justify-center">
          <TextHoverEffect text="WORQHAT" />
        </div>
      </div>
    </footer>
  );
}
