// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  categories;
  blogs;
  webStories;
  comments;
  tags;
  blogTags;
  subscribers;
  readingHistories;
  userCurrentId;
  categoryCurrentId;
  blogCurrentId;
  webStoryCurrentId;
  commentCurrentId;
  tagCurrentId;
  subscriberCurrentId;
  readingHistoryCurrentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.categories = /* @__PURE__ */ new Map();
    this.blogs = /* @__PURE__ */ new Map();
    this.webStories = /* @__PURE__ */ new Map();
    this.comments = /* @__PURE__ */ new Map();
    this.tags = /* @__PURE__ */ new Map();
    this.blogTags = /* @__PURE__ */ new Map();
    this.subscribers = /* @__PURE__ */ new Map();
    this.readingHistories = /* @__PURE__ */ new Map();
    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.blogCurrentId = 1;
    this.webStoryCurrentId = 1;
    this.commentCurrentId = 1;
    this.tagCurrentId = 1;
    this.subscriberCurrentId = 1;
    this.readingHistoryCurrentId = 1;
    this.initializeSampleData();
  }
  initializeSampleData() {
    const user1 = this.createUser({
      username: "james_wilson",
      password: "password123",
      name: "James Wilson",
      email: "james@example.com",
      bio: "Frontend developer with a passion for UI/UX",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
    });
    const user2 = this.createUser({
      username: "emily_chen",
      password: "password123",
      name: "Emily Chen",
      email: "emily@example.com",
      bio: "UX designer and creative thinker",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
    });
    const user3 = this.createUser({
      username: "michael_roberts",
      password: "password123",
      name: "Michael Roberts",
      email: "michael@example.com",
      bio: "Tech enthusiast and productivity expert",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
    });
    const developmentCategory = this.createCategory({
      name: "Development",
      slug: "development",
      icon: "ri-code-line",
      blogCount: 486
    });
    const designCategory = this.createCategory({
      name: "Design",
      slug: "design",
      icon: "ri-palette-line",
      blogCount: 375
    });
    const businessCategory = this.createCategory({
      name: "Business",
      slug: "business",
      icon: "ri-line-chart-line",
      blogCount: 329
    });
    const photographyCategory = this.createCategory({
      name: "Photography",
      slug: "photography",
      icon: "ri-camera-line",
      blogCount: 217
    });
    const technologyCategory = this.createCategory({
      name: "Technology",
      slug: "technology",
      icon: "ri-rocket-line",
      blogCount: 541
    });
    const travelCategory = this.createCategory({
      name: "Travel",
      slug: "travel",
      icon: "ri-map-pin-line",
      blogCount: 298
    });
    const productivityCategory = this.createCategory({
      name: "Productivity",
      slug: "productivity",
      icon: "ri-todo-line",
      blogCount: 178
    });
    const blog1 = this.createBlog({
      title: "10 JavaScript Features You Might Not Know About",
      slug: "10-javascript-features-you-might-not-know-about",
      content: "Long content here...",
      excerpt: "Discover lesser-known JavaScript features that can make your code more elegant and efficient.",
      featuredImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=320&q=80",
      categoryId: developmentCategory.id,
      authorId: user1.id,
      readingTime: 4,
      likes: 284,
      comments: 56,
      published: true,
      isFeatured: false,
      isTrending: true
    });
    const blog2 = this.createBlog({
      title: "UX Design Trends to Watch in 2023",
      slug: "ux-design-trends-to-watch-in-2023",
      content: "Long content here...",
      excerpt: "Explore the latest UX design trends that are shaping digital experiences this year.",
      featuredImage: "https://images.unsplash.com/photo-1585079542156-2755d9c8a094?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=320&q=80",
      categoryId: designCategory.id,
      authorId: user2.id,
      readingTime: 6,
      likes: 412,
      comments: 89,
      published: true,
      isFeatured: false,
      isTrending: true
    });
    const blog3 = this.createBlog({
      title: "How to Stay Productive While Working Remotely",
      slug: "how-to-stay-productive-while-working-remotely",
      content: "Long content here...",
      excerpt: "Tips and strategies to maintain high productivity levels when working from home.",
      featuredImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=320&q=80",
      categoryId: productivityCategory.id,
      authorId: user3.id,
      readingTime: 8,
      likes: 378,
      comments: 42,
      published: true,
      isFeatured: false,
      isTrending: true
    });
    const blog4 = this.createBlog({
      title: "The Future of Web Development: What to Expect in 2024",
      slug: "the-future-of-web-development-what-to-expect-in-2024",
      content: "Long content here...",
      excerpt: "Exploring upcoming trends and technologies that will shape web development in the coming year.",
      featuredImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      categoryId: technologyCategory.id,
      authorId: user1.id,
      readingTime: 5,
      likes: 195,
      comments: 23,
      published: true,
      isFeatured: true,
      isTrending: false
    });
    this.createWebStory({
      title: "AI in 2023: What to Expect",
      slug: "ai-in-2023-what-to-expect",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=900&q=80",
      authorId: user1.id
    });
    this.createWebStory({
      title: "Remote Work Tips",
      slug: "remote-work-tips",
      image: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=900&q=80",
      authorId: user3.id
    });
    this.createWebStory({
      title: "Coding Shortcuts",
      slug: "coding-shortcuts",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=900&q=80",
      authorId: user2.id
    });
    this.createWebStory({
      title: "Design Trends 2023",
      slug: "design-trends-2023",
      image: "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=900&q=80",
      authorId: user2.id
    });
    this.createWebStory({
      title: "Travel Tech Essentials",
      slug: "travel-tech-essentials",
      image: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=900&q=80",
      authorId: user3.id
    });
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userCurrentId++;
    const now = /* @__PURE__ */ new Date();
    const user = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  // Category operations
  async getCategories() {
    return Array.from(this.categories.values());
  }
  async getCategoryBySlug(slug) {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }
  async createCategory(insertCategory) {
    const id = this.categoryCurrentId++;
    const category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  // Blog operations
  async getBlogs(limit) {
    const allBlogs = Array.from(this.blogs.values()).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    const blogsToReturn = limit ? allBlogs.slice(0, limit) : allBlogs;
    return blogsToReturn.map((blog) => {
      const author = this.users.get(blog.authorId);
      return { ...blog, author };
    });
  }
  async getBlogsByCategory(categoryId, limit) {
    const categoryBlogs = Array.from(this.blogs.values()).filter((blog) => blog.categoryId === categoryId).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    const blogsToReturn = limit ? categoryBlogs.slice(0, limit) : categoryBlogs;
    return blogsToReturn.map((blog) => {
      const author = this.users.get(blog.authorId);
      return { ...blog, author };
    });
  }
  async getFeaturedBlogs(limit) {
    const featuredBlogs = Array.from(this.blogs.values()).filter((blog) => blog.isFeatured).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    const blogsToReturn = limit ? featuredBlogs.slice(0, limit) : featuredBlogs;
    return blogsToReturn.map((blog) => {
      const author = this.users.get(blog.authorId);
      return { ...blog, author };
    });
  }
  async getTrendingBlogs(limit) {
    const trendingBlogs = Array.from(this.blogs.values()).filter((blog) => blog.isTrending).sort((a, b) => (b.likes || 0) - (a.likes || 0));
    const blogsToReturn = limit ? trendingBlogs.slice(0, limit) : trendingBlogs;
    return blogsToReturn.map((blog) => {
      const author = this.users.get(blog.authorId);
      return { ...blog, author };
    });
  }
  async getBlogBySlug(slug) {
    const blog = Array.from(this.blogs.values()).find(
      (blog2) => blog2.slug === slug
    );
    if (!blog) return void 0;
    const authorId = blog.authorId || 0;
    const author = this.users.get(authorId) || {
      id: 0,
      name: "Anonymous",
      username: "anonymous",
      email: "",
      password: "",
      avatar: null,
      bio: null,
      createdAt: /* @__PURE__ */ new Date()
    };
    const categoryId = blog.categoryId || 0;
    const category = this.categories.get(categoryId) || {
      id: 0,
      name: "Uncategorized",
      slug: "uncategorized",
      icon: "",
      blogCount: 0
    };
    return { ...blog, author, category };
  }
  async createBlog(insertBlog) {
    const id = this.blogCurrentId++;
    const now = /* @__PURE__ */ new Date();
    const blog = { ...insertBlog, id, createdAt: now };
    this.blogs.set(id, blog);
    if (blog.categoryId) {
      const category = this.categories.get(blog.categoryId);
      if (category) {
        this.categories.set(blog.categoryId, {
          ...category,
          blogCount: category.blogCount + 1
        });
      }
    }
    return blog;
  }
  // Web Story operations
  async getWebStories(limit) {
    const allStories = Array.from(this.webStories.values()).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    return limit ? allStories.slice(0, limit) : allStories;
  }
  async getWebStoryBySlug(slug) {
    return Array.from(this.webStories.values()).find(
      (story) => story.slug === slug
    );
  }
  async createWebStory(insertWebStory) {
    const id = this.webStoryCurrentId++;
    const now = /* @__PURE__ */ new Date();
    const webStory = { ...insertWebStory, id, createdAt: now };
    this.webStories.set(id, webStory);
    return webStory;
  }
  // Comment operations
  async getCommentsByBlogId(blogId) {
    return Array.from(this.comments.values()).filter((comment) => comment.blogId === blogId).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  async createComment(insertComment) {
    const id = this.commentCurrentId++;
    const now = /* @__PURE__ */ new Date();
    const comment = { ...insertComment, id, createdAt: now };
    this.comments.set(id, comment);
    const blog = this.blogs.get(comment.blogId);
    if (blog) {
      this.blogs.set(comment.blogId, {
        ...blog,
        comments: (blog.comments || 0) + 1
      });
    }
    return comment;
  }
  // Tag operations
  async getTags() {
    return Array.from(this.tags.values());
  }
  async createTag(insertTag) {
    const id = this.tagCurrentId++;
    const tag = { ...insertTag, id };
    this.tags.set(id, tag);
    return tag;
  }
  // Blog Tag operations
  async addTagToBlog(blogId, tagId) {
    const key = `${blogId}-${tagId}`;
    this.blogTags.set(key, { blogId, tagId });
  }
  async getTagsByBlogId(blogId) {
    const tagIds = Array.from(this.blogTags.values()).filter((bt) => bt.blogId === blogId).map((bt) => bt.tagId);
    return tagIds.map((id) => this.tags.get(id));
  }
  // Subscriber operations
  async getSubscriberByEmail(email) {
    return Array.from(this.subscribers.values()).find(
      (subscriber) => subscriber.email === email
    );
  }
  async createSubscriber(insertSubscriber) {
    const id = this.subscriberCurrentId++;
    const now = /* @__PURE__ */ new Date();
    const subscriber = {
      ...insertSubscriber,
      id,
      status: "active",
      createdAt: now
    };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
  // Reading History operations
  async addReadingHistory(insertReadingHistory) {
    const existingRecord = await this.getReadingHistoryByUserAndBlog(
      insertReadingHistory.userId,
      insertReadingHistory.blogId
    );
    if (existingRecord) {
      return this.updateReadingHistory(existingRecord.id, {
        lastReadAt: /* @__PURE__ */ new Date(),
        readCount: existingRecord.readCount + 1,
        readTimeSeconds: (existingRecord.readTimeSeconds || 0) + (insertReadingHistory.readTimeSeconds || 0)
      });
    }
    const id = this.readingHistoryCurrentId++;
    const now = /* @__PURE__ */ new Date();
    const readingHistory2 = {
      ...insertReadingHistory,
      id,
      createdAt: now,
      lastReadAt: now,
      readCount: 1,
      readTimeSeconds: insertReadingHistory.readTimeSeconds || 0
    };
    this.readingHistories.set(id, readingHistory2);
    return readingHistory2;
  }
  async updateReadingHistory(id, updates) {
    const existing = this.readingHistories.get(id);
    if (!existing) {
      throw new Error(`Reading history record with id ${id} not found`);
    }
    const updated = { ...existing, ...updates };
    this.readingHistories.set(id, updated);
    return updated;
  }
  async getReadingHistoryByUserAndBlog(userId, blogId) {
    return Array.from(this.readingHistories.values()).find(
      (history) => history.userId === userId && history.blogId === blogId
    );
  }
  async getReadingHistoryByUser(userId, limit) {
    const userHistory = Array.from(this.readingHistories.values()).filter((history) => history.userId === userId).sort((a, b) => (b.lastReadAt?.getTime() || 0) - (a.lastReadAt?.getTime() || 0));
    return limit ? userHistory.slice(0, limit) : userHistory;
  }
  // Recommendation operations
  async getRecommendedBlogs(userId, limit = 5) {
    const userHistory = await this.getReadingHistoryByUser(userId);
    if (!userHistory || userHistory.length === 0) {
      const trendingBlogs = await this.getTrendingBlogs(limit);
      return trendingBlogs.map((blog) => ({
        ...blog,
        recommendationScore: 0.8,
        matchReason: "Popular among readers"
      }));
    }
    const readCategories = /* @__PURE__ */ new Map();
    const readAuthors = /* @__PURE__ */ new Map();
    userHistory.forEach((history) => {
      const blog = this.blogs.get(history.blogId);
      if (blog) {
        if (blog.categoryId) {
          const categoryCount = readCategories.get(blog.categoryId) || 0;
          readCategories.set(blog.categoryId, categoryCount + 1);
        }
        if (blog.authorId) {
          const authorCount = readAuthors.get(blog.authorId) || 0;
          readAuthors.set(blog.authorId, authorCount + 1);
        }
      }
    });
    const topCategories = Array.from(readCategories.entries()).sort((a, b) => b[1] - a[1]).map((entry) => entry[0]);
    const topAuthors = Array.from(readAuthors.entries()).sort((a, b) => b[1] - a[1]).map((entry) => entry[0]);
    const readBlogIds = new Set(userHistory.map((h) => h.blogId));
    const unreadBlogs = Array.from(this.blogs.values()).filter((blog) => !readBlogIds.has(blog.id)).map((blog) => {
      let score = 0;
      let reason = "";
      if (blog.categoryId && topCategories.includes(blog.categoryId)) {
        const categoryIndex = topCategories.indexOf(blog.categoryId);
        const categoryBoost = 0.8 - categoryIndex * 0.1;
        score += categoryBoost;
        const category = this.categories.get(blog.categoryId);
        if (category) {
          reason = `Based on your interest in ${category.name}`;
        }
      }
      if (blog.authorId && topAuthors.includes(blog.authorId)) {
        const authorIndex = topAuthors.indexOf(blog.authorId);
        const authorBoost = 0.7 - authorIndex * 0.1;
        score += authorBoost;
        const author2 = this.users.get(blog.authorId);
        if (author2 && !reason) {
          reason = `More from ${author2.name}`;
        }
      }
      if (score === 0) {
        score = 0.3 + (blog.likes || 0) / 1e3;
        reason = "You might be interested in this";
      }
      score = Math.min(score, 1);
      const author = this.users.get(blog.authorId || 0);
      const blogWithAuthor = { ...blog, author };
      return {
        ...blogWithAuthor,
        recommendationScore: score,
        matchReason: reason
      };
    }).sort((a, b) => b.recommendationScore - a.recommendationScore);
    return unreadBlogs.slice(0, limit);
  }
  async getRelatedBlogs(blogId, limit = 4) {
    const blog = this.blogs.get(blogId);
    if (!blog) {
      return [];
    }
    const categoryBlogs = Array.from(this.blogs.values()).filter((b) => b.id !== blogId && b.categoryId === blog.categoryId).sort((a, b) => (b.likes || 0) - (a.likes || 0));
    let relatedBlogs = [...categoryBlogs];
    if (relatedBlogs.length < limit) {
      const trendingBlogs = Array.from(this.blogs.values()).filter((b) => b.id !== blogId && b.isTrending && !categoryBlogs.includes(b)).sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, limit - relatedBlogs.length);
      relatedBlogs = [...relatedBlogs, ...trendingBlogs];
    }
    return relatedBlogs.slice(0, limit).map((blog2) => {
      const author = this.users.get(blog2.authorId || 0);
      return { ...blog2, author };
    });
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  bio: text("bio"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  blogCount: integer("blog_count").default(0).notNull()
});
var blogs = pgTable("blogs", {
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
var webStories = pgTable("web_stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  image: text("image").notNull(),
  authorId: integer("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  blogId: integer("blog_id").references(() => blogs.id),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique()
});
var blogTags = pgTable("blog_tags", {
  blogId: integer("blog_id").references(() => blogs.id),
  tagId: integer("tag_id").references(() => tags.id)
}, (t) => ({
  pk: primaryKey({ columns: [t.blogId, t.tagId] })
}));
var subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  status: text("status").default("active").notNull(),
  // active, inactive, unsubscribed
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var readingHistory = pgTable("reading_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  blogId: integer("blog_id").references(() => blogs.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastReadAt: timestamp("last_read_at").defaultNow().notNull(),
  readCount: integer("read_count").default(1).notNull(),
  readTimeSeconds: integer("read_time_seconds").default(0).notNull(),
  // total reading time in seconds
  completedReading: boolean("completed_reading").default(false).notNull(),
  // Tracking additional engagement for better recommendations
  liked: boolean("liked").default(false).notNull(),
  bookmarked: boolean("bookmarked").default(false).notNull()
});
var insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
var insertCategorySchema = createInsertSchema(categories).omit({ id: true });
var insertBlogSchema = createInsertSchema(blogs).omit({ id: true, createdAt: true });
var insertWebStorySchema = createInsertSchema(webStories).omit({ id: true, createdAt: true });
var insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });
var insertTagSchema = createInsertSchema(tags).omit({ id: true });
var insertSubscriberSchema = createInsertSchema(subscribers).omit({ id: true, createdAt: true, status: true });
var insertReadingHistorySchema = createInsertSchema(readingHistory).omit({
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

// server/routes.ts
async function registerRoutes(app2) {
  const apiRouter = (route) => `/api${route}`;
  app2.post(apiRouter("/users"), async (req, res) => {
    try {
      const userInput = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userInput);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: `Invalid user data: ${error.message}` });
    }
  });
  app2.get(apiRouter("/users/:id"), async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  app2.get(apiRouter("/categories"), async (_req, res) => {
    const categories2 = await storage.getCategories();
    res.json(categories2);
  });
  app2.get(apiRouter("/categories/:slug"), async (req, res) => {
    const category = await storage.getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  });
  app2.post(apiRouter("/categories"), async (req, res) => {
    try {
      const categoryInput = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryInput);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: `Invalid category data: ${error.message}` });
    }
  });
  app2.get(apiRouter("/blogs"), async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
    const blogs2 = await storage.getBlogs(limit);
    res.json(blogs2);
  });
  app2.get(apiRouter("/blogs/featured"), async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
    const featuredBlogs = await storage.getFeaturedBlogs(limit);
    res.json(featuredBlogs);
  });
  app2.get(apiRouter("/blogs/trending"), async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
    const trendingBlogs = await storage.getTrendingBlogs(limit);
    res.json(trendingBlogs);
  });
  app2.get(apiRouter("/blogs/category/:categoryId"), async (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
    const blogs2 = await storage.getBlogsByCategory(categoryId, limit);
    res.json(blogs2);
  });
  app2.get(apiRouter("/blogs/:slug"), async (req, res) => {
    const blog = await storage.getBlogBySlug(req.params.slug);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  });
  app2.post(apiRouter("/blogs"), async (req, res) => {
    try {
      const blogInput = insertBlogSchema.parse(req.body);
      const blog = await storage.createBlog(blogInput);
      res.status(201).json(blog);
    } catch (error) {
      res.status(400).json({ message: `Invalid blog data: ${error.message}` });
    }
  });
  app2.get(apiRouter("/webstories"), async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
    const webStories2 = await storage.getWebStories(limit);
    res.json(webStories2);
  });
  app2.get(apiRouter("/webstories/:slug"), async (req, res) => {
    const webStory = await storage.getWebStoryBySlug(req.params.slug);
    if (!webStory) {
      return res.status(404).json({ message: "Web story not found" });
    }
    res.json(webStory);
  });
  app2.post(apiRouter("/webstories"), async (req, res) => {
    try {
      const webStoryInput = insertWebStorySchema.parse(req.body);
      const webStory = await storage.createWebStory(webStoryInput);
      res.status(201).json(webStory);
    } catch (error) {
      res.status(400).json({ message: `Invalid web story data: ${error.message}` });
    }
  });
  app2.get(apiRouter("/blogs/:blogId/comments"), async (req, res) => {
    const blogId = parseInt(req.params.blogId);
    if (isNaN(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }
    const comments2 = await storage.getCommentsByBlogId(blogId);
    res.json(comments2);
  });
  app2.post(apiRouter("/comments"), async (req, res) => {
    try {
      const commentInput = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentInput);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: `Invalid comment data: ${error.message}` });
    }
  });
  app2.get(apiRouter("/tags"), async (_req, res) => {
    const tags2 = await storage.getTags();
    res.json(tags2);
  });
  app2.post(apiRouter("/tags"), async (req, res) => {
    try {
      const tagInput = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(tagInput);
      res.status(201).json(tag);
    } catch (error) {
      res.status(400).json({ message: `Invalid tag data: ${error.message}` });
    }
  });
  app2.get(apiRouter("/blogs/:blogId/tags"), async (req, res) => {
    const blogId = parseInt(req.params.blogId);
    if (isNaN(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }
    const tags2 = await storage.getTagsByBlogId(blogId);
    res.json(tags2);
  });
  app2.post(apiRouter("/blogs/:blogId/tags/:tagId"), async (req, res) => {
    const blogId = parseInt(req.params.blogId);
    const tagId = parseInt(req.params.tagId);
    if (isNaN(blogId) || isNaN(tagId)) {
      return res.status(400).json({ message: "Invalid blog ID or tag ID" });
    }
    await storage.addTagToBlog(blogId, tagId);
    res.status(204).end();
  });
  app2.post(apiRouter("/newsletter/subscribe"), async (req, res) => {
    try {
      const subscriberInput = insertSubscriberSchema.parse(req.body);
      const existingSubscriber = await storage.getSubscriberByEmail(subscriberInput.email);
      if (existingSubscriber) {
        if (existingSubscriber.status === "unsubscribed") {
          return res.status(200).json({
            message: "You have been re-subscribed to our newsletter",
            success: true
          });
        }
        return res.status(200).json({
          message: "You are already subscribed to our newsletter",
          success: true
        });
      }
      const subscriber = await storage.createSubscriber(subscriberInput);
      res.status(201).json({
        message: "Successfully subscribed to newsletter",
        success: true,
        subscriber
      });
    } catch (error) {
      res.status(400).json({
        message: `Invalid subscriber data: ${error.message}`,
        success: false
      });
    }
  });
  app2.post(apiRouter("/reading-history"), async (req, res) => {
    try {
      const readingHistoryInput = insertReadingHistorySchema.parse(req.body);
      const readingHistory2 = await storage.addReadingHistory(readingHistoryInput);
      res.status(201).json(readingHistory2);
    } catch (error) {
      res.status(400).json({
        message: `Invalid reading history data: ${error.message}`,
        success: false
      });
    }
  });
  app2.get(apiRouter("/users/:userId/reading-history"), async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
    const readingHistory2 = await storage.getReadingHistoryByUser(userId, limit);
    res.json(readingHistory2);
  });
  app2.get(apiRouter("/users/:userId/recommendations"), async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    const recommendations = await storage.getRecommendedBlogs(userId, limit);
    res.json(recommendations);
  });
  app2.get(apiRouter("/blogs/:blogId/related"), async (req, res) => {
    const blogId = parseInt(req.params.blogId);
    if (isNaN(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }
    const limit = req.query.limit ? parseInt(req.query.limit) : 4;
    const relatedBlogs = await storage.getRelatedBlogs(blogId, limit);
    res.json(relatedBlogs);
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
