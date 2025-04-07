import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Blog, BlogWithAuthor } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedSliderProps {
  className?: string;
}

export default function FeaturedSlider({ className }: FeaturedSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { data: featuredBlogs = [], isLoading, error } = useQuery<BlogWithAuthor[]>({
    queryKey: ['/api/blogs/featured', 3],
    staleTime: 60000, // 1 minute
  });

  useEffect(() => {
    if (!featuredBlogs || featuredBlogs.length === 0 || !isAutoPlaying) return;
    
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % featuredBlogs.length);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [current, featuredBlogs, isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => 
      prev === 0 ? (featuredBlogs?.length || 1) - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => 
      (prev + 1) % (featuredBlogs?.length || 1)
    );
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrent(index);
  };

  if (isLoading) {
    return (
      <div className={`relative rounded-2xl overflow-hidden shadow-lg ${className}`}>
        <Skeleton className="w-full h-80" />
      </div>
    );
  }

  if (error || !featuredBlogs || featuredBlogs.length === 0) {
    return (
      <div className={`relative rounded-2xl overflow-hidden shadow-lg ${className} bg-muted`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-xl font-bold mb-2">No featured blogs available</h3>
          <p className="text-muted-foreground">Check back later for featured content</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm border border-blue-500/20 ${className}`}>
      <AnimatePresence mode="wait">
        {featuredBlogs.map((blog: BlogWithAuthor, index: number) => (
          index === current && (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="relative w-full h-[500px] md:h-[550px] overflow-hidden group"
            >
              {/* Animated background glow elements */}
              <div className="absolute -inset-2 bg-blue-500/10 opacity-0 group-hover:opacity-100 duration-1000 transition-opacity blur-2xl z-0"></div>
              
              <img 
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-3000"
              />
              
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
              
              {/* Animated lines */}
              <div className="absolute inset-x-0 bottom-0 h-px w-full">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent transform translate-y-0"></div>
              </div>
              
              <Link href={`/blogs/${blog.slug}`}>
                <div className="absolute inset-0 cursor-pointer z-10">
                  <div className="absolute left-0 bottom-0 w-full p-8 md:p-10">
                    <div className="space-y-6">
                      {/* Category and reading time with glow */}
                      <div className="flex items-center space-x-4">
                        <span className="px-4 py-1.5 bg-blue-900/70 border border-blue-400/30 text-blue-100 text-xs font-medium rounded-full backdrop-blur-sm shadow-sm shadow-blue-400/20 inline-flex items-center">
                          <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                          Technology
                        </span>
                        <span className="text-gray-300 text-sm backdrop-blur-sm px-3 py-1 rounded-full bg-gray-800/50">
                          {blog.readingTime} min read
                        </span>
                      </div>
                      
                      {/* Title with hover effect */}
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 leading-tight tracking-tight group-hover:text-blue-100 transition-colors duration-500 max-w-3xl">
                        {blog.title}
                      </h2>
                      
                      <p className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-2xl mb-4">
                        {blog.excerpt}
                      </p>
                      
                      {/* Author info with glass effect */}
                      <div className="flex items-center space-x-3 mt-6 backdrop-blur-md bg-black/30 rounded-full py-2 px-4 w-fit">
                        {blog.author?.avatar ? (
                          <img
                            src={blog.author.avatar}
                            alt={blog.author.name || 'Author'}
                            className="w-10 h-10 rounded-full object-cover border-2 border-blue-400/30"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm border-2 border-blue-400/30">
                            {blog.author?.name?.charAt(0) || 'A'}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-white font-medium text-sm">
                            {blog.author?.name || 'Anonymous'}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      
                      {/* Read more button with hover effect */}
                      <button className="mt-4 px-6 py-2.5 bg-blue-600/30 hover:bg-blue-600/50 backdrop-blur-md text-white rounded-full text-sm font-medium transition-all duration-300 border border-blue-500/30 inline-flex items-center group-hover:shadow-glow shadow-blue-500/30">
                        Read Article
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Enhanced navigation buttons with futuristic style */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-blue-900/40 border border-blue-500/20 backdrop-blur-md rounded-full w-12 h-12 z-20 items-center justify-center shadow-xl shadow-black/30 transition-all duration-300 hover:scale-110 hidden md:flex group"
        onClick={handlePrev}
      >
        <ChevronLeft className="h-5 w-5 text-white group-hover:text-blue-200" />
        <span className="sr-only">Previous</span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-blue-900/40 border border-blue-500/20 backdrop-blur-md rounded-full w-12 h-12 z-20 items-center justify-center shadow-xl shadow-black/30 transition-all duration-300 hover:scale-110 hidden md:flex group"
        onClick={handleNext}
      >
        <ChevronRight className="h-5 w-5 text-white group-hover:text-blue-200" />
        <span className="sr-only">Next</span>
      </Button>

      {/* Enhanced navigation dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 backdrop-blur-md bg-black/30 rounded-full px-4 py-2 border border-blue-500/20">
        {featuredBlogs.map((_: any, index: number) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              index === current 
                ? "bg-blue-400 shadow-md shadow-blue-400/50 scale-110" 
                : "bg-gray-500/50 hover:bg-gray-400/70"
            }`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-transparent w-full z-20">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 to-blue-700"
          initial={{ width: 0 }}
          animate={{ width: `${(current / (featuredBlogs.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
