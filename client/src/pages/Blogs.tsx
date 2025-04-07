import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform } from "framer-motion";
import { BlogWithAuthor, Category, Tag } from "@shared/schema";
import FuturisticBlogCard from "@/components/common/FuturisticBlogCard";
import FuturisticSearch from "@/components/common/FuturisticSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import BackgroundGradient from "@/components/effects/BackgroundGradient";
import ScrollReveal from "@/components/effects/ScrollReveal";
import ShimmerText from "@/components/effects/ShimmerText";
import {
  Search,
  ArrowUpRight,
  BookmarkPlus,
  Clock,
  SlidersHorizontal,
  Star,
  CalendarDays,
  ArrowDownUp,
  X,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bookmark,
  Hash,
  KeyRound,
  Info
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// Calculate reading time based on content length
const calculateReadingTime = (content: string): number => {
  // Average reading speed is about 200-250 words per minute
  const wordsPerMinute = 225;
  const wordCount = content?.trim().split(/\s+/).length || 0;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime > 0 ? readingTime : 1; // Minimum 1 minute
};

enum SortOptions {
  LATEST = "latest",
  POPULAR = "popular",
  COMMENTS = "comments",
}

enum TimeFilter {
  ALL = "all",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

export default function Blogs() {
  const { isDarkMode } = useTheme();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOptions>(SortOptions.LATEST);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(TimeFilter.ALL);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for sticky elements
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Parse category from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const categoryParam = params.get("category");
    if (categoryParam) {
      setSelectedCategories([parseInt(categoryParam)]);
    }
  }, [location]);

  // Fetch all blogs
  const { data: blogs = [], isLoading: isBlogsLoading } = useQuery<BlogWithAuthor[]>({
    queryKey: ['/api/blogs'],
  });

  // Fetch categories
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Fetch tags for tag cloud
  const { data: tags = [], isLoading: isTagsLoading } = useQuery<Tag[]>({
    queryKey: ['/api/tags'],
  });

  // Filter blogs
  const filteredBlogs = blogs.filter((blog: BlogWithAuthor) => {
    // Search filter
    const matchesSearch = searchQuery 
      ? blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    // Category filter
    const matchesCategory = selectedCategories.length > 0
      ? selectedCategories.includes(blog.categoryId || 0)
      : true;
      
    // Time filter
    let matchesTimeFilter = true;
    const blogDate = new Date(blog.createdAt);
    const now = new Date();
    
    if (timeFilter === TimeFilter.WEEK) {
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesTimeFilter = blogDate >= lastWeek;
    } else if (timeFilter === TimeFilter.MONTH) {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      matchesTimeFilter = blogDate >= lastMonth;
    } else if (timeFilter === TimeFilter.YEAR) {
      const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      matchesTimeFilter = blogDate >= lastYear;
    }
      
    return matchesSearch && matchesCategory && matchesTimeFilter;
  });
    
  // Sort blogs
  const sortedBlogs = [...filteredBlogs].sort((a: BlogWithAuthor, b: BlogWithAuthor) => {
    if (sortBy === SortOptions.LATEST) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === SortOptions.POPULAR) {
      return (b.likes || 0) - (a.likes || 0);
    } else {
      return (b.comments || 0) - (a.comments || 0);
    }
  });

  // Helper function to handle category toggles
  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Staggered card animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * i,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  };
  
  // For Skeleton animations
  const skeletonVariants = {
    shimmer: {
      x: [-100, 100],
      transition: {
        repeat: Infinity,
        repeatType: "mirror" as const,
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950/20 text-white">
      {/* Background cyber elements */}
      <BackgroundGradient variant="cyber" />
      
      {/* Sticky header with search */}
      <div className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${
        scrolled ? 'bg-black/70 shadow-lg shadow-blue-900/10' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                  Explore
                </span>
                <span className="text-white ml-2">Universe of Ideas</span>
              </h1>
              
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="text-blue-500 ml-1"
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            </motion.div>
            
            <div className={`w-full md:w-auto md:min-w-[300px] lg:min-w-[400px] transition-all duration-500 ${
              searchExpanded ? 'md:min-w-[500px]' : ''
            }`}>
              <FuturisticSearch 
                placeholder="Search topics, ideas, creators..."
                onSearch={setSearchQuery}
                withAI={true}
              />
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-gray-900/70 border border-gray-800 hover:bg-gray-800 hover:text-blue-400 text-gray-300"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <span>Filters</span>
              </Button>
              
              <div className="h-6 w-px bg-gray-800"></div>
              
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-full bg-gray-900/70 border border-gray-800 hover:bg-gray-800 hover:text-blue-400 text-gray-300"
                >
                  <BookmarkPlus className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 rounded-full bg-gray-900/70 border border-gray-800 hover:bg-gray-800 hover:text-blue-400 text-gray-300"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar - Categories */}
          <div className="hidden lg:block w-64 shrink-0">
            <ScrollReveal>
              <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-800 sticky top-28">
                <h3 className="text-lg font-bold mb-6 flex items-center text-white">
                  <Filter className="w-4 h-4 mr-2 text-blue-400" />
                  <span>Filter Blogs</span>
                </h3>
                
                {/* Categories Section */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-3 ml-1">Categories</h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
                    {isCategoriesLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <motion.div 
                          key={i}
                          className="h-5 w-full bg-gray-800 rounded-md"
                          variants={skeletonVariants}
                          animate="shimmer"
                          style={{ 
                            backgroundImage: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
                            backgroundSize: "200% 100%"
                          }}
                        />
                      ))
                    ) : (
                      categories.map((category: Category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => toggleCategory(category.id)}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all duration-300"
                          />
                          <Label 
                            htmlFor={`category-${category.id}`}
                            className={`text-sm font-medium cursor-pointer transition-colors duration-300 ${
                              selectedCategories.includes(category.id) 
                                ? 'text-blue-400' 
                                : 'text-gray-300 hover:text-white'
                            }`}
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Date Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-3 ml-1">Date Range</h4>
                  <div className="space-y-2">
                    {Object.values(TimeFilter).map((filter) => (
                      <div key={filter} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`time-${filter}`}
                          checked={timeFilter === filter}
                          onCheckedChange={() => setTimeFilter(filter)}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all duration-300"
                        />
                        <Label 
                          htmlFor={`time-${filter}`}
                          className={`text-sm font-medium cursor-pointer transition-colors duration-300 ${
                            timeFilter === filter
                              ? 'text-blue-400' 
                              : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          {filter === TimeFilter.ALL ? 'All Time' : 
                           filter === TimeFilter.WEEK ? 'Past Week' :
                           filter === TimeFilter.MONTH ? 'Past Month' : 'Past Year'}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Sort Options */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-3 ml-1">Sort By</h4>
                  <div className="space-y-2">
                    <motion.div 
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors duration-300 ${
                        sortBy === SortOptions.LATEST 
                          ? 'bg-blue-900/40 text-blue-400' 
                          : 'hover:bg-gray-800 text-gray-300'
                      }`}
                      whileHover={{ x: 3 }}
                      onClick={() => setSortBy(SortOptions.LATEST)}
                    >
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Latest</span>
                    </motion.div>
                    
                    <motion.div 
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors duration-300 ${
                        sortBy === SortOptions.POPULAR 
                          ? 'bg-blue-900/40 text-blue-400' 
                          : 'hover:bg-gray-800 text-gray-300'
                      }`}
                      whileHover={{ x: 3 }}
                      onClick={() => setSortBy(SortOptions.POPULAR)}
                    >
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">Most Popular</span>
                    </motion.div>
                    
                    <motion.div 
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors duration-300 ${
                        sortBy === SortOptions.COMMENTS 
                          ? 'bg-blue-900/40 text-blue-400' 
                          : 'hover:bg-gray-800 text-gray-300'
                      }`}
                      whileHover={{ x: 3 }}
                      onClick={() => setSortBy(SortOptions.COMMENTS)}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Most Commented</span>
                    </motion.div>
                  </div>
                </div>
                
                {/* Tag Cloud */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-400 ml-1">Popular Tags</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-[200px]">
                          <p className="text-xs">Tags help you discover content on specific topics</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {isTagsLoading ? (
                      Array(8).fill(0).map((_, i) => (
                        <motion.div 
                          key={i}
                          className="h-7 w-16 bg-gray-800 rounded-full"
                          variants={skeletonVariants}
                          animate="shimmer"
                          style={{ 
                            backgroundImage: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
                            backgroundSize: "200% 100%"
                          }}
                        />
                      ))
                    ) : (
                      tags.slice(0, 12).map((tag: Tag) => (
                        <motion.div
                          key={tag.id}
                          whileHover={{ y: -3, scale: 1.05 }}
                          className="relative group"
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full opacity-30 blur group-hover:opacity-70 transition-opacity"></div>
                          <Badge 
                            className="relative px-3 py-1 border-0 bg-gray-900 hover:bg-gray-800 text-gray-300 group-hover:text-blue-300 cursor-pointer whitespace-nowrap"
                          >
                            <Hash className="w-3 h-3 mr-1 text-blue-400" />
                            {tag.name}
                          </Badge>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Clear filters button */}
                {(selectedCategories.length > 0 || timeFilter !== TimeFilter.ALL || sortBy !== SortOptions.LATEST) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                    onClick={() => {
                      setSelectedCategories([]);
                      setTimeFilter(TimeFilter.ALL);
                      setSortBy(SortOptions.LATEST);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </ScrollReveal>
          </div>
          
          {/* Mobile Filters Sidebar */}
          <AnimatePresence>
            {mobileSidebarOpen && (
              <motion.div 
                className="fixed inset-0 z-50 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                  onClick={() => setMobileSidebarOpen(false)}
                />
                
                <motion.div 
                  className="absolute right-0 top-0 bottom-0 w-3/4 max-w-xs bg-gray-900 border-l border-gray-800"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h3 className="text-lg font-bold">Filters</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-gray-800"
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-60px)]">
                    {/* Categories Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Categories</h4>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {categories.map((category: Category) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`mobile-category-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => toggleCategory(category.id)}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <Label 
                              htmlFor={`mobile-category-${category.id}`}
                              className={`text-sm ${
                                selectedCategories.includes(category.id) 
                                  ? 'text-blue-400' 
                                  : 'text-gray-300'
                              }`}
                            >
                              {category.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Date Filter */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Date Range</h4>
                      <div className="space-y-2">
                        {Object.values(TimeFilter).map((filter) => (
                          <div key={filter} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`mobile-time-${filter}`}
                              checked={timeFilter === filter}
                              onCheckedChange={() => setTimeFilter(filter)}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <Label 
                              htmlFor={`mobile-time-${filter}`}
                              className={`text-sm ${
                                timeFilter === filter
                                  ? 'text-blue-400' 
                                  : 'text-gray-300'
                              }`}
                            >
                              {filter === TimeFilter.ALL ? 'All Time' : 
                               filter === TimeFilter.WEEK ? 'Past Week' :
                               filter === TimeFilter.MONTH ? 'Past Month' : 'Past Year'}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Sort Options */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Sort By</h4>
                      <div className="space-y-1">
                        <div 
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                            sortBy === SortOptions.LATEST 
                              ? 'bg-blue-900/40 text-blue-400' 
                              : 'hover:bg-gray-800 text-gray-300'
                          }`}
                          onClick={() => setSortBy(SortOptions.LATEST)}
                        >
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Latest</span>
                        </div>
                        
                        <div 
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                            sortBy === SortOptions.POPULAR 
                              ? 'bg-blue-900/40 text-blue-400' 
                              : 'hover:bg-gray-800 text-gray-300'
                          }`}
                          onClick={() => setSortBy(SortOptions.POPULAR)}
                        >
                          <Star className="w-4 h-4" />
                          <span className="text-sm">Most Popular</span>
                        </div>
                        
                        <div 
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                            sortBy === SortOptions.COMMENTS 
                              ? 'bg-blue-900/40 text-blue-400' 
                              : 'hover:bg-gray-800 text-gray-300'
                          }`}
                          onClick={() => setSortBy(SortOptions.COMMENTS)}
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">Most Commented</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Apply filters button */}
                    <div className="pt-4 flex flex-col gap-2">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setMobileSidebarOpen(false)}
                      >
                        Apply Filters
                      </Button>
                      
                      {(selectedCategories.length > 0 || timeFilter !== TimeFilter.ALL || sortBy !== SortOptions.LATEST) && (
                        <Button
                          variant="ghost"
                          className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300"
                          onClick={() => {
                            setSelectedCategories([]);
                            setTimeFilter(TimeFilter.ALL);
                            setSortBy(SortOptions.LATEST);
                          }}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main Content - Blogs */}
          <div className="flex-1">
            {/* Applied filters */}
            {(selectedCategories.length > 0 || timeFilter !== TimeFilter.ALL) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex flex-wrap items-center gap-2"
              >
                <span className="text-sm text-gray-400">Active filters:</span>
                
                {selectedCategories.map((categoryId) => {
                  const category = categories.find(c => c.id === categoryId);
                  return category ? (
                    <Badge
                      key={category.id}
                      className="bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border-blue-800/70 px-3 py-1 rounded-full flex items-center gap-1 group"
                      onClick={() => toggleCategory(category.id)}
                    >
                      {category.name}
                      <X className="w-3 h-3 text-blue-400 group-hover:text-white" />
                    </Badge>
                  ) : null;
                })}
                
                {timeFilter !== TimeFilter.ALL && (
                  <Badge
                    className="bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border-blue-800/70 px-3 py-1 rounded-full flex items-center gap-1 group"
                    onClick={() => setTimeFilter(TimeFilter.ALL)}
                  >
                    <CalendarDays className="w-3 h-3 mr-1" />
                    {timeFilter === TimeFilter.WEEK ? 'Past Week' :
                     timeFilter === TimeFilter.MONTH ? 'Past Month' : 'Past Year'}
                    <X className="w-3 h-3 text-blue-400 group-hover:text-white" />
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-400 hover:text-white"
                  onClick={() => {
                    setSelectedCategories([]);
                    setTimeFilter(TimeFilter.ALL);
                  }}
                >
                  Clear all
                </Button>
              </motion.div>
            )}
            
            {/* Mobile sort selector */}
            <div className="lg:hidden mb-6">
              <div className="bg-gray-900/60 backdrop-blur-md rounded-xl p-3 border border-gray-800 flex justify-between items-center">
                <div className="flex items-center">
                  <ArrowDownUp className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-300">Sort:</span>
                </div>
                
                <div className="flex gap-2">
                  <Badge
                    className={`px-3 py-1 cursor-pointer ${
                      sortBy === SortOptions.LATEST 
                        ? 'bg-blue-900/60 text-blue-300 border-blue-800/70' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setSortBy(SortOptions.LATEST)}
                  >
                    Latest
                  </Badge>
                  
                  <Badge
                    className={`px-3 py-1 cursor-pointer ${
                      sortBy === SortOptions.POPULAR 
                        ? 'bg-blue-900/60 text-blue-300 border-blue-800/70' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setSortBy(SortOptions.POPULAR)}
                  >
                    Popular
                  </Badge>
                  
                  <Badge
                    className={`px-3 py-1 cursor-pointer ${
                      sortBy === SortOptions.COMMENTS 
                        ? 'bg-blue-900/60 text-blue-300 border-blue-800/70' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setSortBy(SortOptions.COMMENTS)}
                  >
                    Comments
                  </Badge>
                </div>
              </div>
            </div>

            {/* Blog List */}
            {isBlogsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, index) => (
                  <div key={index} className="bg-gray-900/60 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 shadow-lg shadow-blue-900/5">
                    <Skeleton className="w-full h-48 bg-gray-800/70" />
                    <div className="p-5">
                      <div className="flex items-center space-x-2 mb-3">
                        <Skeleton className="h-6 w-20 bg-gray-800/70" />
                        <Skeleton className="h-4 w-16 bg-gray-800/70" />
                      </div>
                      <Skeleton className="h-7 w-full mb-2 bg-gray-800/70" />
                      <Skeleton className="h-4 w-full mb-1 bg-gray-800/70" />
                      <Skeleton className="h-4 w-3/4 mb-4 bg-gray-800/70" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="w-8 h-8 rounded-full bg-gray-800/70" />
                          <Skeleton className="h-4 w-24 bg-gray-800/70" />
                        </div>
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-4 w-10 bg-gray-800/70" />
                          <Skeleton className="h-4 w-10 bg-gray-800/70" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedBlogs.map((blog: BlogWithAuthor, i: number) => (
                  <motion.div
                    key={blog.id}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                  >
                    <FuturisticBlogCard 
                      blog={blog} 
                      readingTime={calculateReadingTime(blog.content || blog.excerpt || '')}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-10 text-center border border-gray-800">
                <div className="flex justify-center mb-4">
                  <SearchX className="w-12 h-12 text-blue-500 opacity-70" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-white">No blogs found</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  We couldn't find any blogs matching your current filters. Try adjusting your search criteria or explore different categories.
                </p>
                <Button
                  variant="ghost"
                  className="mt-4 bg-blue-900/30 hover:bg-blue-800/40 text-blue-300 border border-blue-800/50"
                  onClick={() => {
                    setSelectedCategories([]);
                    setTimeFilter(TimeFilter.ALL);
                    setSearchQuery("");
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset all filters
                </Button>
              </div>
            )}
            
            {/* Pagination */}
            {sortedBlogs.length > 0 && (
              <div className="mt-10 flex justify-center">
                <motion.div 
                  className="p-4 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-10 w-10 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                      disabled
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost"
                      className="h-10 w-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                      1
                    </Button>
                    
                    <Button 
                      variant="ghost"
                      className="h-10 w-10 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      2
                    </Button>
                    
                    <Button 
                      variant="ghost"
                      className="h-10 w-10 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      3
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-10 w-10 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Additional Icons
function MessageCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}

function RotateCcw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v6h6" />
      <path d="M3 8a9 9 0 1 1 2.83 6.36" />
    </svg>
  )
}

function SearchX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m13.5 8.5-5 5" />
      <path d="m8.5 8.5 5 5" />
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
