"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10" />;
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors rounded"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <IconMoon size={22} strokeWidth={2} />
      ) : (
        <IconSun size={22} strokeWidth={2} />
      )}
    </button>
  );
}
