"use client";

import Image from "next/image";
import { useState } from "react";

type TopicCardProps = {
  label: string;
  image: string;
};

export default function TopicCard({ label, image }: TopicCardProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="group relative h-24 rounded-lg overflow-hidden transition-transform hover:scale-[1.02]">
      {!hasError ? (
        <Image
          src={image}
          alt={label}
          fill
          className="object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
      )}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white drop-shadow-lg">
        {label}
      </span>
    </div>
  );
}

