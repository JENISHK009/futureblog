import { Link } from "wouter";
import { Category } from "@shared/schema";
import { motion } from "framer-motion";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/blogs?category=${category.slug}`}>
      <motion.div
        whileHover={{ y: -4, backgroundColor: 'var(--primary-50)' }}
        transition={{ duration: 0.2 }}
        className="bg-slate-100 dark:bg-zinc-800 rounded-xl p-6 text-center cursor-pointer transition-colors duration-300"
      >
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className={`${category.icon} text-xl text-primary`}></i>
        </div>
        <h3 className="font-medium">{category.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{category.blogCount} blogs</p>
      </motion.div>
    </Link>
  );
}
