"use client";

import Image from "next/image";

type AvatarImageProps = {
  src: string;
  alt: string;
  username: string;
  width: number;
  height: number;
  className?: string;
};

export default function AvatarImage({
  src,
  alt,
  username,
  width,
  height,
  className,
}: AvatarImageProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Fallback to DiceBear if local image fails
    const target = e.target as HTMLImageElement;
    target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
  };

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
    />
  );
}

