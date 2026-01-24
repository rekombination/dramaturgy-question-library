"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import Image from "next/image"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  src,
  alt,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  const [imageError, setImageError] = React.useState(false)

  // Use Next.js Image for string URLs (automatic WebP/AVIF conversion)
  if (src && typeof src === "string" && !imageError) {
    return (
      <AvatarPrimitive.Image
        data-slot="avatar-image"
        className={cn("aspect-square size-full", className)}
        asChild
        {...props}
      >
        <Image
          src={src}
          alt={alt || ""}
          fill
          sizes="(max-width: 768px) 40px, 48px"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      </AvatarPrimitive.Image>
    )
  }

  // Fallback to regular img for Blob or when error occurs
  if (src && !imageError) {
    return (
      <AvatarPrimitive.Image
        data-slot="avatar-image"
        className={cn("aspect-square size-full", className)}
        src={src}
        alt={alt}
        onError={() => setImageError(true)}
        {...props}
      />
    )
  }

  return null
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
