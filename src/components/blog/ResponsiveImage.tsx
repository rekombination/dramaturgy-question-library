interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ResponsiveImage({ src, alt, className = "" }: ResponsiveImageProps) {
  // Convert /images/posts/dramarurgy.jpg to base name
  const baseName = src.replace(/^\/images\/posts\//, '').replace(/\.(jpg|jpeg|png)$/, '');

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
        loading="lazy"
        className={className}
      />
    </picture>
  );
}
