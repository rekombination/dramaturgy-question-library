"use client"

import { Loader2Icon } from "lucide-react"
import { IconCheck, IconInfoCircle, IconAlertTriangle, IconX } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <IconCheck className="size-5 text-green-600" stroke={2.5} />,
        info: <IconInfoCircle className="size-5 text-blue-600" stroke={2} />,
        warning: <IconAlertTriangle className="size-5 text-amber-600" stroke={2} />,
        error: <IconX className="size-5 text-red-600" stroke={2.5} />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "border-2 shadow-lg",
          success: "border-green-600 bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-100",
          error: "border-red-600 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-100",
          warning: "border-amber-600 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100",
          info: "border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
