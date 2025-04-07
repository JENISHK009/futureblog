import React from "react";
import { motion } from "framer-motion";
import { X, LogIn, UserPlus, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  links: { name: string; href: string }[];
  currentPath: string;
  onClose: () => void;
}

export default function MobileMenu({ links, currentPath, onClose }: MobileMenuProps) {
  // Animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    closed: { 
      opacity: 0, 
      x: 50 
    },
    open: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 40 
      } 
    },
    exit: { 
      opacity: 0, 
      x: 50, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 40 
      } 
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end"
      initial="closed"
      animate="open"
      exit="exit"
      variants={menuVariants}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Menu content */}
      <motion.div
        className="relative w-4/5 max-w-sm bg-gradient-to-br from-gray-950 to-black border-l border-blue-900/20 shadow-2xl shadow-blue-500/5 p-6 flex flex-col h-full"
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" onClick={onClose}>
            <h2 className="text-xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500">
                Bloggers
              </span>{" "}
              <span className="text-white">Ground</span>
            </h2>
          </Link>
          
          <motion.button
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={18} />
          </motion.button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col space-y-3 mb-10">
          {links.map((link) => (
            <motion.div key={link.href} variants={itemVariants}>
              <Link
                href={link.href}
                onClick={onClose}
              >
                <Button 
                  variant="ghost"
                  className={`w-full justify-start text-left pl-4 ${
                    currentPath === link.href
                      ? "bg-blue-900/20 text-blue-400"
                      : "text-white/70 hover:bg-slate-800"
                  } relative group animate-glow`}
                >
                  <span>{link.name}</span>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, x: -5 }}
                    animate={{ 
                      opacity: currentPath === link.href ? 1 : [0, 0.5, 0],
                      scale: currentPath === link.href ? 1 : 0.8,
                      x: currentPath === link.href ? 0 : -5
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-1/2 -translate-y-1/2 right-4"
                  >
                    <ArrowRight size={16} className="text-blue-400" />
                  </motion.div>
                </Button>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Authentication buttons */}
        <div className="mt-auto flex flex-col space-y-3">
          <motion.div variants={itemVariants}>
            <Link href="/login" onClick={onClose}>
              <Button 
                variant="outline"
                className="w-full justify-start text-white/70 border-slate-700 hover:border-blue-800"
              >
                <LogIn size={18} className="mr-2" /> Log in
              </Button>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link href="/signup" onClick={onClose}>
              <Button 
                className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                <UserPlus size={18} className="mr-2" /> Sign up
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div 
          className="absolute -z-10 top-20 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl"
          animate={{ 
            background: [
              "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0) 70%)",
              "radial-gradient(circle, rgba(96,165,250,0.3) 0%, rgba(96,165,250,0) 70%)",
              "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0) 70%)",
            ],
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        <motion.div 
          className="absolute -z-10 bottom-20 left-10 w-32 h-32 rounded-full opacity-20 blur-3xl"
          animate={{ 
            background: [
              "radial-gradient(circle, rgba(37,99,235,0.3) 0%, rgba(37,99,235,0) 70%)",
              "radial-gradient(circle, rgba(29,78,216,0.3) 0%, rgba(29,78,216,0) 70%)",
              "radial-gradient(circle, rgba(37,99,235,0.3) 0%, rgba(37,99,235,0) 70%)",
            ],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
      </motion.div>
    </motion.div>
  );
}