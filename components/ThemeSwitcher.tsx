"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!mounted) {
    return null;
  }

  const themes = [
    { name: "فاتح", value: "light", color: "bg-zinc-100 border-zinc-300" },
    { name: "داكن", value: "dark", color: "bg-zinc-900 border-zinc-700" },
    { name: "أزرق", value: "theme-blue", color: "bg-blue-600 border-blue-500" },
    { name: "أخضر", value: "theme-green", color: "bg-green-600 border-green-500" },
  ];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center p-2.5 rounded-full bg-background border shadow-sm transition-all z-40 active:scale-95 ${
          isOpen ? "border-primary text-primary shadow-md" : "border-border text-foreground hover:bg-muted"
        }`}
        title="تغيير المظهر"
      >
        <Palette className="w-5 h-5" />
      </button>

      {/* Floating Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            // absolute placement. ltr:left-0 ensures it expands nicely to the right
            className="absolute top-12 ltr:left-0 rtl:left-0 rtl:right-auto z-50 min-w-[160px]"
          >
            <div className="bg-card border border-border/80 shadow-xl rounded-2xl p-2 flex flex-col gap-1">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => {
                    setTheme(t.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl border transition-all group ${
                    theme === t.value 
                      ? "bg-primary/5 border-primary shadow-sm" 
                      : "bg-transparent border-transparent hover:bg-muted"
                  }`}
                >
                  <span className={`font-semibold text-sm ${theme === t.value ? "text-primary" : "text-foreground group-hover:text-primary transition-colors"}`}>
                    {t.name}
                  </span>
                  <div className={`w-4 h-4 rounded-full border ${t.color} shadow-sm`} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
