"use client"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { useTheme } from "@/app/shared/hooks/useTheme"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme as any}
      richColors={true}
      className="toaster group"
      toastOptions={{
        style: {
          background: theme === "dark" ? "#1A1A1A" : "#ffffff",
          color: theme === "dark" ? "#ffffff" : "#000000",
          border: theme === "dark" ? "1px solid #333" : "1px solid #E2E8F0",
          zIndex: 9999,
        },
      }}
      {...props}
    />
  )
}

export { Toaster }