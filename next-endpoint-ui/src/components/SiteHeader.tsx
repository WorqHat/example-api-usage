import Image from "next/image";

const LOGO_URL = "https://assets.worqhat.com/logos/worqhat-logo-dark.png";

export default function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-black/90 px-6 py-5 text-white backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image
            src={LOGO_URL}
            alt="WorqHat logo"
            width={180}
            height={80}
            priority
            className="h-12 w-auto"
          />
          <div>
            <h1 className="text-2xl font-semibold text-white">
              WorqHat API Playground
            </h1>
            <p className="text-sm text-white/70">
              Preview every endpoint before you wire it into your own apps.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.35em] text-white/50">
            Build your own app
          </span>
          <a  
            className="rounded-full bg-[#FDCEB0] px-5 py-2 text-sm font-semibold text-[#050A30] shadow-lg shadow-[#FDCEB0]/30 transition hover:translate-y-0.5 hover:bg-[#ffddb3]"
            href="https://worqhat.com"
            target="_blank"
            rel="noreferrer noopener"
          >
            Start building
          </a>
        </div>
      </div>
    </header>
  );
}

