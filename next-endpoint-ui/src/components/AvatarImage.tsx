"use client";

import { useState } from "react";
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
  // Server already checks for files in /avatars folder and returns the correct path
  // If src is from avatars folder, use it; otherwise it's already the DiceBear fallback
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (hasError) return; // Already tried fallback
    
    // If the current src is from avatars folder and failed, try DiceBear
    if (imgSrc.startsWith("/avatars/")) {
      setHasError(true);
      setImgSrc(`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`);
    }
  };

  // For local images from /avatars, use unoptimized to handle HEIF/HEIC and other formats
  const isLocalImage = imgSrc.startsWith("/avatars/");
  
  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      unoptimized={isLocalImage || imgSrc.includes("dicebear.com")}
      priority={false}
      loading="lazy"
    />
  );
}

