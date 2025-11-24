"use client";

import { useState } from "react";

type WelcomeModalProps = {
  open: boolean;
  defaultEmail?: string;
  onSubmit: (email: string) => void;
};

export default function WelcomeModal({
  open,
  defaultEmail = "",
  onSubmit,
}: WelcomeModalProps) {
  if (!open) {
    return null;
  }

  return (
    <ModalContent key={defaultEmail} defaultEmail={defaultEmail} onSubmit={onSubmit} />
  );
}

type ModalContentProps = {
  defaultEmail: string;
  onSubmit: (email: string) => void;
};

function ModalContent({ defaultEmail, onSubmit }: ModalContentProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    onSubmit(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#050A30] p-6 text-white shadow-2xl">
        <p className="text-xs uppercase tracking-[0.4em] text-[#FDCEB0]/70">
          Welcome
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Before we start, what&apos;s your email?
        </h2>
        <p className="mt-2 text-sm text-white/70">
          We&apos;ll keep it on device for quick personalization and also send
          it to WorqHat once the collection API is wired up.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="text-sm font-semibold text-white/80">
            Work email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className="mt-2 w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#FDCEB0] focus:outline-none"
              required
            />
          </label>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-2xl bg-[#FDCEB0] px-4 py-3 mt-4 text-sm font-semibold text-[#050A30] transition hover:bg-[#ffdcb6]"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

