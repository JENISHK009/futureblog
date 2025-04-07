import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Category, BlogWithAuthor, WebStory } from "@shared/schema";
import FeaturedSlider from "@/components/common/FeaturedSlider";
import BlogCard from "@/components/common/BlogCard";
import CategoryCard from "@/components/common/CategoryCard";
import WebStoryCard from "@/components/common/WebStoryCard";
import FuturisticBlogCard from "@/components/common/FuturisticBlogCard";
import Newsletter from "@/components/common/Newsletter";
import FuturisticSearch from "@/components/common/FuturisticSearch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Search, ArrowRight, Sparkles, ArrowUpRight, Brain } from "lucide-react";
import BackgroundGradient from "@/components/effects/BackgroundGradient";
import FloatingShapes from "@/components/effects/FloatingShapes";
import ScrollReveal from "@/components/effects/ScrollReveal";
import ShimmerText from "@/components/effects/ShimmerText";
import GlowingLogo from "@/components/effects/GlowingLogo";
import { useTheme } from "@/contexts/ThemeContext";

export default function Home() {
  const { isDarkMode } = useTheme();
  const mainRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end start"]
  });
  
  // Fetch trending blogs
  const { data: trendingBlogs = [], isLoading: isTrendingLoading } = useQuery<BlogWithAuthor[]>({
    queryKey: ['/api/blogs/trending', 3],
  });

  // Fetch categories
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Fetch web stories
  const { data: webStories = [], isLoading: isWebStoriesLoading } = useQuery<WebStory[]>({
    queryKey: ['/api/webstories', 5],
  });
  
  // Staggered cards animation
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  };
  
  // Animate headers on scroll
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);

  return (
    <div ref={mainRef}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
        {/* Futuristic cyber background */}
        <BackgroundGradient variant="cyber" />
        
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ opacity: headerOpacity, y: headerY }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-6">
              <GlowingLogo size="large" />
            </div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="text-white">Welcome to the </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                Future of Blogging
              </span>
            </motion.h1>
            
            <motion.h2 
              className="text-xl md:text-2xl text-white opacity-80 max-w-3xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <ShimmerText 
                text="Curated, Intelligent, Infinite — One Blog at a Time"
                highlightWords={["Intelligent", "Infinite"]}
              />
            </motion.h2>
          </motion.div>
          
          {/* Search Bar */}
          <motion.div 
            className="max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <FuturisticSearch 
              placeholder="Search across the universe of ideas..."
              withAI={true}
            />
          </motion.div>
          
          {/* Popular Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {['Technology', 'Design', 'Programming', 'AI', 'Lifestyle', 'Productivity'].map((tag, i) => (
              <motion.span 
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + (i * 0.1), duration: 0.4 }}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderColor: '#3b82f6'
                }}
                className="text-sm px-4 py-1.5 bg-gray-900/50 backdrop-blur-lg text-gray-200 rounded-full
                  hover:text-white hover:border-blue-500 transition-all duration-300 border border-gray-700/50 cursor-pointer"
              >
                #{tag}
              </motion.span>
            ))}
          </motion.div>
        </div>
        
        {/* Animated scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <span className="text-white/70 text-sm mb-2">Scroll to explore</span>
          <motion.div 
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1"
            initial={{ y: 0 }}
          >
            <motion.div 
              className="w-1.5 h-1.5 bg-blue-500 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Blog Slider Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-blue-950/20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal delay={0.1}>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white group flex items-center">
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  className="mr-3 overflow-hidden"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                    Featured
                  </span>
                </motion.span>
                
                <span className="relative">
                  <span className="relative z-10">Blogs</span>
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="absolute bottom-0 left-0 h-[8px] bg-blue-500/20 z-0"
                  />
                </span>
              </h2>
              
              <Link href="/blogs" className="group flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                <span className="text-sm md:text-base">View all</span>
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </motion.div>
              </Link>
            </div>
          </ScrollReveal>
          
          <div className="w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <FeaturedSlider className="rounded-xl overflow-hidden" />
              
              {/* Glowing shadow */}
              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-4/5 h-2 
                bg-blue-500/30 blur-xl rounded-full opacity-70" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trending Blogs Section with Futuristic Cards */}
      <section className="py-20 bg-gradient-to-b from-blue-950/20 to-slate-950 relative">
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal delay={0.1}>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white group flex items-center">
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  className="mr-3 overflow-hidden"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                    Trending
                  </span>
                </motion.span>
                
                <span className="relative">
                  <span className="relative z-10">Blogs</span>
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="absolute bottom-0 left-0 h-[8px] bg-blue-500/20 z-0"
                  />
                </span>
              </h2>
              
              <Link href="/blogs" className="group flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                <span className="text-sm md:text-base">Explore more</span>
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </motion.div>
              </Link>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isTrendingLoading ? (
              // Skeleton loading UI
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-gray-900 rounded-xl overflow-hidden shadow-lg shadow-blue-900/5">
                  <Skeleton className="w-full h-48 bg-gray-800" />
                  <div className="p-5">
                    <div className="flex items-center space-x-2 mb-3">
                      <Skeleton className="h-6 w-20 bg-gray-800" />
                      <Skeleton className="h-4 w-16 bg-gray-800" />
                    </div>
                    <Skeleton className="h-7 w-full mb-2 bg-gray-800" />
                    <Skeleton className="h-4 w-full mb-1 bg-gray-800" />
                    <Skeleton className="h-4 w-3/4 mb-4 bg-gray-800" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="w-8 h-8 rounded-full bg-gray-800" />
                        <Skeleton className="h-4 w-24 bg-gray-800" />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-4 w-10 bg-gray-800" />
                        <Skeleton className="h-4 w-10 bg-gray-800" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : trendingBlogs && trendingBlogs.length > 0 ? (
              trendingBlogs.map((blog: BlogWithAuthor, i: number) => (
                <motion.div
                  key={blog.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                  <FuturisticBlogCard blog={blog} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400">
                No trending blogs available at the moment
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Showcase Section */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-blue-950/30 relative">
        <FloatingShapes className="opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal delay={0.1}>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white group flex items-center">
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  className="mr-3 overflow-hidden"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                    Explore
                  </span>
                </motion.span>
                
                <span className="relative">
                  <span className="relative z-10">Categories</span>
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="absolute bottom-0 left-0 h-[8px] bg-blue-500/20 z-0"
                  />
                </span>
              </h2>
              
              <Link href="/blogs" className="group flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                <span className="text-sm md:text-base">All categories</span>
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </motion.div>
              </Link>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {isCategoriesLoading ? (
              // Skeleton loading UI
              Array(6).fill(0).map((_, index) => (
                <div key={index} className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 text-center">
                  <Skeleton className="w-14 h-14 rounded-full mx-auto mb-4 bg-gray-800" />
                  <Skeleton className="h-5 w-20 mx-auto mb-2 bg-gray-800" />
                  <Skeleton className="h-4 w-16 mx-auto bg-gray-800" />
                </div>
              ))
            ) : categories && categories.length > 0 ? (
              categories.map((category: Category, i: number) => (
                <ScrollReveal key={category.id} delay={0.1 + (i * 0.1)} direction="up" distance={20}>
                  <motion.div
                    className="relative group bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 text-center h-full transition-all duration-300
                      border border-gray-800 hover:border-blue-500/50 overflow-hidden"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    {/* Glowing overlay on hover */}
                    <motion.div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent" />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-blue-500/60" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-blue-500/40" />
                    </motion.div>
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors duration-300">
                        <Brain className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                      </div>
                      
                      <h3 className="font-bold text-lg text-white mb-1 group-hover:text-blue-300 transition-colors duration-300">
                        {category.name}
                      </h3>
                      
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        80+ articles
                      </p>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400">
                No categories available at the moment
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Web Stories Section */}
      <section className="py-20 bg-gradient-to-b from-blue-950/30 to-slate-950 relative">
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal delay={0.1}>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white group flex items-center">
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  className="mr-3 overflow-hidden"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                    Web
                  </span>
                </motion.span>
                
                <span className="relative">
                  <span className="relative z-10">Stories</span>
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="absolute bottom-0 left-0 h-[8px] bg-blue-500/20 z-0"
                  />
                </span>
              </h2>
              
              <Link href="/webstories" className="group flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                <span className="text-sm md:text-base">All stories</span>
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </motion.div>
              </Link>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.3}>
            <div className="relative">
              {isWebStoriesLoading ? (
                // Skeleton loading for web stories
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="aspect-[9/16] rounded-xl overflow-hidden">
                      <Skeleton className="w-full h-full" />
                    </div>
                  ))}
                </div>
              ) : webStories && webStories.length > 0 ? (
                // Actual web stories
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {webStories.map((story: WebStory, index: number) => (
                    <ScrollReveal key={story.id} delay={0.1 + (index * 0.05)} direction="up" distance={15}>
                      <WebStoryCard 
                        title={story.title}
                        image={story.image}
                        slug={story.slug}
                        authorId={story.authorId}
                        progressPercent={100 - (index * 20)}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              ) : (
                // Empty state
                <div className="text-center py-28">
                  <motion.div 
                    className="inline-block mb-6 p-3 rounded-full bg-blue-500/20 border border-blue-500/30"
                    animate={{ scale: [0.97, 1.03, 0.97] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="w-8 h-8 text-blue-400" />
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                      Web Stories Coming Soon
                    </span>
                  </h3>
                  <p className="text-gray-400 max-w-xl mx-auto mb-8">
                    We're launching our immersive Web Stories feature soon. Stay tuned for captivating visual experiences.
                  </p>
                  
                  <Link href="/webstories">
                    <Button 
                      variant="outline" 
                      className="group bg-transparent border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                    >
                      <span>Get notified when we launch</span>
                      <motion.span 
                        className="ml-2 inline-block"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Newsletter Section with futuristic styling */}
      <ScrollReveal direction="up" distance={30}>
        <section className="py-20 relative overflow-hidden bg-gradient-to-b from-slate-950 to-blue-950/20">
          <div className="absolute inset-0 z-0">
            {/* Futuristic grid */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gNTAgMCBMIDAgMCAwIDUwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoNTksMTMwLDI0NiwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiPjwvcmVjdD4KPC9zdmc+')]" />

            {/* Glow spots */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-[150px] opacity-20"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-400 rounded-full blur-[150px] opacity-15"></div>
          </div>
          
          <div className="container mx-auto px-4 z-10 relative">
            <div className="max-w-4xl mx-auto bg-gray-900/60 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-gray-800 relative overflow-hidden">
              {/* Inner glow */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-[100px] bg-blue-500/5"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
                <div className="absolute bottom-0 top-0 left-0 w-px bg-gradient-to-b from-transparent via-blue-500/40 to-transparent"></div>
                <div className="absolute bottom-0 top-0 right-0 w-px bg-gradient-to-b from-transparent via-blue-500/40 to-transparent"></div>
              </div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <motion.h2 
                    className="text-3xl md:text-4xl font-bold mb-4 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-500">
                      Subscribe
                    </span> to Our Newsletter
                  </motion.h2>
                  
                  <motion.p 
                    className="text-gray-300 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Get weekly insights and updates from the cutting edge of technology and blogging.
                    Join our community of forward-thinking readers.
                  </motion.p>
                </div>
                
                <motion.div
                  className="max-w-md mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Newsletter />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
