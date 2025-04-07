import { useState, useRef } from 'react';
import { Link } from 'wouter';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Clock, MessageSquare, BookmarkPlus, Share2 } from 'lucide-react';
import { BlogWithAuthor } from '@shared/schema';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Badge } from '@/components/ui/badge';

interface FuturisticBlogCardProps {
  blog: BlogWithAuthor;
  className?: string;
  featured?: boolean;
  readingTime?: number;
}

export default function FuturisticBlogCard({ 
  blog, 
  className = '',
  featured = false,
  readingTime = 3 // Default fallback
}: FuturisticBlogCardProps) {
  const { isDarkMode } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // For 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseX = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 400, damping: 30 });
  
  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);
  const glowX = useTransform(mouseX, [-100, 100], ['-20%', '20%']);
  const glowY = useTransform(mouseY, [-100, 100], ['-20%', '20%']);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate cursor position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Normalize values between -100 and 100 for rotation
    x.set((e.clientX - centerX) / (rect.width / 2) * 100);
    y.set((e.clientY - centerY) / (rect.height / 2) * 100);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };
  
  // Format the date
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  // Handle fallback for missing data
  const categoryName = blog.categoryId ? 'Technology' : 'General'; // Temporary fallback
  const avatarUrl = blog.author?.avatar || 'https://ui-avatars.com/api/?name=User&background=random';
  const authorName = blog.author?.name || 'Anonymous';
  
  return (
    <div className={className}>
      <motion.div
        ref={cardRef}
        className={cn(
          'relative overflow-hidden rounded-xl h-full',
          isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100 shadow-md',
          featured ? 'md:h-[480px]' : 'h-full'
        )}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: 'preserve-3d',
          perspective: 1000,
        }}
        whileHover={{
          scale: 1.02,
          borderColor: '#3b82f6',
          transition: { duration: 0.3 }
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glow effect following cursor */}
        {isHovered && (
          <motion.div 
            className="absolute -inset-[100px] pointer-events-none opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0) 70%)',
              left: glowX,
              top: glowY,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
        
        {/* Background gradients & patterns */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 ${isDarkMode ? 'opacity-25' : 'opacity-10'}`}>
            {isDarkMode && (
              <div className="absolute inset-0 bg-[linear-gradient(40deg,rgba(0,0,20,0)_70%,rgba(59,130,246,0.1)_100%)]" />
            )}
            
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoNTksMTMwLDI0NiwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiPjwvcmVjdD4KPC9zdmc+')]" />
          </div>
        </div>
      
        {/* Image section with overlay */}
        <div 
          className={`relative overflow-hidden w-full ${featured ? 'h-64' : 'h-48'}`}
          style={{ transform: 'translateZ(20px)' }}
        >
          <img 
            src={blog.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1170&auto=format&fit=crop'}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Category pill */}
          <Badge 
            className="absolute top-4 left-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-full text-xs"
          >
            {categoryName}
          </Badge>
          
          {/* Date pill */}
          <Badge 
            variant="outline"
            className={`absolute top-4 right-4 backdrop-blur-md text-xs 
              ${isDarkMode ? 'bg-gray-900/70 text-gray-200 border-gray-700' : 'bg-white/80 text-gray-700 border-gray-200'}`}
          >
            <Clock className="w-3 h-3 mr-1" />
            {formattedDate}
          </Badge>
          
          {/* Reading time pill */}
          <Badge 
            variant="outline"
            className={`absolute bottom-4 right-4 backdrop-blur-md text-xs 
              ${isDarkMode ? 'bg-gray-900/70 text-gray-200 border-gray-700' : 'bg-white/80 text-gray-700 border-gray-200'}`}
          >
            <Clock className="w-3 h-3 mr-1 text-blue-400" />
            {readingTime} min read
          </Badge>
        </div>
        
        {/* Content section */}
        <div className={`relative p-5 z-10 ${featured ? 'space-y-4' : 'space-y-3'}`}>
          <Link href={`/blogs/${blog.slug}`}>
            <motion.h3 
              className={`font-bold leading-tight cursor-pointer hover:text-blue-500 transition-colors 
                ${featured ? 'text-2xl' : 'text-xl'}`}
              style={{ transform: 'translateZ(40px)' }}
            >
              {blog.title}
            </motion.h3>
          </Link>
          
          <motion.p 
            className={`text-muted-foreground line-clamp-${featured ? '3' : '2'}`}
            style={{ transform: 'translateZ(30px)' }}
          >
            {blog.excerpt || blog.content?.substring(0, 150) + '...'}
          </motion.p>
          
          {/* Author info */}
          <motion.div 
            className="flex items-center mt-4 space-x-3 justify-between"
            style={{ transform: 'translateZ(30px)' }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={avatarUrl} 
                  alt={authorName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/50"
                />
                {/* Status indicator */}
                <div className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900" />
              </div>
              
              <div>
                <div className="font-medium">{authorName}</div>
                <div className="text-xs text-muted-foreground">Content Creator</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button className="p-1.5 rounded-full text-blue-500 hover:bg-blue-500/10 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-full text-blue-500 hover:bg-blue-500/10 transition-colors">
                <BookmarkPlus className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-full text-blue-500 hover:bg-blue-500/10 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Futuristic hover border effect */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <div className="absolute inset-0 border-2 border-blue-500/30 rounded-xl" />
          
          {/* Animated corner accents */}
          {[
            'top-0 left-0',
            'top-0 right-0',
            'bottom-0 left-0',
            'bottom-0 right-0'
          ].map((position, index) => (
            <motion.div 
              key={index}
              className={`absolute ${position} w-4 h-4 border-blue-500`}
              initial={{
                opacity: 0,
                x: index % 2 === 0 ? -5 : 5,
                y: index < 2 ? -5 : 5,
              }}
              animate={isHovered ? {
                opacity: 1,
                x: 0,
                y: 0,
              } : {}}
              transition={{ duration: 0.3 }}
            >
              {index === 0 && <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500" />}
              {index === 0 && <div className="absolute top-0 left-0 w-[2px] h-full bg-blue-500" />}
              
              {index === 1 && <div className="absolute top-0 right-0 w-full h-[2px] bg-blue-500" />}
              {index === 1 && <div className="absolute top-0 right-0 w-[2px] h-full bg-blue-500" />}
              
              {index === 2 && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500" />}
              {index === 2 && <div className="absolute bottom-0 left-0 w-[2px] h-full bg-blue-500" />}
              
              {index === 3 && <div className="absolute bottom-0 right-0 w-full h-[2px] bg-blue-500" />}
              {index === 3 && <div className="absolute bottom-0 right-0 w-[2px] h-full bg-blue-500" />}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}