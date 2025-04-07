import { useState, useEffect } from "react";
import { useLocation, useParams, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, ArrowLeft, ChevronLeft, ChevronRight, Heart, MessageSquare, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WebStory } from "@/shared/schema";
import BackgroundGradient from "@/components/common/BackgroundGradient";

export default function WebStoryDetail() {
  const { slug } = useParams();
  const [_, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);

  // Story slides - in a real app these would come from an API
  const slides = [
    { 
      id: 1,
      content: "Quantum computing breakthrough allows for instantaneous data transfer across galaxies. A major shift in interstellar communication begins.",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3"
    },
    { 
      id: 2,
      content: "Neural implants achieve full integration with human consciousness, enabling thought-to-text and dream recording.",
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3"
    },
    { 
      id: 3,
      content: "Atmospheric carbon capture technology reaches 100% efficiency, reversing climate change within a decade.",
      image: "https://images.unsplash.com/photo-1536697246787-1f7ae568d89a?ixlib=rb-4.0.3"
    },
    { 
      id: 4,
      content: "The first human colony on Mars celebrates its 10th anniversary with a sustainable population of 10,000.",
      image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3"
    },
  ];

  // Fetch web story data
  const { data: webStory, isLoading, error } = useQuery({
    queryKey: ['/api/webstories', slug],
    enabled: !!slug,
  });

  // Auto-advance timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;
    
    if (autoAdvance) {
      // Reset progress
      setProgress(0);
      
      // Progress timer - updates every 100ms for smooth progress bar
      progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + (100 / 70); // 7 seconds total (70 * 100ms)
        });
      }, 100);
      
      // Slide advance timer
      timer = setTimeout(() => {
        if (currentIndex < slides.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          // End of story, navigate back to stories list
          setLocation("/webstories");
        }
      }, 7000);
    }
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [currentIndex, autoAdvance, slides.length, setLocation]);

  // Handle navigation
  const goToNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      setLocation("/webstories");
    }
  };

  const goToPreviousSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  // Toggle pause/play
  const toggleAutoAdvance = () => {
    setAutoAdvance(!autoAdvance);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touchX = e.touches[0].clientX;
    const screenWidth = window.innerWidth;
    
    // Left third of screen goes back, right third goes forward
    if (touchX < screenWidth / 3) {
      goToPreviousSlide();
    } else if (touchX > (screenWidth * 2) / 3) {
      goToNextSlide();
    } else {
      // Middle third toggles autoplay
      toggleAutoAdvance();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="container mx-auto px-4 py-20">
          <Skeleton className="w-full h-[80vh] bg-gray-800/50" />
        </div>
      </div>
    );
  }

  if (error || !webStory) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-red-400 mb-4">Story Not Found</h1>
          <p className="text-gray-400 mb-8">
            The web story you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            onClick={() => setLocation("/webstories")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Stories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <BackgroundGradient className="fixed inset-0 z-[-1] opacity-50" variant="cyber" />
      
      {/* Header with progress bar */}
      <div className="fixed top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/70 to-transparent">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-white"
              onClick={() => setLocation("/webstories")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          
          <div className="flex space-x-2 mt-4">
            {slides.map((_, index) => (
              <div 
                key={index}
                className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden"
              >
                {index === currentIndex && (
                  <motion.div 
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                )}
                {index < currentIndex && (
                  <div className="h-full w-full bg-blue-500 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Story Content */}
      <div className="pt-24 pb-20 min-h-screen relative" onTouchStart={handleTouchStart}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 flex flex-col h-[80vh] items-center justify-center"
          >
            {/* Story image */}
            <div className="relative w-full max-w-lg mx-auto mb-8 rounded-xl overflow-hidden shadow-2xl shadow-blue-900/20">
              <img 
                src={slides[currentIndex]?.image} 
                alt={`Story slide ${currentIndex + 1}`}
                className="w-full aspect-square md:aspect-[3/4] object-cover"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
              
              {/* Author info */}
              <div className="absolute top-4 left-4 right-4 flex items-center">
                <div className="bg-black/40 backdrop-blur-sm p-2 rounded-full flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500/80 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="ml-2 text-sm font-medium">{webStory.title}</span>
                </div>
                <div className="ml-auto flex space-x-1">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Heart className="w-4 h-4 text-white" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </div>
              
              {/* Story content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white text-lg font-medium leading-relaxed">
                  {slides[currentIndex]?.content}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation buttons */}
        <div className="fixed inset-y-0 left-0 w-1/4 flex items-center justify-start pl-4">
          {currentIndex > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white"
              onClick={goToPreviousSlide}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          )}
        </div>
        
        <div className="fixed inset-y-0 right-0 w-1/4 flex items-center justify-end pr-4">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white"
            onClick={goToNextSlide}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}