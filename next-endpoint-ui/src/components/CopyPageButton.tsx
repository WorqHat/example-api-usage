"use client";

import { useState, useRef, useEffect } from "react";
import { siOpenai, siClaude } from "simple-icons";

type CopyPageButtonProps = {
  content: string;
  title?: string;
};

export default function CopyPageButton({ content }: CopyPageButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleViewMarkdown = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setIsOpen(false);
  };

  const handleOpenInChatGPT = () => {
    const encodedContent = encodeURIComponent(content);
    window.open(
      `https://chat.openai.com/?q=${encodedContent}`,
      "_blank",
      "noopener,noreferrer"
    );
    setIsOpen(false);
  };

  const handleOpenInClaude = () => {
    const encodedContent = encodeURIComponent(content);
    window.open(
      `https://claude.ai/?q=${encodedContent}`,
      "_blank",
      "noopener,noreferrer"
    );
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm text-white transition-colors hover:bg-white/10"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-white/60"
        >
          <rect x="6" y="6" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M4 4H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
        <span>Copy page</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-white/20 bg-black/95 p-1 shadow-xl backdrop-blur-sm">
          <button
            onClick={handleCopyMarkdown}
            className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-white/10"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="mt-0.5 text-white/60"
            >
              <rect x="6" y="6" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M4 4H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">Copy page</div>
              <div className="text-xs text-white/60">Copy page as Markdown for LLMs</div>
            </div>
          </button>

          <button
            onClick={handleViewMarkdown}
            className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-white/10"
          >
            <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded border border-white/20 text-xs font-semibold text-white/60">
              M
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">View as Markdown</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/40">
                  <path d="M2 2h8v8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-xs text-white/60">View this page as plain text</div>
            </div>
          </button>

          <div className="my-1 border-t border-white/10" />

          <button
            onClick={handleOpenInChatGPT}
            className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-white/10"
          >
            <div className="mt-0.5 flex h-4 w-4 items-center justify-center">
              <svg
                role="img"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill={`#${siOpenai.hex}`}
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>{siOpenai.title}</title>
                <path d={siOpenai.path} />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Open in ChatGPT</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/40">
                  <path d="M2 2h8v8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-xs text-white/60">Ask questions about this page</div>
            </div>
          </button>

          <button
            onClick={handleOpenInClaude}
            className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-white/10"
          >
            <div className="mt-0.5 flex h-4 w-4 items-center justify-center">
              <svg
                role="img"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill={`#${siClaude.hex}`}
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>{siClaude.title}</title>
                <path d={siClaude.path} />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Open in Claude</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/40">
                  <path d="M2 2h8v8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-xs text-white/60">Ask questions about this page</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

