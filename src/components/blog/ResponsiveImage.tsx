'use client';

import { useState, useEffect } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ResponsiveImage({ src, alt, className = "", priority = false }: ResponsiveImageProps) {
  const [hasOptimizedVersions, setHasOptimizedVersions] = useState(true);

  // Convert /images/posts/dramarurgy.jpg to base name
  const baseName = src.replace(/^\/images\/posts\//, '').replace(/\.(jpg|jpeg|png)$/i, '');

  // Check if optimized versions exist by trying to load one
  useEffect(() => {
    const checkImage = new Image();
    checkImage.src = `/images/posts/${baseName}-sm.webp`;
    checkImage.onerror = () => setHasOptimizedVersions(false);
  }, [baseName]);

  // If no optimized versions exist, just return a regular img tag
  if (!hasOptimizedVersions) {
    return (
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={className}
      />
    );
  }

  // Otherwise, return the full picture element with all optimized versions
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`
          /images/posts/${baseName}-sm.avif 400w,
          /images/posts/${baseName}-md.avif 800w,
          /images/posts/${baseName}-lg.avif 1200w
        `}
        sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
      />
      <source
        type="image/webp"
        srcSet={`
          /images/posts/${baseName}-sm.webp 400w,
          /images/posts/${baseName}-md.webp 800w,
          /images/posts/${baseName}-lg.webp 1200w
        `}
        sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
      />
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={className}
      />
    </picture>
  );
}
