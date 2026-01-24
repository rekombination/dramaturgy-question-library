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

interface AvatarImageProps extends Omit<React.ComponentProps<typeof AvatarPrimitive.Image>, "asChild"> {
  src?: string
  alt?: string
}

function AvatarImage({
  className,
  src,
  alt,
  ...props
}: AvatarImageProps) {
  const [error, setError] = React.useState(false)

  if (!src || error) {
    return null
  }

  // Use Next.js Image for automatic format conversion
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
        width={48}
        height={48}
        className="rounded-full object-cover size-full"
        onError={() => setError(true)}
      />
    </AvatarPrimitive.Image>
  )
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
