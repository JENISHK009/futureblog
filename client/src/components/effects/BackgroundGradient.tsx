import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

interface BackgroundGradientProps {
  className?: string;
  variant?: 'default' | 'cyber';
}

export default function BackgroundGradient({ 
  className = '', 
  variant = 'default' 
}: BackgroundGradientProps) {
  const { isDarkMode } = useTheme();
  
  if (variant === 'cyber') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        {/* Animated cyber-gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black opacity-80" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gNTAgMCBMIDAgMCAwIDUwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwxMjMsMjU1LDAuMDgpIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSI+PC9yZWN0Pgo8L3N2Zz4=')]" />
        
        {/* Cyber blue gradient 1 */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full opacity-30 bg-blue-500 blur-[150px]"
          animate={{ 
            scale: [1, 1.2, 1.1, 1],
            opacity: [0.2, 0.25, 0.2, 0.2],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        {/* Cyber blue gradient 2 */}
        <motion.div 
          className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-20 bg-blue-400 blur-[100px]"
          animate={{ 
            scale: [1, 1.1, 0.9, 1],
            opacity: [0.2, 0.3, 0.15, 0.2],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        {/* Animated "scan line" effect */}
        <motion.div 
          className="absolute inset-0 overflow-hidden opacity-10"
          initial={{ opacity: 0.1 }}
          animate={{ opacity: [0.1, 0.12, 0.1] }}
          transition={{
            repeat: Infinity,
            duration: 2
          }}
        >
          <motion.div 
            className="w-full h-1 bg-blue-400 blur-sm"
            animate={{ 
              y: ['-100vh', '200vh'],
            }}
            transition={{ 
              repeat: Infinity,
              duration: 5,
              ease: "linear"
            }}
          />
        </motion.div>
        
        {/* Digital noise overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj4KICA8ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+CiAgICA8ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIiAvPgogICAgPGZlQ29tcG9zaXRlIG9wZXJhdG9yPSJhcml0aG1ldGljIiBrMT0iMCIgazI9IjAuMDgiIGszPSIwIiBrND0iMCIgLz4KICA8L2ZpbHRlcj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPg==')]" />
        
        {/* Subtle horizontal light beam */}
        <motion.div 
          className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70"
          animate={{ 
            opacity: [0, 0.7, 0],
            scaleY: [1, 2, 1],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
        />
      </div>
    );
  }
  
  // Default gradient background
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Top-right gradient */}
      <div 
        className={`absolute top-0 right-0 w-1/3 h-1/3 rounded-full blur-[100px] opacity-20 
                  ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'}`}
        style={{ transform: 'translate(20%, -20%)' }}
      />
      
      {/* Top-left gradient */}
      <div 
        className={`absolute top-0 left-0 w-1/4 h-1/4 rounded-full blur-[80px] opacity-10
                  ${isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`}
        style={{ transform: 'translate(-20%, -20%)' }}
      />
      
      {/* Bottom-left gradient */}
      <div 
        className={`absolute bottom-0 left-0 w-1/3 h-1/3 rounded-full blur-[100px] opacity-20
                  ${isDarkMode ? 'bg-primary' : 'bg-primary/70'}`}
        style={{ transform: 'translate(-20%, 20%)' }}
      />
      
      {/* Mobile-friendly smaller gradient */}
      <div 
        className={`absolute top-1/2 left-1/2 w-1/3 h-1/3 rounded-full blur-[100px] opacity-10 transform -translate-x-1/2 -translate-y-1/2
                  ${isDarkMode ? 'bg-blue-400' : 'bg-blue-300'}`}
      />
    </div>
  );
}