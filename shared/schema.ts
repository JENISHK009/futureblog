import { pgTable, text, serial, integer, boolean, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  bio: text("bio"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  blogCount: integer("blog_count").default(0).notNull()
});

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  featuredImage: text("featured_image").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  authorId: integer("author_id").references(() => users.id),
  readingTime: integer("reading_time").notNull(),
  likes: integer("likes").default(0).notNull(),
  comments: integer("comments").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isTrending: boolean("is_trending").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const webStories = pgTable("web_stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  image: text("image").notNull(),
  authorId: integer("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  blogId: integer("blog_id").references(() => blogs.id),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique()
});

export const blogTags = pgTable("blog_tags", {
  blogId: integer("blog_id").references(() => blogs.id),
  tagId: integer("tag_id").references(() => tags.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.blogId, t.tagId] }),
}));

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  status: text("status").default("active").notNull(), // active, inactive, unsubscribed
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// User reading history to track blog reading activity for recommendations
export const readingHistory = pgTable("reading_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  blogId: integer("blog_id").references(() => blogs.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastReadAt: timestamp("last_read_at").defaultNow().notNull(),
  readCount: integer("read_count").default(1).notNull(),
  readTimeSeconds: integer("read_time_seconds").default(0).notNull(), // total reading time in seconds
  completedReading: boolean("completed_reading").default(false).notNull(),
  // Tracking additional engagement for better recommendations
  liked: boolean("liked").default(false).notNull(),
  bookmarked: boolean("bookmarked").default(false).notNull()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertBlogSchema = createInsertSchema(blogs).omit({ id: true, createdAt: true });
export const insertWebStorySchema = createInsertSchema(webStories).omit({ id: true, createdAt: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });
export const insertTagSchema = createInsertSchema(tags).omit({ id: true });
export const insertSubscriberSchema = createInsertSchema(subscribers).omit({ id: true, createdAt: true, status: true });
export const insertReadingHistorySchema = createInsertSchema(readingHistory).omit({ 
  id: true, 
  createdAt: true,
  lastReadAt: true
}).extend({
  readCount: z.number().optional().default(1),
  readTimeSeconds: z.number().optional().default(0),
  completedReading: z.boolean().optional().default(false),
  liked: z.boolean().optional().default(false),
  bookmarked: z.boolean().optional().default(false)
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type Blog = typeof blogs.$inferSelect;

export type InsertWebStory = z.infer<typeof insertWebStorySchema>;
export type WebStory = typeof webStories.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

export type InsertReadingHistory = z.infer<typeof insertReadingHistorySchema>;
export type ReadingHistory = typeof readingHistory.$inferSelect;

export type BlogWithAuthor = Blog & { author: User };
export type BlogWithDetails = Blog & { author: User; category: Category };

// Special type for recommended blogs with score
export type BlogRecommendation = BlogWithAuthor & { 
  recommendationScore: number; 
  matchReason: string;
};
