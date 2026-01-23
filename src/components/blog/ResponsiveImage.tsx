interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ResponsiveImage({ src, alt, className = "", priority = false }: ResponsiveImageProps) {
  // Extract base path without extension
  const lastDotIndex = src.lastIndexOf('.');
  const basePath = lastDotIndex > 0 ? src.substring(0, lastDotIndex) : src;
  const ext = lastDotIndex > 0 ? src.substring(lastDotIndex) : '';

  return (
    <picture>
      {/* AVIF - smallest file size, best compression */}
      <source
        type="image/avif"
        srcSet={`${basePath}-sm.avif 400w, ${basePath}-md.avif 800w, ${basePath}-lg.avif 1200w`}
        sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
      />

      {/* WebP - good compression, wide support */}
      <source
        type="image/webp"
        srcSet={`${basePath}-sm.webp 400w, ${basePath}-md.webp 800w, ${basePath}-lg.webp 1200w`}
        sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
      />

      {/* Fallback to original format */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={className}
      />
    </picture>
  );
}
