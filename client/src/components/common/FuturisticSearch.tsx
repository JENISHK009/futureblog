import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, X, ArrowRight, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface FuturisticSearchProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  withAI?: boolean;
}

export default function FuturisticSearch({ 
  className = '',
  placeholder = 'Search across the universe of ideas...',
  onSearch = () => {},
  withAI = true
}: FuturisticSearchProps) {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };
  
  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <form onSubmit={handleSearchSubmit}>
        <div className={`
          relative rounded-full 
          ${isDarkMode 
            ? 'bg-gray-900/70 backdrop-blur-md border border-gray-800/40' 
            : 'bg-white/90 backdrop-blur-md border border-gray-100/40 shadow-lg'
          }
          transition-all duration-300 ease-in-out
          ${isFocused ? 'ring-2 ring-blue-500 ring-opacity-60' : ''}
          ${isFocused ? 'md:w-[110%]' : 'md:w-full'}
        `}>
          {/* Search ripple effect */}
          <AnimatePresence>
            {isFocused && (
              <motion.div 
                className="absolute inset-0 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
              >
                <div className="absolute inset-0 rounded-full bg-blue-500/5 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Search icon with animation */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
            <motion.div
              animate={isFocused ? 
                { scale: [1, 1.2, 1], rotate: [0, 10, 0] } : 
                { scale: 1, rotate: 0 }
              }
              transition={{ duration: 0.4 }}
            >
              <Search className="w-5 h-5" />
            </motion.div>
          </div>
          
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`
              border-none ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0
              bg-transparent pl-12 pr-36 py-6 h-14 text-base rounded-full
              ${isDarkMode ? 'text-gray-200 placeholder:text-gray-400' : 'text-gray-800 placeholder:text-gray-500'}
            `}
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                type="button"
                onClick={handleClear}
                className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
            
            {withAI && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`
                  rounded-full w-10 h-10 flex items-center justify-center
                  ${isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-blue-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-blue-500'
                  }
                `}
              >
                <motion.div
                  animate={{ rotate: [0, 20, 0, -20, 0] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              </Button>
            )}
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`
                rounded-full w-10 h-10 flex items-center justify-center ml-1
                ${isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-blue-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-blue-500'
                }
              `}
            >
              <Mic className="w-4 h-4" />
            </Button>
            
            <Button
              type="submit"
              className="rounded-full h-10 px-4 bg-blue-500 hover:bg-blue-600 text-white ml-1"
            >
              <span className="sr-only md:not-sr-only md:mr-2">Search</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </form>
      
      {/* Bottom shadow effect */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4/5 h-4 bg-blue-500/20 blur-xl rounded-full" />
    </motion.div>
  );
}