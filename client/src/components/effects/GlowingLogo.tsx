import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

interface GlowingLogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  withText?: boolean;
}

export default function GlowingLogo({ 
  className = '',
  size = 'medium',
  withText = true 
}: GlowingLogoProps) {
  const { isDarkMode } = useTheme();
  
  // Size variations
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16 md:w-20 md:h-20'
  };
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        {/* Outer glow pulse */}
        <motion.div 
          className={`absolute rounded-full bg-blue-500 ${sizeClasses[size]}`}
          initial={{ opacity: 0.2, scale: 1 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ 
            filter: 'blur(10px)',
            top: 0,
            left: 0
          }}
        />
        
        {/* Inner logo with inner glow */}
        <div className={`relative ${sizeClasses[size]} bg-black rounded-full flex items-center justify-center overflow-hidden z-10`}>
          {/* Inner glow */}
          <motion.div 
            className="absolute inset-0 bg-blue-500 opacity-40"
            animate={{ 
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{ 
              filter: 'blur(4px)'
            }}
          />
          
          {/* Logo symbol - "B" letter */}
          <motion.div 
            className="text-white font-bold relative z-10"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          >
            <span className={size === 'small' ? 'text-lg' : size === 'medium' ? 'text-2xl' : 'text-3xl md:text-4xl'}>
              B
            </span>
          </motion.div>
          
          {/* Digital circuit lines */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-blue-400" />
            <div className="absolute bottom-1/4 left-1/4 w-1/2 h-[1px] bg-blue-400" />
            <div className="absolute top-1/4 right-1/4 w-[1px] h-1/2 bg-blue-400" />
          </div>
        </div>
      </div>
      
      {withText && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`font-bold ${
            size === 'small' ? 'text-lg' : 
            size === 'medium' ? 'text-xl' : 
            'text-2xl md:text-3xl'
          }`}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-400">
            Bloggers
          </span>
          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Ground</span>
        </motion.div>
      )}
    </div>
  );
}