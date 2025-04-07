import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  blogs, type Blog, type InsertBlog, type BlogWithAuthor, type BlogWithDetails,
  webStories, type WebStory, type InsertWebStory,
  comments, type Comment, type InsertComment,
  tags, type Tag, type InsertTag,
  blogTags,
  subscribers, type Subscriber, type InsertSubscriber,
  readingHistory, type ReadingHistory, type InsertReadingHistory,
  type BlogRecommendation
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Blog operations
  getBlogs(limit?: number): Promise<BlogWithAuthor[]>;
  getBlogsByCategory(categoryId: number, limit?: number): Promise<BlogWithAuthor[]>;
  getFeaturedBlogs(limit?: number): Promise<BlogWithAuthor[]>;
  getTrendingBlogs(limit?: number): Promise<BlogWithAuthor[]>;
  getBlogBySlug(slug: string): Promise<BlogWithDetails | undefined>;
  createBlog(blog: InsertBlog): Promise<Blog>;
  
  // Web Story operations
  getWebStories(limit?: number): Promise<WebStory[]>;
  getWebStoryBySlug(slug: string): Promise<WebStory | undefined>;
  createWebStory(webStory: InsertWebStory): Promise<WebStory>;
  
  // Comment operations
  getCommentsByBlogId(blogId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Tag operations
  getTags(): Promise<Tag[]>;
  createTag(tag: InsertTag): Promise<Tag>;
  
  // Blog Tag operations
  addTagToBlog(blogId: number, tagId: number): Promise<void>;
  getTagsByBlogId(blogId: number): Promise<Tag[]>;
  
  // Subscriber operations
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  
  // Reading History operations
  addReadingHistory(readingHistory: InsertReadingHistory): Promise<ReadingHistory>;
  updateReadingHistory(id: number, updates: Partial<ReadingHistory>): Promise<ReadingHistory>;
  getReadingHistoryByUserAndBlog(userId: number, blogId: number): Promise<ReadingHistory | undefined>;
  getReadingHistoryByUser(userId: number, limit?: number): Promise<ReadingHistory[]>;
  
  // Recommendation operations
  getRecommendedBlogs(userId: number, limit?: number): Promise<BlogRecommendation[]>;
  getRelatedBlogs(blogId: number, limit?: number): Promise<BlogWithAuthor[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private blogs: Map<number, Blog>;
  private webStories: Map<number, WebStory>;
  private comments: Map<number, Comment>;
  private tags: Map<number, Tag>;
  private blogTags: Map<string, { blogId: number; tagId: number }>;
  private subscribers: Map<number, Subscriber>;
  private readingHistories: Map<number, ReadingHistory>;
  
  private userCurrentId: number;
  private categoryCurrentId: number;
  private blogCurrentId: number;
  private webStoryCurrentId: number;
  private commentCurrentId: number;
  private tagCurrentId: number;
  private subscriberCurrentId: number;
  private readingHistoryCurrentId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.blogs = new Map();
    this.webStories = new Map();
    this.comments = new Map();
    this.tags = new Map();
    this.blogTags = new Map();
    this.subscribers = new Map();
    this.readingHistories = new Map();
    
    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.blogCurrentId = 1;
    this.webStoryCurrentId = 1;
    this.commentCurrentId = 1;
    this.tagCurrentId = 1;
    this.subscriberCurrentId = 1;
    this.readingHistoryCurrentId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create users
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
    
    // Create categories
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
    
    // Create blogs
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
    
    // Create Web Stories
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
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Blog operations
  async getBlogs(limit?: number): Promise<BlogWithAuthor[]> {
    const allBlogs = Array.from(this.blogs.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    
    const blogsToReturn = limit ? allBlogs.slice(0, limit) : allBlogs;
    
    return blogsToReturn.map(blog => {
      const author = this.users.get(blog.authorId)!;
      return { ...blog, author };
    });
  }

  async getBlogsByCategory(categoryId: number, limit?: number): Promise<BlogWithAuthor[]> {
    const categoryBlogs = Array.from(this.blogs.values())
      .filter(blog => blog.categoryId === categoryId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    
    const blogsToReturn = limit ? categoryBlogs.slice(0, limit) : categoryBlogs;
    
    return blogsToReturn.map(blog => {
      const author = this.users.get(blog.authorId)!;
      return { ...blog, author };
    });
  }

  async getFeaturedBlogs(limit?: number): Promise<BlogWithAuthor[]> {
    const featuredBlogs = Array.from(this.blogs.values())
      .filter(blog => blog.isFeatured)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    
    const blogsToReturn = limit ? featuredBlogs.slice(0, limit) : featuredBlogs;
    
    return blogsToReturn.map(blog => {
      const author = this.users.get(blog.authorId)!;
      return { ...blog, author };
    });
  }

  async getTrendingBlogs(limit?: number): Promise<BlogWithAuthor[]> {
    const trendingBlogs = Array.from(this.blogs.values())
      .filter(blog => blog.isTrending)
      .sort((a, b) => (b.likes || 0) - (a.likes || 0));
    
    const blogsToReturn = limit ? trendingBlogs.slice(0, limit) : trendingBlogs;
    
    return blogsToReturn.map(blog => {
      const author = this.users.get(blog.authorId)!;
      return { ...blog, author };
    });
  }

  async getBlogBySlug(slug: string): Promise<BlogWithDetails | undefined> {
    const blog = Array.from(this.blogs.values()).find(
      (blog) => blog.slug === slug,
    );
    
    if (!blog) return undefined;
    
    // Make sure author exists and handle the case when it doesn't
    const authorId = blog.authorId || 0;
    const author = this.users.get(authorId) || {
      id: 0,
      name: 'Anonymous',
      username: 'anonymous',
      email: '',
      password: '',
      avatar: null,
      bio: null,
      createdAt: new Date()
    };
    
    // Make sure category exists and handle the case when it doesn't
    const categoryId = blog.categoryId || 0;
    const category = this.categories.get(categoryId) || {
      id: 0,
      name: 'Uncategorized',
      slug: 'uncategorized',
      icon: '',
      blogCount: 0
    };
    
    return { ...blog, author, category };
  }

  async createBlog(insertBlog: InsertBlog): Promise<Blog> {
    const id = this.blogCurrentId++;
    const now = new Date();
    const blog: Blog = { ...insertBlog, id, createdAt: now };
    this.blogs.set(id, blog);
    
    // Update category blog count
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
  async getWebStories(limit?: number): Promise<WebStory[]> {
    const allStories = Array.from(this.webStories.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    
    return limit ? allStories.slice(0, limit) : allStories;
  }

  async getWebStoryBySlug(slug: string): Promise<WebStory | undefined> {
    return Array.from(this.webStories.values()).find(
      (story) => story.slug === slug,
    );
  }

  async createWebStory(insertWebStory: InsertWebStory): Promise<WebStory> {
    const id = this.webStoryCurrentId++;
    const now = new Date();
    const webStory: WebStory = { ...insertWebStory, id, createdAt: now };
    this.webStories.set(id, webStory);
    return webStory;
  }

  // Comment operations
  async getCommentsByBlogId(blogId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.blogId === blogId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentCurrentId++;
    const now = new Date();
    const comment: Comment = { ...insertComment, id, createdAt: now };
    this.comments.set(id, comment);
    
    // Update blog comment count
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
  async getTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }

  async createTag(insertTag: InsertTag): Promise<Tag> {
    const id = this.tagCurrentId++;
    const tag: Tag = { ...insertTag, id };
    this.tags.set(id, tag);
    return tag;
  }

  // Blog Tag operations
  async addTagToBlog(blogId: number, tagId: number): Promise<void> {
    const key = `${blogId}-${tagId}`;
    this.blogTags.set(key, { blogId, tagId });
  }

  async getTagsByBlogId(blogId: number): Promise<Tag[]> {
    const tagIds = Array.from(this.blogTags.values())
      .filter(bt => bt.blogId === blogId)
      .map(bt => bt.tagId);
    
    return tagIds.map(id => this.tags.get(id)!);
  }
  
  // Subscriber operations
  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    return Array.from(this.subscribers.values()).find(
      (subscriber) => subscriber.email === email
    );
  }
  
  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.subscriberCurrentId++;
    const now = new Date();
    const subscriber: Subscriber = { 
      ...insertSubscriber, 
      id, 
      status: "active", 
      createdAt: now 
    };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }

  // Reading History operations
  async addReadingHistory(insertReadingHistory: InsertReadingHistory): Promise<ReadingHistory> {
    // Check if a record already exists for this user and blog
    const existingRecord = await this.getReadingHistoryByUserAndBlog(
      insertReadingHistory.userId,
      insertReadingHistory.blogId
    );
    
    if (existingRecord) {
      // Update existing record
      return this.updateReadingHistory(existingRecord.id, {
        lastReadAt: new Date(),
        readCount: existingRecord.readCount + 1,
        readTimeSeconds: (existingRecord.readTimeSeconds || 0) + (insertReadingHistory.readTimeSeconds || 0)
      });
    }
    
    // Create new record
    const id = this.readingHistoryCurrentId++;
    const now = new Date();
    const readingHistory: ReadingHistory = {
      ...insertReadingHistory,
      id,
      createdAt: now,
      lastReadAt: now,
      readCount: 1,
      readTimeSeconds: insertReadingHistory.readTimeSeconds || 0
    };
    
    this.readingHistories.set(id, readingHistory);
    return readingHistory;
  }
  
  async updateReadingHistory(id: number, updates: Partial<ReadingHistory>): Promise<ReadingHistory> {
    const existing = this.readingHistories.get(id);
    
    if (!existing) {
      throw new Error(`Reading history record with id ${id} not found`);
    }
    
    const updated: ReadingHistory = { ...existing, ...updates };
    this.readingHistories.set(id, updated);
    return updated;
  }
  
  async getReadingHistoryByUserAndBlog(userId: number, blogId: number): Promise<ReadingHistory | undefined> {
    return Array.from(this.readingHistories.values()).find(
      (history) => history.userId === userId && history.blogId === blogId
    );
  }
  
  async getReadingHistoryByUser(userId: number, limit?: number): Promise<ReadingHistory[]> {
    const userHistory = Array.from(this.readingHistories.values())
      .filter(history => history.userId === userId)
      .sort((a, b) => (b.lastReadAt?.getTime() || 0) - (a.lastReadAt?.getTime() || 0));
    
    return limit ? userHistory.slice(0, limit) : userHistory;
  }
  
  // Recommendation operations
  async getRecommendedBlogs(userId: number, limit = 5): Promise<BlogRecommendation[]> {
    // Get user's reading history
    const userHistory = await this.getReadingHistoryByUser(userId);
    
    // If user has no history, return trending blogs as recommendations
    if (!userHistory || userHistory.length === 0) {
      const trendingBlogs = await this.getTrendingBlogs(limit);
      return trendingBlogs.map(blog => ({
        ...blog,
        recommendationScore: 0.8,
        matchReason: "Popular among readers"
      }));
    }
    
    // Extract user's preferences from reading history
    const readCategories = new Map<number, number>();
    const readAuthors = new Map<number, number>();
    
    userHistory.forEach(history => {
      const blog = this.blogs.get(history.blogId);
      if (blog) {
        // Count category reads
        if (blog.categoryId) {
          const categoryCount = readCategories.get(blog.categoryId) || 0;
          readCategories.set(blog.categoryId, categoryCount + 1);
        }
        
        // Count author reads
        if (blog.authorId) {
          const authorCount = readAuthors.get(blog.authorId) || 0;
          readAuthors.set(blog.authorId, authorCount + 1);
        }
      }
    });
    
    // Convert to arrays and sort by count to get top preferences
    const topCategories = Array.from(readCategories.entries())
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    const topAuthors = Array.from(readAuthors.entries())
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    // Collect all blog IDs user has already read
    const readBlogIds = new Set(userHistory.map(h => h.blogId));
    
    // Get blogs user hasn't read yet
    const unreadBlogs = Array.from(this.blogs.values())
      .filter(blog => !readBlogIds.has(blog.id))
      .map(blog => {
        // Calculate recommendation score based on category and author match
        let score = 0;
        let reason = "";
        
        // Category match
        if (blog.categoryId && topCategories.includes(blog.categoryId)) {
          const categoryIndex = topCategories.indexOf(blog.categoryId);
          const categoryBoost = 0.8 - (categoryIndex * 0.1); // Higher boost for top categories
          score += categoryBoost;
          
          const category = this.categories.get(blog.categoryId);
          if (category) {
            reason = `Based on your interest in ${category.name}`;
          }
        }
        
        // Author match
        if (blog.authorId && topAuthors.includes(blog.authorId)) {
          const authorIndex = topAuthors.indexOf(blog.authorId);
          const authorBoost = 0.7 - (authorIndex * 0.1); // Higher boost for favorite authors
          score += authorBoost;
          
          const author = this.users.get(blog.authorId);
          if (author && !reason) {
            reason = `More from ${author.name}`;
          }
        }
        
        // If no specific match, base score on popularity
        if (score === 0) {
          score = 0.3 + (blog.likes || 0) / 1000;
          reason = "You might be interested in this";
        }
        
        // Cap score at 1.0
        score = Math.min(score, 1.0);
        
        // Get blog with author
        const author = this.users.get(blog.authorId || 0)!;
        const blogWithAuthor: BlogWithAuthor = { ...blog, author };
        
        return {
          ...blogWithAuthor,
          recommendationScore: score,
          matchReason: reason
        };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore);
    
    return unreadBlogs.slice(0, limit);
  }
  
  async getRelatedBlogs(blogId: number, limit = 4): Promise<BlogWithAuthor[]> {
    const blog = this.blogs.get(blogId);
    
    if (!blog) {
      return [];
    }
    
    // Get blogs in the same category, excluding the current blog
    const categoryBlogs = Array.from(this.blogs.values())
      .filter(b => b.id !== blogId && b.categoryId === blog.categoryId)
      .sort((a, b) => (b.likes || 0) - (a.likes || 0));
    
    // If not enough blogs in the same category, add trending blogs
    let relatedBlogs = [...categoryBlogs];
    
    if (relatedBlogs.length < limit) {
      const trendingBlogs = Array.from(this.blogs.values())
        .filter(b => b.id !== blogId && b.isTrending && !categoryBlogs.includes(b))
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, limit - relatedBlogs.length);
      
      relatedBlogs = [...relatedBlogs, ...trendingBlogs];
    }
    
    // Map to BlogWithAuthor
    return relatedBlogs.slice(0, limit).map(blog => {
      const author = this.users.get(blog.authorId || 0)!;
      return { ...blog, author };
    });
  }
}

export const storage = new MemStorage();
