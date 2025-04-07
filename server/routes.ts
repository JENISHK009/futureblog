import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBlogSchema, 
  insertCategorySchema, 
  insertCommentSchema, 
  insertTagSchema, 
  insertUserSchema, 
  insertWebStorySchema,
  insertSubscriberSchema,
  insertReadingHistorySchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = (route: string) => `/api${route}`;
  
  // User routes
  app.post(apiRouter('/users'), async (req: Request, res: Response) => {
    try {
      const userInput = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userInput);
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: `Invalid user data: ${(error as Error).message}` });
    }
  });
  
  app.get(apiRouter('/users/:id'), async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't return password in response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  // Category routes
  app.get(apiRouter('/categories'), async (_req: Request, res: Response) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });
  
  app.get(apiRouter('/categories/:slug'), async (req: Request, res: Response) => {
    const category = await storage.getCategoryBySlug(req.params.slug);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  });
  
  app.post(apiRouter('/categories'), async (req: Request, res: Response) => {
    try {
      const categoryInput = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryInput);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: `Invalid category data: ${(error as Error).message}` });
    }
  });
  
  // Blog routes
  app.get(apiRouter('/blogs'), async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const blogs = await storage.getBlogs(limit);
    res.json(blogs);
  });
  
  app.get(apiRouter('/blogs/featured'), async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const featuredBlogs = await storage.getFeaturedBlogs(limit);
    res.json(featuredBlogs);
  });
  
  app.get(apiRouter('/blogs/trending'), async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const trendingBlogs = await storage.getTrendingBlogs(limit);
    res.json(trendingBlogs);
  });
  
  app.get(apiRouter('/blogs/category/:categoryId'), async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params.categoryId);
    
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const blogs = await storage.getBlogsByCategory(categoryId, limit);
    res.json(blogs);
  });
  
  app.get(apiRouter('/blogs/:slug'), async (req: Request, res: Response) => {
    const blog = await storage.getBlogBySlug(req.params.slug);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  });
  
  app.post(apiRouter('/blogs'), async (req: Request, res: Response) => {
    try {
      const blogInput = insertBlogSchema.parse(req.body);
      const blog = await storage.createBlog(blogInput);
      res.status(201).json(blog);
    } catch (error) {
      res.status(400).json({ message: `Invalid blog data: ${(error as Error).message}` });
    }
  });
  
  // Web Stories routes
  app.get(apiRouter('/webstories'), async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const webStories = await storage.getWebStories(limit);
    res.json(webStories);
  });
  
  app.get(apiRouter('/webstories/:slug'), async (req: Request, res: Response) => {
    const webStory = await storage.getWebStoryBySlug(req.params.slug);
    
    if (!webStory) {
      return res.status(404).json({ message: 'Web story not found' });
    }
    
    res.json(webStory);
  });
  
  app.post(apiRouter('/webstories'), async (req: Request, res: Response) => {
    try {
      const webStoryInput = insertWebStorySchema.parse(req.body);
      const webStory = await storage.createWebStory(webStoryInput);
      res.status(201).json(webStory);
    } catch (error) {
      res.status(400).json({ message: `Invalid web story data: ${(error as Error).message}` });
    }
  });
  
  // Comment routes
  app.get(apiRouter('/blogs/:blogId/comments'), async (req: Request, res: Response) => {
    const blogId = parseInt(req.params.blogId);
    
    if (isNaN(blogId)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }
    
    const comments = await storage.getCommentsByBlogId(blogId);
    res.json(comments);
  });
  
  app.post(apiRouter('/comments'), async (req: Request, res: Response) => {
    try {
      const commentInput = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentInput);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: `Invalid comment data: ${(error as Error).message}` });
    }
  });
  
  // Tag routes
  app.get(apiRouter('/tags'), async (_req: Request, res: Response) => {
    const tags = await storage.getTags();
    res.json(tags);
  });
  
  app.post(apiRouter('/tags'), async (req: Request, res: Response) => {
    try {
      const tagInput = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(tagInput);
      res.status(201).json(tag);
    } catch (error) {
      res.status(400).json({ message: `Invalid tag data: ${(error as Error).message}` });
    }
  });
  
  app.get(apiRouter('/blogs/:blogId/tags'), async (req: Request, res: Response) => {
    const blogId = parseInt(req.params.blogId);
    
    if (isNaN(blogId)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }
    
    const tags = await storage.getTagsByBlogId(blogId);
    res.json(tags);
  });
  
  app.post(apiRouter('/blogs/:blogId/tags/:tagId'), async (req: Request, res: Response) => {
    const blogId = parseInt(req.params.blogId);
    const tagId = parseInt(req.params.tagId);
    
    if (isNaN(blogId) || isNaN(tagId)) {
      return res.status(400).json({ message: 'Invalid blog ID or tag ID' });
    }
    
    await storage.addTagToBlog(blogId, tagId);
    res.status(204).end();
  });
  
  // Newsletter subscription route
  app.post(apiRouter('/newsletter/subscribe'), async (req: Request, res: Response) => {
    try {
      const subscriberInput = insertSubscriberSchema.parse(req.body);
      
      // Check if email already exists
      const existingSubscriber = await storage.getSubscriberByEmail(subscriberInput.email);
      if (existingSubscriber) {
        if (existingSubscriber.status === 'unsubscribed') {
          // Re-subscribe if previously unsubscribed
          // For a full implementation, this would update the subscriber status, but
          // we'll just return success for now since our MemStorage doesn't support updates
          return res.status(200).json({ 
            message: 'You have been re-subscribed to our newsletter',
            success: true 
          });
        }
        return res.status(200).json({ 
          message: 'You are already subscribed to our newsletter',
          success: true 
        });
      }
      
      // Create new subscriber
      const subscriber = await storage.createSubscriber(subscriberInput);
      
      res.status(201).json({
        message: 'Successfully subscribed to newsletter',
        success: true,
        subscriber
      });
    } catch (error) {
      res.status(400).json({ 
        message: `Invalid subscriber data: ${(error as Error).message}`,
        success: false 
      });
    }
  });

  // Reading History routes
  app.post(apiRouter('/reading-history'), async (req: Request, res: Response) => {
    try {
      const readingHistoryInput = insertReadingHistorySchema.parse(req.body);
      const readingHistory = await storage.addReadingHistory(readingHistoryInput);
      res.status(201).json(readingHistory);
    } catch (error) {
      res.status(400).json({ 
        message: `Invalid reading history data: ${(error as Error).message}`,
        success: false 
      });
    }
  });

  app.get(apiRouter('/users/:userId/reading-history'), async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const readingHistory = await storage.getReadingHistoryByUser(userId, limit);
    res.json(readingHistory);
  });
  
  // Recommendation routes
  app.get(apiRouter('/users/:userId/recommendations'), async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const recommendations = await storage.getRecommendedBlogs(userId, limit);
    res.json(recommendations);
  });
  
  app.get(apiRouter('/blogs/:blogId/related'), async (req: Request, res: Response) => {
    const blogId = parseInt(req.params.blogId);
    
    if (isNaN(blogId)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }
    
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
    const relatedBlogs = await storage.getRelatedBlogs(blogId, limit);
    res.json(relatedBlogs);
  });

  const httpServer = createServer(app);
  return httpServer;
}
