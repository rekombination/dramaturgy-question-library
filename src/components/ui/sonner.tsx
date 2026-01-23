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
          toast: "rounded-lg shadow-xl backdrop-blur-sm",
          success: "border-l-4 border-green-600 bg-white/95 dark:bg-gray-900/95 text-green-900 dark:text-green-100",
          error: "border-l-4 border-red-600 bg-white/95 dark:bg-gray-900/95 text-red-900 dark:text-red-100",
          warning: "border-l-4 border-amber-600 bg-white/95 dark:bg-gray-900/95 text-amber-900 dark:text-amber-100",
          info: "border-l-4 border-blue-600 bg-white/95 dark:bg-gray-900/95 text-blue-900 dark:text-blue-100",
        },
      }}
      position="top-right"
      {...props}
    />
  )
}

export { Toaster }
