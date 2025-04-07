import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { WebStory } from "@/shared/schema";
import { X, ChevronLeft, ChevronRight, ExternalLink, Calendar, User, Sparkles, Search, Filter, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WebStoryCard from "@/components/common/WebStoryCard";
import BackgroundGradient from "@/components/common/BackgroundGradient";
import FuturisticSearch from "@/components/common/FuturisticSearch";

interface StoryModalProps {
  stories: WebStory[];
  initialIndex: number;
  onClose: () => void;
}

function FeaturedStoryBanner({ story, onClick }: { story: WebStory, onClick: () => void }) {
  return (
    <motion.div 
      className="relative h-64 md:h-80 rounded-xl overflow-hidden cursor-pointer mb-12 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-blue-600/10 z-10 group-hover:bg-blue-600/20 transition-colors duration-300"></div>
      <motion.div 
        className="absolute inset-0 z-0"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.6 }}
      >
        <img 
          src={story.image} 
          alt={story.title} 
          className="w-full h-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
      
      <div className="absolute top-0 left-0 w-full p-6 z-20">
        <Badge className="bg-blue-600 text-white">Featured Story</Badge>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-6 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
            {story.title}
          </h2>
          
          <div className="flex items-center space-x-4 text-white/80">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(story.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            
            <div className="flex items-center text-sm">
              <User className="w-4 h-4 mr-1" />
              Author
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 right-0 p-6 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="group-hover:scale-110 transition-transform duration-300"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <ChevronRight className="w-6 h-6" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StoryModal({ stories, initialIndex, onClose }: StoryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  const currentStory = stories[currentIndex];
  
  // Progress timer with play/pause functionality
  useEffect(() => {
    if (isPaused) return;
    
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next story
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return 0;
          } else {
            if (timerRef.current) clearInterval(timerRef.current);
            onClose();
            return 100;
          }
        }
        return prev + 0.5; // Slower progression
      });
    }, 30);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, stories.length, onClose, isPaused]);
  
  const handlePrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };
  
  const handleNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center backdrop-blur-lg"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 z-50 text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </button>
      
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-40 flex p-3 space-x-1.5">
        {stories.map((_, index) => (
          <div 
            key={index} 
            className="h-1.5 bg-white/20 rounded-full flex-1 overflow-hidden"
          >
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ 
                width: index < currentIndex 
                  ? '100%' 
                  : index === currentIndex 
                    ? `${progress}%` 
                    : '0%',
                transition: index === currentIndex ? 'width 0.1s linear' : undefined
              }}
            ></div>
          </div>
        ))}
      </div>
      
      {/* Navigation buttons */}
      <button 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors text-white"
        onClick={(e) => {
          e.stopPropagation();
          handlePrevStory();
        }}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors text-white"
        onClick={(e) => {
          e.stopPropagation();
          handleNextStory();
        }}
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStory.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-md h-[80vh] mx-auto bg-white overflow-hidden rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <img 
            src={currentStory.image}
            alt={currentStory.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent"></div>
          
          {/* Content */}
          <motion.div 
            className="absolute bottom-0 left-0 p-6 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">{currentStory.title}</h2>
            
            <Button 
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to detailed view if available
              }}
            >
              <span>Read Full Story</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </motion.div>
          
          {/* Touch areas for navigation */}
          <div 
            className="absolute top-0 bottom-0 left-0 w-1/3 z-30" 
            onClick={(e) => {
              e.stopPropagation();
              handlePrevStory();
            }}
          ></div>
          <div 
            className="absolute top-0 bottom-0 right-0 w-1/3 z-30" 
            onClick={(e) => {
              e.stopPropagation();
              handleNextStory();
            }}
          ></div>
          <div 
            className="absolute top-0 bottom-0 left-1/3 right-1/3 z-30" 
            onClick={(e) => {
              e.stopPropagation();
              togglePause();
            }}
          ></div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// Story Card with 3D hover effect
function StoryCard({ story, index, onClick }: { story: WebStory; index: number; onClick: () => void }) {
  // Mouse position values for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth the values with springs
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 });
  
  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };
  
  // Reset on mouse leave
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      className="cursor-pointer aspect-[9/16] relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
    >
      <div className="w-full h-full relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 z-30 bg-transparent group-hover:bg-blue-600/10 transition-colors duration-300"></div>
        
        <motion.div 
          className="absolute inset-0 z-0 overflow-hidden rounded-xl border-4 border-transparent group-hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
        >
          <img 
            src={story.image}
            alt={story.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
        
        <div className="absolute top-0 right-0 p-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Badge className="bg-blue-600">Story</Badge>
        </div>
        
        <div className="absolute bottom-0 left-0 p-4 w-full z-20">
          <h3 className="text-white font-medium text-sm md:text-base group-hover:text-blue-300 transition-colors duration-300">
            {story.title}
          </h3>
          
          <div className="flex items-center mt-2 text-xs text-white/80">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(story.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
      
      {/* Border glow effect */}
      <div className="absolute inset-0 -z-10 bg-blue-500/0 group-hover:bg-blue-500/10 rounded-xl blur-md transition-all duration-300 scale-105 opacity-0 group-hover:opacity-100"></div>
    </motion.div>
  );
}

// Time filter options
enum TimeFilter {
  ALL = "all",
  RECENT = "recent",
  WEEK = "week",
  MONTH = "month",
}

// Story categories
const CATEGORIES = [
  "All",
  "Technology",
  "Design",
  "Culture",
  "Science",
  "Innovation",
  "Art",
  "Future"
];

export default function WebStories() {
  const [_, setLocation] = useLocation();
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [featuredStory, setFeaturedStory] = useState<WebStory | null>(null);
  const storiesContainerRef = useRef<HTMLDivElement>(null);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [timeFilter, setTimeFilter] = useState(TimeFilter.ALL);
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: webStories, isLoading } = useQuery({
    queryKey: ['/api/webstories'],
  });
  
  useEffect(() => {
    if (webStories && webStories.length > 0) {
      // Set the first story as featured
      setFeaturedStory(webStories[0]);
    }
  }, [webStories]);
  
  // Filter stories based on search, category, and time
  const filteredStories = React.useMemo(() => {
    if (!webStories || webStories.length === 0) return [];
    
    return webStories.filter((story: WebStory) => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        story.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory === "All" || 
        story.title.includes(selectedCategory); // This is a simplified approach; in a real app, stories would have category IDs
      
      // Time filter
      let matchesTime = true;
      const storyDate = new Date(story.createdAt);
      const now = new Date();
      
      if (timeFilter === TimeFilter.RECENT) {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(now.getDate() - 2);
        matchesTime = storyDate >= twoDaysAgo;
      } else if (timeFilter === TimeFilter.WEEK) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        matchesTime = storyDate >= oneWeekAgo;
      } else if (timeFilter === TimeFilter.MONTH) {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        matchesTime = storyDate >= oneMonthAgo;
      }
      
      return matchesSearch && matchesCategory && matchesTime;
    });
  }, [webStories, searchQuery, selectedCategory, timeFilter]);
  
  const openStory = (index: number) => {
    setSelectedStoryIndex(index);
  };
  
  const openStoryDetails = (slug: string) => {
    setLocation(`/webstories/${slug}`);
  };
  
  const closeStory = () => {
    setSelectedStoryIndex(null);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950/20 text-white py-20">
      {/* Background elements */}
      <BackgroundGradient variant="cyber" />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-3">
            <motion.div
              animate={{ 
                rotate: 360
              }}
              transition={{ 
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-8 -right-8 text-blue-400 opacity-70"
            >
              <Sparkles size={24} />
            </motion.div>
            
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-500">
                Futuristic Snaps
              </span>{" "}
              <span className="text-white">of Wisdom</span>
            </h1>
            
            <motion.div 
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400"
              initial={{ width: "0%", left: "50%" }}
              animate={{ width: "100%", left: "0%" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
          
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore interactive visual stories on emerging technologies, future design, and next-gen innovations.
            Immerse yourself in a curated collection of visual narratives from 2050.
          </p>
        </motion.div>
        
        {/* Featured Story */}
        {featuredStory && (
          <FeaturedStoryBanner 
            story={featuredStory} 
            onClick={() => openStory(0)} 
          />
        )}
        
        {/* Search and Filter Section */}
        <motion.div 
          className="mb-12 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <FuturisticSearch 
                placeholder="Search for stories..." 
                onSearch={handleSearch}
                withAI={true}
                className="w-full"
              />
            </div>
            
            {/* Filters */}
            <div className="flex space-x-2 items-center">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full h-11 bg-black/20 border-blue-500/20 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border border-blue-500/20 text-white">
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category} className="focus:bg-blue-900/30 focus:text-white">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={timeFilter}
                onValueChange={(value) => setTimeFilter(value as TimeFilter)}
              >
                <SelectTrigger className="w-full h-11 bg-black/20 border-blue-500/20 text-white">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border border-blue-500/20 text-white">
                  <SelectItem value={TimeFilter.ALL} className="focus:bg-blue-900/30 focus:text-white">All Time</SelectItem>
                  <SelectItem value={TimeFilter.RECENT} className="focus:bg-blue-900/30 focus:text-white">Recent</SelectItem>
                  <SelectItem value={TimeFilter.WEEK} className="focus:bg-blue-900/30 focus:text-white">This Week</SelectItem>
                  <SelectItem value={TimeFilter.MONTH} className="focus:bg-blue-900/30 focus:text-white">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Filter Tags */}
          <motion.div 
            className="mt-4 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Badge 
              variant={activeTab === "all" ? "default" : "outline"} 
              className={`${activeTab === "all" ? "bg-blue-600" : "border-blue-500/40 hover:border-blue-500"} cursor-pointer px-4 py-1.5 text-sm transition-all`}
              onClick={() => setActiveTab("all")}
            >
              All
            </Badge>
            <Badge 
              variant={activeTab === "featured" ? "default" : "outline"} 
              className={`${activeTab === "featured" ? "bg-blue-600" : "border-blue-500/40 hover:border-blue-500"} cursor-pointer px-4 py-1.5 text-sm transition-all`}
              onClick={() => setActiveTab("featured")}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Featured
            </Badge>
            <Badge 
              variant={activeTab === "recent" ? "default" : "outline"} 
              className={`${activeTab === "recent" ? "bg-blue-600" : "border-blue-500/40 hover:border-blue-500"} cursor-pointer px-4 py-1.5 text-sm transition-all`}
              onClick={() => {
                setActiveTab("recent");
                setTimeFilter(TimeFilter.RECENT);
              }}
            >
              Recent
            </Badge>
            <Badge 
              variant={activeTab === "technology" ? "default" : "outline"} 
              className={`${activeTab === "technology" ? "bg-blue-600" : "border-blue-500/40 hover:border-blue-500"} cursor-pointer px-4 py-1.5 text-sm transition-all`}
              onClick={() => {
                setActiveTab("technology");
                setSelectedCategory("Technology");
              }}
            >
              Technology
            </Badge>
            <Badge 
              variant={activeTab === "design" ? "default" : "outline"} 
              className={`${activeTab === "design" ? "bg-blue-600" : "border-blue-500/40 hover:border-blue-500"} cursor-pointer px-4 py-1.5 text-sm transition-all`}
              onClick={() => {
                setActiveTab("design");
                setSelectedCategory("Design");
              }}
            >
              Design
            </Badge>
          </motion.div>
        </motion.div>
        
        {/* Main Grid - with responsive layout */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center"
            >
              <h2 className="text-2xl font-bold text-white">Latest Stories</h2>
              <div className="ml-3 h-px w-12 bg-blue-500"></div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center space-x-3"
            >
              <div className="text-sm text-gray-400">
                {filteredStories.length} stories
              </div>
              <Button
                variant="outline"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-900/20"
              >
                View All
              </Button>
            </motion.div>
          </div>
          
          <div ref={storiesContainerRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {isLoading ? (
              Array(10).fill(0).map((_, index) => (
                <div key={index} className="aspect-[9/16] rounded-xl overflow-hidden">
                  <Skeleton className="w-full h-full bg-gray-800/50" />
                </div>
              ))
            ) : filteredStories && filteredStories.length > 0 ? (
              filteredStories.map((story: WebStory, index: number) => (
                <WebStoryCard
                  key={story.id}
                  story={story}
                  index={index}
                  onClick={() => openStoryDetails(story.slug)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-400 mb-4">No web stories available at the moment.</p>
                <Button variant="outline" className="border-blue-500/50 text-blue-400">
                  Check back later
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {selectedStoryIndex !== null && webStories && webStories.length > 0 && (
          <StoryModal 
            stories={webStories}
            initialIndex={selectedStoryIndex}
            onClose={closeStory}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
