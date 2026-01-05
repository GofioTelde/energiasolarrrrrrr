"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800">
        <div className="w-5 h-5"></div>
      </button>
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
      aria-label={`Cambiar a modo ${
        currentTheme === "dark" ? "claro" : "oscuro"
      }`}
    >
      {currentTheme === "dark" ? (
        <Sun className="w-5 h-5 text-orange-400" />
      ) : (
        <Moon className="w-5 h-5 text-orange-600" />
      )}
      <span className="ml-2 text-sm hidden md:inline">
        {currentTheme === "dark" ? "Modo Claro" : "Modo Oscuro"}
      </span>
    </button>
  );
}
