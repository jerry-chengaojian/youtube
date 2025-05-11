"use client";

import Image from "next/image";
import { useState } from "react";

interface VideoThumbnailProps {
  imageUrl: string;
  title: string;
  duration: number;
}

export function VideoThumbnail({
  imageUrl,
  title,
  duration,
}: VideoThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={title}
        fill
        className="object-cover rounded-md"
      />
      <div className="absolute bottom-1 right-1 px-1 py-0.5 text-xs bg-black/80 text-white rounded">
        {formatDuration(duration)}
      </div>
    </div>
  );
}
