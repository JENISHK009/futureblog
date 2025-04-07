import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { BlogWithDetails, BlogWithAuthor, BlogRecommendation, InsertReadingHistory } from "@shared/schema";
import { apiRequest } from "../lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Heart, MessageSquare, Share2, Bookmark, Clock, Calendar, ArrowUp, ChevronRight, ThumbsUp, Eye } from "lucide-react";
import ScrollReveal from "@/components/effects/ScrollReveal";
import BackgroundGradient from "@/components/effects/BackgroundGradient";
import { useTheme } from "@/contexts/ThemeContext";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showMobileTOC, setShowMobileTOC] = useState(false);
  const [readingTimeElapsed, setReadingTimeElapsed] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const readStartTime = useRef(Date.now());
  
  const { data: blog, isLoading, error } = useQuery<BlogWithDetails>({
    queryKey: [`/api/blogs/${slug}`],
  });
  
  // Fetch personalized recommendations for the user
  const { data: recommendedBlogs, isLoading: isLoadingRecommendations } = useQuery<BlogWithAuthor[]>({
    queryKey: [`/api/users/1/recommendations`], // Using user ID 1 for demonstration
    enabled: !!blog, // Only fetch recommendations after blog loaded
  });
  
  // Fetch related blogs specific to this blog post
  const { data: relatedBlogs, isLoading: isLoadingRelated } = useQuery<BlogWithAuthor[]>({
    queryKey: [`/api/blogs/${blog?.id}/related`],
    enabled: !!blog?.id, // Only fetch when blog ID is available
  });
  
  // Mutation to track reading history
  const trackReadingMutation = useMutation({
    mutationFn: async (readingData: InsertReadingHistory) => {
      const res = await apiRequest('POST', '/api/reading-history', readingData);
      return await res.json();
    }
  });
  
  // Initialize scroll animation without waiting for blog data
  const scrollValues = useScroll();
  const headerOpacity = useTransform(scrollValues.scrollY, [0, 300], [1, 0.3]);
  const headerScale = useTransform(scrollValues.scrollY, [0, 300], [1, 1.05]);
  const titleY = useTransform(scrollValues.scrollY, [0, 300], [0, 100]);
  
  // Safely calculate reading time for the content
  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 225;
    const wordCount = content?.trim().split(/\s+/).length || 0;
    return Math.ceil(wordCount / wordsPerMinute) || 1; // Minimum 1 minute
  };
  
  useEffect(() => {
    if (!blog?.content) return;
    
    // Generate TOC from content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = blog.content;
    
    const headings = tempDiv.querySelectorAll('h2, h3, h4');
    const items: TOCItem[] = [];
    
    headings.forEach((heading) => {
      const id = heading.id || heading.textContent?.trim().toLowerCase().replace(/\s+/g, '-') || '';
      const text = heading.textContent || '';
      const level = parseInt(heading.tagName.substring(1));
      
      items.push({ id, text, level });
      
      // Add IDs to headings in the content if they don't have one
      if (!heading.id) {
        heading.id = id;
      }
    });
    
    setTocItems(items);
  }, [blog?.content]);
  
  useEffect(() => {
    if (!contentRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0,
      }
    );
    
    const headingElements = contentRef.current.querySelectorAll('h2, h3, h4');
    headingElements.forEach((element) => {
      observer.observe(element);
    });
    
    return () => {
      headingElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [tocItems]);
  
  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Get theme for style decisions
  const { isDarkMode } = useTheme();
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-96 w-full mb-10 rounded-xl" />
          <Skeleton className="h-12 w-3/4 mb-6" />
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-5 w-40 mb-1" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full mb-3" />
          ))}
        </div>
      </div>
    );
  }
  
  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
        <p className="text-muted-foreground mb-6">
          The blog you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => setLocation("/blogs")}>
          Back to Blogs
        </Button>
      </div>
    );
  }
  
  // Type safety - ensure we have a proper blog object
  // Create safe defaults for all properties that might be used in the UI
  const safeBlog = {
    id: blog.id || 0,
    title: blog.title || 'Untitled Blog',
    content: blog.content || '',
    excerpt: blog.excerpt || '',
    slug: blog.slug || '',
    featuredImage: blog.featuredImage || 'https://via.placeholder.com/800x400?text=Bloggers+Ground',
    categoryId: blog.categoryId || 0,
    authorId: blog.authorId || 0,
    createdAt: blog.createdAt || new Date().toISOString(),
    readingTime: blog.readingTime || calculateReadingTime(blog.content || ''),
    likes: blog.likes || 0,
    comments: blog.comments || 0,
    author: {
      id: blog.author?.id || 0, 
      name: blog.author?.name || 'Anonymous', 
      username: blog.author?.username || 'anonymous', 
      email: blog.author?.email || '', 
      avatar: blog.author?.avatar || null, 
      bio: blog.author?.bio || null, 
      password: blog.author?.password || '', 
      createdAt: blog.author?.createdAt || new Date().toISOString()
    },
    category: {
      id: blog.category?.id || 0, 
      name: blog.category?.name || 'Uncategorized', 
      slug: blog.category?.slug || 'uncategorized', 
      icon: blog.category?.icon || '',
      blogCount: blog.category?.blogCount || 0
    }
  };
  
  // Show back to top button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Track reading history when the blog post loads
  useEffect(() => {
    if (!blog?.id) return;
    
    // Reset reading start time
    readStartTime.current = Date.now();
    
    // Create reading history entry when the blog is loaded
    trackReadingMutation.mutate({
      blogId: blog.id,
      userId: 1, // Using user ID 1 for demonstration
      readCount: 1,
      readTimeSeconds: 0, // Initial time is 0, will be updated when user leaves the page
      completedReading: false,
      liked: false,
      bookmarked: false
    });
    
    // Start interval to track reading time
    const interval = setInterval(() => {
      setReadingTimeElapsed(Math.floor((Date.now() - readStartTime.current) / 1000));
    }, 1000);
    
    // Clean up
    return () => {
      clearInterval(interval);
      
      // When unmounting, update reading history with actual time spent
      if (blog?.id) {
        const timeSpentInSeconds = Math.floor((Date.now() - readStartTime.current) / 1000);
        if (timeSpentInSeconds > 5) { // Only log if user spent at least 5 seconds on the page
          trackReadingMutation.mutate({
            blogId: blog.id,
            userId: 1, // Using user ID 1 for demonstration
            readCount: 1,
            readTimeSeconds: timeSpentInSeconds,
            completedReading: true, // Mark as completed if user has been on the page
            liked: false,
            bookmarked: false
          });
        }
      }
    };
  }, [blog?.id]);

  return (
    <div className="min-h-screen">
      {/* Background with subtle gradient */}
      <BackgroundGradient className="fixed inset-0 z-[-1]" variant="cyber" />
      
      {/* Floating Back to Top Button */}
      <motion.button
        className="fixed bottom-8 right-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg z-50 shadow-blue-600/20"
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0.8,
          y: showBackToTop ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>
      
      {/* Mobile TOC Toggle Button */}
      <motion.button
        className="fixed bottom-8 left-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg z-50 shadow-blue-600/20 lg:hidden"
        onClick={() => setShowMobileTOC(!showMobileTOC)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: tocItems.length > 0 ? 1 : 0,
          scale: tocItems.length > 0 ? 1 : 0.8
        }}
        transition={{ duration: 0.3 }}
        aria-label="Toggle table of contents"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </motion.button>
      
      {/* Mobile TOC Drawer */}
      <AnimatePresence>
        {showMobileTOC && (
          <motion.div 
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileTOC(false)}></div>
            <motion.div
              className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-zinc-900 border-t border-blue-900/50 rounded-t-2xl overflow-hidden shadow-xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-blue-900/20">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Table of Contents
                </h3>
                <button 
                  onClick={() => setShowMobileTOC(false)}
                  className="p-1 rounded-full hover:bg-blue-900/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="overflow-y-auto p-6 max-h-[calc(70vh-64px)] scrollbar-hide">
                <div className="space-y-2">
                  {tocItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`
                        block py-2 px-3 text-base rounded-lg transition-all duration-200
                        ${item.level === 3 ? 'ml-4' : item.level === 4 ? 'ml-8' : 'ml-0'} 
                        ${activeId === item.id 
                          ? 'bg-blue-900/30 text-blue-400 font-medium border-l-2 border-blue-500' 
                          : 'text-gray-300 hover:bg-blue-900/10'}
                      `}
                      onClick={() => setShowMobileTOC(false)}
                    >
                      {item.text}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hero Section with Featured Image */}
      <motion.div 
        className="relative w-full h-[70vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Parallax Image */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ 
            opacity: headerOpacity,
            scale: headerScale
          }}
        >
          <img
            src={safeBlog.featuredImage}
            alt={safeBlog.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        </motion.div>
        
        {/* Content overlay with title and meta */}
        <div className="absolute inset-0 flex items-end">
          <motion.div 
            className="container mx-auto px-4 md:px-6 pb-12 md:pb-20"
            style={{ y: titleY }}
          >
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-white font-medium">
                  {safeBlog.category.name}
                </Badge>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        variant="outline" 
                        className="backdrop-blur-md bg-black/30 border-gray-700 text-gray-300 flex items-center gap-1 px-3"
                      >
                        <Clock className="h-3 w-3 text-blue-400" />
                        {safeBlog.readingTime} min read
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Estimated reading time</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        variant="outline" 
                        className="backdrop-blur-md bg-black/30 border-gray-700 text-gray-300 flex items-center gap-1 px-3"
                      >
                        <Eye className="h-3 w-3 text-blue-400" />
                        {1043 + safeBlog.id} views
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total views</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading leading-tight">
                {safeBlog.title}
              </h1>
              
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 ring-2 ring-blue-500/50">
                  {safeBlog.author.avatar ? (
                    <AvatarImage src={safeBlog.author.avatar} alt={safeBlog.author.name} />
                  ) : (
                    <AvatarFallback className="bg-blue-900 text-blue-100">
                      {safeBlog.author.name.charAt(0) || 'A'}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div>
                  <h3 className="font-medium text-white">{safeBlog.author.name}</h3>
                  <div className="flex items-center text-sm text-gray-300">
                    <Calendar className="h-3 w-3 mr-1 text-blue-400" /> 
                    {new Date(safeBlog.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                
                <div className="ml-auto flex space-x-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 backdrop-blur-sm text-white rounded-full p-3 h-10 w-10"
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Save for later</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 backdrop-blur-sm text-white rounded-full p-3 h-10 w-10"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share this article</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-6 py-10 relative">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Sticky TOC - Desktop */}
          <aside className="hidden lg:block lg:w-64 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24">
              <ScrollReveal direction="left" distance={20}>
                <div className="p-5 rounded-xl border border-blue-900/30 backdrop-blur-sm bg-slate-50/5 dark:bg-zinc-900/30 shadow-lg futuristic-glow">
                  <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Table of Contents
                  </h3>
                  
                  <div className="space-y-1">
                    {tocItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 + index * 0.04 }}
                      >
                        <a
                          href={`#${item.id}`}
                          className={`
                            flex items-center py-1.5 text-sm group transition-all duration-200
                            ${item.level === 3 ? 'pl-4' : item.level === 4 ? 'pl-6' : 'pl-0'} 
                            ${activeId === item.id 
                              ? 'text-blue-500 font-medium' 
                              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}
                          `}
                        >
                          {activeId === item.id && (
                            <span className="absolute -left-0.5 w-1 h-5 bg-blue-500 rounded-full opacity-70"></span>
                          )}
                          <ChevronRight className={`mr-1 h-3 w-3 transition-opacity duration-200 
                            ${activeId === item.id ? 'opacity-100 text-blue-500' : 'opacity-0 group-hover:opacity-70'}`} 
                          />
                          <span className="truncate">{item.text}</span>
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
              
              {/* Social Share Buttons */}
              <ScrollReveal direction="left" delay={0.2} distance={20}>
                <div className="mt-6 p-5 rounded-xl border border-blue-900/30 backdrop-blur-sm bg-slate-50/5 dark:bg-zinc-900/30 shadow-lg futuristic-glow">
                  <h3 className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">SHARE THIS ARTICLE</h3>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-lg h-9 w-9 p-0 shadow-glow hover:shadow-blue-500/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                      </svg>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-lg h-9 w-9 p-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                      </svg>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-lg h-9 w-9 p-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                      </svg>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-lg h-9 w-9 p-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                      </svg>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 order-1 lg:order-2">
            <article>
              {/* Blog content */}
              <ScrollReveal>
                <div 
                  ref={contentRef}
                  className={`prose ${isDarkMode ? 'dark:prose-invert' : ''} prose-lg max-w-none
                    prose-headings:font-heading prose-headings:font-bold
                    prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 
                    prose-h2:pb-2 prose-h2:border-b prose-h2:border-blue-500/20
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-gray-700 dark:prose-p:text-gray-300
                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline prose-a:font-medium hover:prose-a:text-blue-800 dark:hover:prose-a:text-blue-300
                    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-md
                    prose-img:rounded-xl prose-img:shadow-lg
                  `}
                  dangerouslySetInnerHTML={{ __html: safeBlog.content }}
                />
              </ScrollReveal>
              
              {/* Post interaction bar */}
              <ScrollReveal distance={20} delay={0.2}>
                <div className="border-t border-b border-gray-200 dark:border-gray-800 py-6 my-10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 px-3"
                    >
                      <Heart className="h-5 w-5" />
                      <span className="font-medium">{safeBlog.likes}</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 px-3"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span className="font-medium">{safeBlog.comments}</span>
                    </Button>
                  </div>
                  
                  <div className="flex items-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      onClick={scrollToTop}
                    >
                      <ArrowUp className="h-5 w-5 mr-2" />
                      Back to top
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
              
              {/* Author section */}
              <ScrollReveal>
                <div className="bg-slate-50/50 dark:bg-zinc-900/50 border border-blue-100 dark:border-blue-900/30 rounded-xl p-6 shadow-lg backdrop-blur-sm mb-12">
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <Avatar className="h-20 w-20 ring-4 ring-blue-500/20">
                      {safeBlog.author.avatar ? (
                        <AvatarImage src={safeBlog.author.avatar} alt={safeBlog.author.name} />
                      ) : (
                        <AvatarFallback className="bg-blue-900 text-blue-100 text-xl">
                          {safeBlog.author.name.charAt(0) || 'A'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{safeBlog.author.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {safeBlog.author.bio || 'No biography available for this author.'}
                      </p>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
                        >
                          Follow
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
              
              {/* Related blogs section */}
              <ScrollReveal>
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 inline-block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Related Articles
                  </h2>
                  
                  {/* Show loading skeleton if related blogs are still loading */}
                  {isLoadingRelated && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-xl overflow-hidden">
                          <Skeleton className="h-48 w-full" />
                          <div className="p-4">
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-6 w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* If related blogs are available, display them */}
                  {relatedBlogs && relatedBlogs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {relatedBlogs.map((blog) => (
                        <a 
                          key={blog.id}
                          href={`/blogs/${blog.slug}`}
                          className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg dark:shadow-zinc-800/10 dark:hover:shadow-zinc-800/20 transition-all duration-300 group"
                        >
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={blog.featuredImage}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                                {blog.readingTime} min read
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(blog.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="text-lg font-medium leading-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                              {blog.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                              {blog.excerpt}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                  
                  {/* If no related blogs are found, show message */}
                  {relatedBlogs && relatedBlogs.length === 0 && !isLoadingRelated && (
                    <div className="text-center p-8 bg-slate-50/50 dark:bg-zinc-900/50 rounded-xl">
                      <p className="text-gray-500 dark:text-gray-400">No related articles found for this topic.</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
              
              {/* Personalized recommendations section */}
              <ScrollReveal>
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 inline-block bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    Recommended For You
                  </h2>
                  
                  {/* Show loading skeleton if recommendations are still loading */}
                  {isLoadingRecommendations && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-xl overflow-hidden">
                          <Skeleton className="h-48 w-full" />
                          <div className="p-4">
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-6 w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* If recommendations are available, display them */}
                  {recommendedBlogs && recommendedBlogs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recommendedBlogs.map((blog: any) => (
                        <a 
                          key={blog.id}
                          href={`/blogs/${blog.slug}`}
                          className="group relative bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm p-[1px] rounded-xl overflow-hidden"
                        >
                          {/* Animated border effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-30 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                          
                          <div className="relative bg-white dark:bg-zinc-900 rounded-xl overflow-hidden z-10">
                            <div className="relative h-48 overflow-hidden">
                              <img 
                                src={blog.featuredImage}
                                alt={blog.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                              
                              {/* Recommendation badge */}
                              {blog.recommendationScore && (
                                <div className="absolute top-3 right-3 bg-blue-600/90 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
                                  {Math.round(blog.recommendationScore * 100)}% match
                                </div>
                              )}
                              
                              {/* Recommendation reason */}
                              {blog.matchReason && (
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                  <div className="text-sm text-white font-medium">
                                    {blog.matchReason}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                                  {blog.readingTime} min read
                                </span>
                                <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                  <Heart className="h-3 w-3 mr-1 text-red-500" />
                                  {blog.likes}
                                </span>
                              </div>
                              <h3 className="text-lg font-medium leading-tight group-hover:text-blue-500 transition-colors duration-200 line-clamp-2">
                                {blog.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                                {blog.excerpt}
                              </p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                  
                  {/* If no recommendations are found, show message */}
                  {recommendedBlogs && recommendedBlogs.length === 0 && !isLoadingRecommendations && (
                    <div className="text-center p-8 bg-gradient-to-br from-blue-900/10 to-purple-900/10 rounded-xl">
                      <p className="text-gray-500 dark:text-gray-400">Keep reading articles to get personalized recommendations!</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
              
              {/* Comments section - Placeholder */}
              <ScrollReveal>
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 inline-block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Comments ({safeBlog.comments})
                  </h2>
                  
                  {/* Comment form */}
                  <div className="bg-slate-50/50 dark:bg-zinc-900/50 rounded-xl p-6 mb-8 border border-blue-100 dark:border-blue-900/30">
                    <h3 className="font-medium mb-4">Leave your thoughts</h3>
                    <textarea 
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-200"
                      placeholder="Join the discussion..."
                      rows={4}
                    ></textarea>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Post Comment</Button>
                  </div>
                  
                  {/* Comment list - placeholder */}
                  <div className="space-y-6">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`https://i.pravatar.cc/100?img=${i + 10}`} />
                          <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-slate-50/80 dark:bg-zinc-900/80 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">{["Jane Cooper", "Robert Fox"][i - 1]}</h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {["2 days ago", "1 week ago"][i - 1]}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                              {[
                                "Great article! I've been looking into this topic for a while, and your explanations really cleared things up for me.",
                                "I appreciate the detailed breakdown. Have you considered exploring the performance implications in a follow-up post? That would be really valuable."
                              ][i - 1]}
                            </p>
                            <div className="mt-3 flex items-center gap-3">
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500 hover:text-blue-600">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {[12, 5][i - 1]}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500 hover:text-blue-600">
                                Reply
                              </Button>
                            </div>
                          </div>
                          
                          {i === 1 && (
                            <div className="mt-4 ml-8 flex gap-4">
                              <Avatar className="h-10 w-10">
                                {safeBlog.author.avatar ? (
                                  <AvatarImage src={safeBlog.author.avatar} alt={safeBlog.author.name} />
                                ) : (
                                  <AvatarFallback className="bg-blue-900 text-blue-100">
                                    {safeBlog.author.name.charAt(0) || 'A'}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-blue-50/80 dark:bg-blue-950/30 p-4 rounded-lg">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium flex items-center">
                                      {safeBlog.author.name}
                                      <Badge className="ml-2 bg-blue-600 text-[10px] py-0">Author</Badge>
                                    </h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Thank you for your kind words! I'm glad you found the article helpful. I'm planning to write more on this topic soon.
                                  </p>
                                  <div className="mt-3 flex items-center gap-3">
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500 hover:text-blue-600">
                                      <ThumbsUp className="h-4 w-4 mr-1" />
                                      8
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500 hover:text-blue-600">
                                      Reply
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}