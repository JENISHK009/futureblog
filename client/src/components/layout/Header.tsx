import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Blogs", href: "/blogs" },
  { name: "Web Stories", href: "/webstories" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-md shadow-lg border-b border-blue-900/30' 
          : 'bg-black/30 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center group">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-2xl font-heading font-bold mr-1 relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500">
                    Bloggers
                  </span>{" "}
                  <span className="text-white">Ground</span>
                  <motion.span 
                    className="absolute -top-1 -right-4 text-blue-400"
                    animate={{ 
                      rotate: [0, 360],
                      opacity: [1, 0.8, 1] 
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity,
                      ease: "linear" 
                    }}
                  >
                    <Sparkles size={14} />
                  </motion.span>
                </span>
              </motion.div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`relative font-medium py-2 px-2 transition-all duration-300 rounded-md hover-scale neon-shadow
                    ${location === link.href 
                      ? 'text-blue-400 bg-blue-900/20' 
                      : 'text-white/70 hover:text-blue-400'
                    }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {location === link.href && (
                    <motion.span 
                      className="absolute bottom-0 left-0 h-[2px] bg-blue-400 w-full"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-blue-900/10 p-1 backdrop-blur-sm border border-transparent hover:border-blue-700/20"
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-white/70 hover:text-blue-400"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  className="font-medium text-white/70 hover:text-blue-400 gradient-border neon-shadow"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button 
                  className="font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 hover-scale"
                >
                  Sign up
                </Button>
              </Link>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden rounded-full bg-blue-900/10 p-1 backdrop-blur-sm border border-transparent hover:border-blue-700/20"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden rounded-full text-white/70 hover:text-blue-400"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu 
            links={navLinks} 
            currentPath={location} 
            onClose={() => setMobileMenuOpen(false)} 
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
}
