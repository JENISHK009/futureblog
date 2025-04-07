import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackgroundGradientProps {
  className?: string;
  variant?: "cyber" | "aurora" | "neon" | "minimal";
}

export default function BackgroundGradient({ 
  className, 
  variant = "cyber" 
}: BackgroundGradientProps) {
  // Variants for different background styles
  const backgroundVariants = {
    cyber: (
      <>
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-blue-950/20 z-[-2]" />
        
        {/* Grid lines */}
        <div 
          className="absolute inset-0 z-[-1] opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 123, 255, 0.1) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(0, 123, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
            backgroundPosition: '-1px -1px'
          }}
        />
        
        {/* Animated glowing orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-10 z-[-1]"
          animate={{ 
            background: [
              "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0) 70%)",
              "radial-gradient(circle, rgba(37,99,235,0.3) 0%, rgba(37,99,235,0) 70%)",
              "radial-gradient(circle, rgba(29,78,216,0.3) 0%, rgba(29,78,216,0) 70%)",
              "radial-gradient(circle, rgba(37,99,235,0.3) 0%, rgba(37,99,235,0) 70%)",
              "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0) 70%)",
            ],
            scale: [1, 1.2, 1.5, 1.2, 1],
            opacity: [0.1, 0.15, 0.2, 0.15, 0.1],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        <motion.div 
          className="absolute top-3/4 right-1/3 w-96 h-96 rounded-full blur-3xl opacity-10 z-[-1]"
          animate={{ 
            background: [
              "radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0) 70%)",
              "radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(37,99,235,0) 70%)",
              "radial-gradient(circle, rgba(29,78,216,0.2) 0%, rgba(29,78,216,0) 70%)",
              "radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(37,99,235,0) 70%)",
              "radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0) 70%)",
            ],
            scale: [1.2, 1, 1.3, 1, 1.2],
            opacity: [0.1, 0.15, 0.2, 0.15, 0.1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />
        
        {/* Digital circuit lines */}
        <div className="absolute top-[10%] bottom-[10%] left-0 right-0 z-[-1] overflow-hidden opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path 
              d="M100,100 Q250,50 400,100 T700,100 T900,100" 
              stroke="rgba(0, 191, 255, 0.4)" 
              strokeWidth="1" 
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1, 1, 0],
                opacity: [0, 0.4, 0.6, 0.4, 0]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity,
                repeatType: "loop",
                times: [0, 0.2, 0.5, 0.8, 1]
              }}
            />
            <motion.path 
              d="M100,200 Q400,150 600,200 T900,200" 
              stroke="rgba(0, 123, 255, 0.3)" 
              strokeWidth="1" 
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1, 1, 0],
                opacity: [0, 0.3, 0.5, 0.3, 0]
              }}
              transition={{ 
                duration: 12, 
                repeat: Infinity,
                repeatType: "loop",
                times: [0, 0.2, 0.5, 0.8, 1],
                delay: 2
              }}
            />
            <motion.path 
              d="M100,300 Q250,250 400,300 T700,300 T900,300" 
              stroke="rgba(30, 144, 255, 0.4)" 
              strokeWidth="1" 
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1, 1, 0],
                opacity: [0, 0.3, 0.5, 0.3, 0]
              }}
              transition={{ 
                duration: 15, 
                repeat: Infinity,
                repeatType: "loop",
                times: [0, 0.2, 0.5, 0.8, 1],
                delay: 1
              }}
            />
          </svg>
        </div>
      </>
    ),

    aurora: (
      <>
        {/* Base gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-blue-900/40 to-gray-900 z-[-2]" />
        
        {/* Aurora effects */}
        <motion.div 
          className="absolute inset-0 z-[-1] opacity-30"
          animate={{ 
            background: [
              "linear-gradient(to bottom, transparent 0%, #00BFFF20 25%, #4B008220 50%, #00BFFF20 75%, transparent 100%)",
              "linear-gradient(to bottom, transparent 0%, #7B68EE20 25%, #00BFFF20 50%, #7B68EE20 75%, transparent 100%)",
              "linear-gradient(to bottom, transparent 0%, #4B008220 25%, #00BFFF20 50%, #4B008220 75%, transparent 100%)",
            ],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "mirror" 
          }}
        />
        
        <motion.div 
          className="absolute inset-0 z-[-1] opacity-20"
          animate={{ 
            background: [
              "radial-gradient(circle at 20% 30%, #7B68EE30 0%, transparent 50%)",
              "radial-gradient(circle at 50% 40%, #00BFFF30 0%, transparent 60%)",
              "radial-gradient(circle at 80% 30%, #4B008230 0%, transparent 50%)",
            ],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "mirror" 
          }}
        />
      </>
    ),

    neon: (
      <>
        {/* Dark base */}
        <div className="absolute inset-0 bg-black z-[-2]" />
        
        {/* Neon grid */}
        <div 
          className="absolute inset-0 z-[-1] opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0'
          }}
        />
        
        {/* Glow effects */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1/2 z-[-1] opacity-30"
          animate={{ 
            background: [
              "linear-gradient(to top, #ff00ff20 0%, transparent 100%)",
              "linear-gradient(to top, #00ffff20 0%, transparent 100%)",
              "linear-gradient(to top, #ff00ff20 0%, transparent 100%)",
            ],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity
          }}
        />
        
        <motion.div 
          className="absolute top-0 left-0 right-0 h-1/3 z-[-1] opacity-20"
          animate={{ 
            background: [
              "linear-gradient(to bottom, #00ffff20 0%, transparent 100%)",
              "linear-gradient(to bottom, #ff00ff20 0%, transparent 100%)",
              "linear-gradient(to bottom, #00ffff20 0%, transparent 100%)",
            ],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            delay: 2
          }}
        />
      </>
    ),

    minimal: (
      <>
        {/* Subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 z-[-2]" />
        
        {/* Subtle patterns */}
        <div 
          className="absolute inset-0 z-[-1] opacity-5 dark:opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, currentColor 2px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </>
    ),
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {backgroundVariants[variant]}
    </div>
  );
}