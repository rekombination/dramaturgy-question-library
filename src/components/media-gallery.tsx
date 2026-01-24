"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";
import { IconPlayerPlay } from "@tabler/icons-react";

interface MediaGalleryProps {
  images?: string[];
  videos?: string[];
  title: string;
}

export function MediaGallery({ images = [], videos = [], title }: MediaGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Combine images and videos into a single array for the lightbox
  const slides = [
    ...images.map((url) => ({ src: url, type: "image" as const })),
    ...videos.map((url) => ({
      type: "video" as const,
      sources: [
        {
          src: url,
          type: "video/mp4",
        },
      ],
    })),
  ];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (images.length === 0 && videos.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Attached Media
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((url, index) => (
          <button
            key={url}
            onClick={() => openLightbox(index)}
            className="border-2 border-foreground overflow-hidden hover:opacity-90 transition-opacity cursor-pointer group relative"
            type="button"
          >
            <Image
              src={url}
              alt={`Image ${index + 1} for ${title}`}
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white font-bold text-sm bg-black/50 px-3 py-1">
                Click to enlarge
              </span>
            </div>
          </button>
        ))}
        {videos.map((url, index) => (
          <button
            key={url}
            onClick={() => openLightbox(images.length + index)}
            className="border-2 border-foreground overflow-hidden hover:opacity-90 transition-opacity cursor-pointer group relative"
            type="button"
          >
            <video
              src={url}
              className="w-full h-auto"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <IconPlayerPlay size={48} className="text-white" />
                <span className="text-white font-bold text-sm bg-black/50 px-3 py-1">
                  Click to play
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Video]}
        styles={{
          container: {
            backgroundColor: "rgba(0, 0, 0, 0.95)",
          },
        }}
      />
    </div>
  );
}
