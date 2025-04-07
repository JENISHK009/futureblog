import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle2, Sparkles, ArrowRight, Zap, Shield, LockKeyhole } from "lucide-react";
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

const signupSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  function onSubmit(data: SignupFormValues) {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Account created successfully",
        description: "Welcome to Bloggers Ground!",
      });
      
      setLocation("/");
    }, 1500);
  }

  // Password validation feedback
  const password = form.watch("password");
  const passwordStrength = {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
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
    { id: 1, delay: 0, duration: 6, size: 'w-16 h-16', top: '15%', right: '10%' },
    { id: 2, delay: 1, duration: 8, size: 'w-20 h-20', top: '35%', right: '15%' },
    { id: 3, delay: 2, duration: 7, size: 'w-14 h-14', top: '60%', right: '5%' },
    { id: 4, delay: 0.5, duration: 9, size: 'w-24 h-24', top: '80%', right: '20%' },
  ];

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex overflow-hidden">
      {/* Left Form Section */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex items-center justify-center px-4 py-10"
      >
        <div className="max-w-lg w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-3xl shadow-2xl shadow-blue-900/5 overflow-hidden"
          >
            <div className="p-8 sm:p-10">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-heading font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Create an Account</h1>
                <p className="text-zinc-400">Join Bloggers Ground and start sharing your ideas</p>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">Full Name</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input 
                                placeholder="John Doe" 
                                {...field} 
                                autoComplete="name"
                                className="h-11 bg-zinc-800/50 border-zinc-700 focus:border-blue-500 focus-visible:ring-blue-500/30 focus-visible:ring-offset-zinc-900 transition-all duration-300 shadow-glow group-hover:shadow-blue-900/5"
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
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">Username</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Input 
                                placeholder="johndoe" 
                                {...field} 
                                autoComplete="username"
                                className="h-11 bg-zinc-800/50 border-zinc-700 focus:border-blue-500 focus-visible:ring-blue-500/30 focus-visible:ring-offset-zinc-900 transition-all duration-300 shadow-glow group-hover:shadow-blue-900/5"
                              />
                              <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-blue-500/20 shadow-[0_0_10px_rgba(0,123,255,0.2)]"></div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-blue-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input 
                              type="email"
                              placeholder="john@example.com" 
                              {...field} 
                              autoComplete="email"
                              className="h-11 bg-zinc-800/50 border-zinc-700 focus:border-blue-500 focus-visible:ring-blue-500/30 focus-visible:ring-offset-zinc-900 transition-all duration-300 shadow-glow group-hover:shadow-blue-900/5"
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
                              placeholder="Create a password" 
                              {...field} 
                              autoComplete="new-password"
                              className="h-11 bg-zinc-800/50 border-zinc-700 focus:border-blue-500 focus-visible:ring-blue-500/30 focus-visible:ring-offset-zinc-900 transition-all duration-300 shadow-glow group-hover:shadow-blue-900/5"
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                              onClick={() => setShowPassword(!showPassword)}
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
                        
                        {password && (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className={`text-xs flex items-center ${
                              passwordStrength.length ? 'text-green-400' : 'text-zinc-500'
                            }`}>
                              <CheckCircle2 className={`h-3 w-3 mr-1.5 ${!passwordStrength.length && 'opacity-50'}`} />
                              At least 8 characters
                            </div>
                            <div className={`text-xs flex items-center ${
                              passwordStrength.uppercase ? 'text-green-400' : 'text-zinc-500'
                            }`}>
                              <CheckCircle2 className={`h-3 w-3 mr-1.5 ${!passwordStrength.uppercase && 'opacity-50'}`} />
                              One uppercase letter
                            </div>
                            <div className={`text-xs flex items-center ${
                              passwordStrength.lowercase ? 'text-green-400' : 'text-zinc-500'
                            }`}>
                              <CheckCircle2 className={`h-3 w-3 mr-1.5 ${!passwordStrength.lowercase && 'opacity-50'}`} />
                              One lowercase letter
                            </div>
                            <div className={`text-xs flex items-center ${
                              passwordStrength.number ? 'text-green-400' : 'text-zinc-500'
                            }`}>
                              <CheckCircle2 className={`h-3 w-3 mr-1.5 ${!passwordStrength.number && 'opacity-50'}`} />
                              One number
                            </div>
                          </div>
                        )}
                        
                        <FormMessage className="text-blue-400" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input 
                              type={showConfirmPassword ? "text" : "password"} 
                              placeholder="Confirm your password" 
                              {...field} 
                              autoComplete="new-password"
                              className="h-11 bg-zinc-800/50 border-zinc-700 focus:border-blue-500 focus-visible:ring-blue-500/30 focus-visible:ring-offset-zinc-900 transition-all duration-300 shadow-glow group-hover:shadow-blue-900/5"
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              tabIndex={-1}
                            >
                              {showConfirmPassword ? (
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
                  
                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal text-zinc-300">
                          I agree to the{" "}
                          <Link href="/terms" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                            Privacy Policy
                          </Link>
                        </FormLabel>
                        <FormMessage className="text-blue-400" />
                      </FormItem>
                    )}
                  />
                  
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
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Create Account
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
                    Or sign up with
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
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Hero Section */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-bl from-[#000000] via-[#001233] to-[#001845] z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,123,255,0.1),transparent_70%)]"></div>
        </div>

        {/* Floating Elements */}
        {floatingElements.map((el) => (
          <motion.div
            key={el.id}
            className={`absolute ${el.size} rounded-full opacity-20 bg-gradient-to-r from-blue-400 to-blue-600 blur-xl`}
            style={{ top: el.top, right: el.right }}
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
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl font-bold mb-4 font-heading">
                Join the <span className="text-blue-400">Next Generation</span> of Blogging
              </h1>
            </motion.div>
            <motion.p variants={itemVariants} className="text-lg text-blue-100/80 max-w-lg">
              Create your account and become part of our growing community of forward-thinking content creators.
            </motion.p>
            
            <motion.div variants={containerVariants} className="space-y-6 mt-8">
              <motion.div variants={itemVariants} className="flex items-start space-x-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/20 mt-1">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Instant Publishing</h3>
                  <p className="text-blue-100/70">Share your thoughts with the world instantly using our streamlined publishing tools.</p>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-start space-x-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/20 mt-1">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Enhanced Security</h3>
                  <p className="text-blue-100/70">Your content and personal information are protected with state-of-the-art security protocols.</p>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-start space-x-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/20 mt-1">
                  <LockKeyhole className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Privacy Controls</h3>
                  <p className="text-blue-100/70">Full control over your privacy settings and content visibility.</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Bottom abstract shape */}
          <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
        </div>
      </motion.div>
    </div>
  );
}
