import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";

const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  name: z.string().optional(),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export default function Newsletter() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  async function onSubmit(data: NewsletterFormValues) {
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest(
        'POST',
        '/api/newsletter/subscribe',
        data
      );
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Subscription successful",
          description: result.message || "You have been subscribed to our newsletter.",
          variant: "default",
        });
      } else {
        toast({
          title: "Subscription failed",
          description: result.message || "There was a problem subscribing to the newsletter.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was a problem connecting to the server. Please try again later.",
        variant: "destructive",
      });
      console.error("Newsletter subscription error:", error);
    } finally {
      setIsSubmitting(false);
      form.reset();
    }
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1 relative">
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Your name (optional)"
                        {...field}
                        className="px-4 py-3 h-12 rounded-lg bg-gray-800/90 border border-gray-700 focus:border-blue-500 
                          focus:ring-2 focus:ring-blue-500/50 focus:outline-none text-white placeholder-gray-400"
                      />
                      {/* Subtle glow effect on focus */}
                      <div className="absolute inset-0 rounded-lg opacity-0 focus-within:opacity-100 pointer-events-none transition-opacity duration-300">
                        <div className="absolute -inset-0.5 bg-blue-500/20 rounded-lg blur opacity-75" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1 relative">
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Your email address"
                        {...field}
                        className="px-4 py-3 h-12 rounded-lg bg-gray-800/90 border border-gray-700 focus:border-blue-500 
                          focus:ring-2 focus:ring-blue-500/50 focus:outline-none text-white placeholder-gray-400"
                      />
                      {/* Subtle glow effect on focus */}
                      <div className="absolute inset-0 rounded-lg opacity-0 focus-within:opacity-100 pointer-events-none transition-opacity duration-300">
                        <div className="absolute -inset-0.5 bg-blue-500/20 rounded-lg blur opacity-75" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 h-12 rounded-lg transition-colors duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">{isSubmitting ? "Subscribing..." : "Subscribe"}</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:opacity-90 transition-opacity"></span>
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 opacity-50"></span>
          </Button>
          <div className="text-xs text-gray-400 mt-1 text-center">
            We respect your privacy. Unsubscribe at any time.
          </div>
        </form>
      </Form>
    </div>
  );
}
