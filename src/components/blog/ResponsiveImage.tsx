interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ResponsiveImage({ src, alt, className = "", priority = false }: ResponsiveImageProps) {
  // For now, just use a simple img tag for debugging
  // TODO: Re-enable picture element with optimized versions
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      className={className}
    />
  );
}
