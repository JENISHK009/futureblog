import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  // When mounted on client, render component
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Variants for morphing animation
  const sunVariants = {
    dark: { scale: 0.5, opacity: 0, rotate: -180 },
    light: { scale: 1, opacity: 1, rotate: 0 }
  };

  const moonVariants = {
    dark: { scale: 1, opacity: 1, rotate: 0 },
    light: { scale: 0.5, opacity: 0, rotate: 180 }
  };

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle color theme"
    >
      {/* Background glow effect */}
      <motion.div 
        className="absolute inset-0 rounded-full"
        initial={false}
        animate={{
          backgroundColor: isDarkMode ? "rgba(0, 191, 255, 0.2)" : "rgba(0, 123, 255, 0.1)"
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Sun icon */}
      <motion.div
        className="absolute text-yellow-400"
        initial={false}
        animate={isDarkMode ? "dark" : "light"}
        variants={sunVariants}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <Sun size={20} strokeWidth={1.5} />
      </motion.div>

      {/* Moon icon */}
      <motion.div
        className="absolute text-blue-400"
        initial={false}
        animate={isDarkMode ? "dark" : "light"}
        variants={moonVariants}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <Moon size={20} strokeWidth={1.5} />
      </motion.div>

      {/* Border */}
      <motion.div 
        className="absolute inset-0 rounded-full"
        initial={false}
        animate={{
          boxShadow: isDarkMode 
            ? "inset 0 0 0 1.5px rgba(255, 255, 255, 0.2)" 
            : "inset 0 0 0 1.5px rgba(0, 123, 255, 0.3)"
        }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
}