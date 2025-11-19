export default function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-white/95 px-6 py-6 text-black">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 text-sm text-black/70 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-black/40">
            Build your own app
          </p>
          <p>
            Ready to go from testing to production? Clone these flows and launch
            your own WorqHat-powered experience.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-black/80">
            WorqHat
          </div>
          <a
            href="https://worqhat.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#1A4289] px-5 py-2 text-sm font-semibold text-[#1A4289] transition hover:bg-[#1A4289] hover:text-white"
          >
            Explore Docs
          </a>
        </div>
      </div>
    </footer>
  );
}

