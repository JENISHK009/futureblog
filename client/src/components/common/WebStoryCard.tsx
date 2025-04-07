import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { WebStory } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Play, User } from "lucide-react";

interface WebStoryCardProps {
  title: string;
  image: string;
  slug: string;
  authorId?: number | null;
  className?: string;
  onClick?: () => void;
  index?: number;
  progressPercent?: number;
}

export default function WebStoryCard({ 
  title,
  image,
  slug,
  authorId,
  className = "", 
  onClick,
  index = 0,
  progressPercent
}: WebStoryCardProps) {
  // Used for staggered animations
  const staggerDelay = index * 0.1;
  
  return (
    <Link href={`/webstories/${slug}`}>
      <motion.div
        className={`group relative rounded-xl overflow-hidden aspect-[9/16] ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.5,
            delay: staggerDelay
          }
        }}
        whileHover={{ 
          scale: 1.03, 
          transition: { 
            duration: 0.3 
          } 
        }}
        onClick={onClick}
      >
        {/* Story image */}
        <div className="absolute inset-0">
          <img 
            src={image} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        
        {/* Author badge */}
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md rounded-full p-1.5 px-3 flex items-center">
          <div className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-600 mr-2">
            <User size={12} className="text-white" />
          </div>
          <span className="text-xs font-medium text-white">Story</span>
        </div>
        
        {/* Story info */}
        <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col">
          <h3 className="font-bold text-white text-lg mb-1">{title}</h3>
          
          {/* Progress bar - only shown if progressPercent is provided */}
          {progressPercent !== undefined && (
            <div className="w-full h-1 bg-gray-700/50 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
        
        {/* Play button */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
        >
          <motion.div 
            className="h-16 w-16 rounded-full bg-blue-600/90 flex items-center justify-center shadow-lg shadow-blue-600/30"
            whileHover={{ 
              backgroundColor: "rgba(37, 99, 235, 0.9)",
              scale: 1.1,
              boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.5)"
            }}
          >
            <Play size={24} className="text-white ml-1" />
          </motion.div>
        </motion.div>
        
        {/* Glowing border effect on hover */}
        <motion.div 
          className="absolute inset-0 pointer-events-none rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{ 
            boxShadow: "inset 0 0 0 2px rgba(59, 130, 246, 0.5), 0 0 15px rgba(59, 130, 246, 0.3)" 
          }}
        />
      </motion.div>
    </Link>
  );
}