"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BiMoon, BiSun } from "react-icons/bi";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Ensure the component is fully mounted before rendering to avoid hydration mismatches
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center mx-4">
      {theme === "light" ? (
        <BiMoon
          size={25}
          className="cursor-pointer text-black"
          onClick={() => setTheme("dark")}
        />
      ) : (
        <BiSun
          size={25}
          className="cursor-pointer text-white"
          onClick={() => setTheme("light")}
        />
      )}
    </div>
  );
};
