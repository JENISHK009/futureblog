import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Login successful",
        description: "Welcome back to Bloggers Ground!",
      });
      
      setLocation("/");
    }, 1500);
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3,
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const floatingElements = [
    { id: 1, delay: 0, duration: 5, size: 'w-16 h-16', top: '10%', left: '10%' },
    { id: 2, delay: 1, duration: 7, size: 'w-20 h-20', top: '30%', left: '15%' },
    { id: 3, delay: 2, duration: 9, size: 'w-12 h-12', top: '60%', left: '5%' },
    { id: 4, delay: 1.5, duration: 8, size: 'w-24 h-24', top: '75%', left: '20%' },
  ];

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex overflow-hidden">
      {/* Left Hero Section */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#001233] to-[#001845] z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,123,255,0.1),transparent_70%)]"></div>
        </div>

        {/* Floating Elements */}
        {floatingElements.map((el) => (
          <motion.div
            key={el.id}
            className={`absolute ${el.size} rounded-full opacity-20 bg-gradient-to-r from-blue-400 to-blue-600 blur-xl`}
            style={{ top: el.top, left: el.left }}
            initial={{ y: 0 }}
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{ 
              duration: el.duration,
              repeat: Infinity,
              delay: el.delay,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 w-full h-full text-white">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Sparkles className="h-12 w-12 text-blue-400 mb-6" />
              <h1 className="text-5xl font-bold mb-4 font-heading">
                Welcome to the <span className="text-blue-400">Future</span> of Blogging
              </h1>
            </motion.div>
            <motion.p variants={itemVariants} className="text-lg text-blue-100/80 max-w-lg">
              Join Bloggers Ground, where ideas flourish in a futuristic digital environment designed for the creators of tomorrow.
            </motion.p>
            <motion.div variants={itemVariants} className="pt-4">
              <div className="flex space-x-6 items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z"/><path d="M12 13v8"/><path d="M12 3v3"/></svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Publish Your Stories</h3>
                  <p className="text-blue-100/60">Share your insights with our global community</p>
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="flex space-x-6 items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"/><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Personalize Your Experience</h3>
                  <p className="text-blue-100/60">Customize your profile and dashboard</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom abstract shape */}
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
        </div>
      </motion.div>

      {/* Right Form Section */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex items-center justify-center px-4 py-10"
      >
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-3xl shadow-2xl shadow-blue-900/5 overflow-hidden"
          >
            <div className="p-8 sm:p-10">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-heading font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Welcome Back</h1>
                <p className="text-zinc-400">Log in to your Bloggers Ground account</p>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Username</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input 
                              placeholder="Enter your username" 
                              {...field} 
                              autoComplete="username"
                              className="h-12 bg-zinc-800/50 border-zinc-700 focus:border-blue-500 focus-visible:ring-blue-500/30 focus-visible:ring-offset-zinc-900 transition-all duration-300 shadow-glow group-hover:shadow-blue-900/5"
                            />
                            <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-blue-500/20 shadow-[0_0_10px_rgba(0,123,255,0.2)]"></div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-blue-400" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Enter your password" 
                              {...field} 
                              autoComplete="current-password"
                              className="h-12 bg-zinc-800/50 border-zinc-700 focus:border-blue-500 focus-visible:ring-blue-500/30 focus-visible:ring-offset-zinc-900 transition-all duration-300 shadow-glow group-hover:shadow-blue-900/5"
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                              onClick={togglePasswordVisibility}
                              tabIndex={-1}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                            <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-blue-500/20 shadow-[0_0_10px_rgba(0,123,255,0.2)]"></div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-blue-400" />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                          </FormControl>
                          <FormLabel className="text-sm cursor-pointer text-zinc-300">Remember me</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg hover:shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin mr-2">
                          <i className="ri-loader-4-line"></i>
                        </span>
                        Logging in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Log in
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-8 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-900 px-2 text-zinc-500">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-12 bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
                  <i className="ri-google-fill mr-2 text-lg"></i> Google
                </Button>
                <Button variant="outline" className="h-12 bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
                  <i className="ri-facebook-fill mr-2 text-lg"></i> Facebook
                </Button>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-zinc-400">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
