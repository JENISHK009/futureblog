import { Link } from "wouter";
import { BlogWithAuthor } from "@shared/schema";
import { motion } from "framer-motion";

interface BlogCardProps {
  blog: BlogWithAuthor;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg dark:shadow-zinc-800/10 dark:hover:shadow-zinc-800/20 transition-all duration-300"
    >
      <Link href={`/blogs/${blog.slug}`}>
        <div className="overflow-hidden">
          <img 
            src={blog.featuredImage} 
            alt={blog.title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-3">
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
            {blog.categoryId ? "Category" : "Development"}
          </span>
          <span className="text-muted-foreground text-xs">{blog.readingTime} min read</span>
        </div>
        
        <Link href={`/blogs/${blog.slug}`}>
          <h3 className="text-xl font-heading font-semibold mb-2 hover:text-primary transition-colors duration-300">
            {blog.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {blog.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {blog.author?.avatar ? (
              <img 
                src={blog.author.avatar} 
                alt={blog.author.name || 'Author'}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                {blog.author?.name?.charAt(0) || 'A'}
              </div>
            )}
            <span className="text-muted-foreground text-sm">{blog.author?.name || 'Anonymous'}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <span className="flex items-center">
              <i className="ri-heart-line mr-1"></i> {blog.likes || 0}
            </span>
            <span className="flex items-center">
              <i className="ri-message-2-line mr-1"></i> {blog.comments || 0}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
