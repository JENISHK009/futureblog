import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Newsletter from "@/components/common/Newsletter";
import BackgroundGradient from "@/components/common/BackgroundGradient";
import { Sparkles, Rocket, Users, Globe, Zap, ArrowRight, ExternalLink } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

interface MilestoneItem {
  year: string;
  title: string;
  description: string;
  icon: string;
}

// Team member data
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Founder & CEO",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80",
    bio: "Sarah has over 10 years of experience in digital content creation and publishing.",
    socialLinks: {
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Lead Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80",
    bio: "Full-stack developer with expertise in modern web technologies and user experience.",
    socialLinks: {
      twitter: "#",
      github: "#",
      linkedin: "#"
    }
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "Creative Director",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80",
    bio: "Emily brings creative vision and design expertise to make our platform visually stunning.",
    socialLinks: {
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    id: 4,
    name: "Michael Roberts",
    role: "Content Strategist",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80",
    bio: "Michael helps bloggers create engaging content that resonates with readers.",
    socialLinks: {
      twitter: "#",
      linkedin: "#"
    }
  }
];

// Milestone data
const milestones: MilestoneItem[] = [
  {
    year: "2018",
    title: "Company Founded",
    description: "Bloggers Ground was founded with a vision to create a platform where bloggers can share their stories and ideas.",
    icon: "ri-flag-line"
  },
  {
    year: "2019",
    title: "First 1,000 Users",
    description: "We reached our first milestone of 1,000 active users on the platform.",
    icon: "ri-user-star-line"
  },
  {
    year: "2020",
    title: "Web Stories Launch",
    description: "Introduced the innovative Web Stories feature for short-form, visual content.",
    icon: "ri-slideshow-line"
  },
  {
    year: "2021",
    title: "Mobile App Release",
    description: "Launched our mobile application to reach users on all devices.",
    icon: "ri-smartphone-line"
  },
  {
    year: "2022",
    title: "1 Million Monthly Readers",
    description: "Achieved a major milestone with 1 million monthly active readers.",
    icon: "ri-bar-chart-box-line"
  },
  {
    year: "2023",
    title: "Global Expansion",
    description: "Expanded our platform to support multiple languages and regional content.",
    icon: "ri-global-line"
  }
];

// Stats data
const stats = [
  { label: "Countries", value: "25+", icon: "ri-earth-line" },
  { label: "Active Users", value: "1.2M+", icon: "ri-user-smile-line" },
  { label: "Published Stories", value: "5M+", icon: "ri-book-line" },
  { label: "Content Views", value: "45M+", icon: "ri-eye-line" }
];

export default function About() {
  const [activeTab, setActiveTab] = useState("mission");
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -60]);
  
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
  
  const valueProps = [
    { 
      title: "Vision", 
      description: "We envision a digital landscape where content creators have the freedom to express themselves and connect with audiences who value their unique perspectives.",
      icon: <Rocket className="h-6 w-6 text-blue-400" />,
      color: "bg-gradient-to-br from-blue-500/80 to-blue-600"
    },
    { 
      title: "Community", 
      description: "We're building a supportive community where creators can collaborate, share ideas, and grow together in their content creation journey.",
      icon: <Users className="h-6 w-6 text-purple-400" />,
      color: "bg-gradient-to-br from-purple-500/80 to-purple-600"
    },
    { 
      title: "Innovation", 
      description: "We're constantly innovating to provide cutting-edge tools and features that empower bloggers to create immersive content experiences.",
      icon: <Sparkles className="h-6 w-6 text-cyan-400" />,
      color: "bg-gradient-to-br from-cyan-500/80 to-cyan-600" 
    }
  ];

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Fixed Background */}
      <BackgroundGradient className="fixed inset-0 z-[-1]" variant="cyber" />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] overflow-hidden flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(0,123,255,0.15),transparent_70%)]"></div>
          
          <motion.div 
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl"
            animate={{ 
              x: [0, 10, 0], 
              y: [0, 15, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div 
            className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl"
            animate={{ 
              x: [0, -15, 0], 
              y: [0, 10, 0],
              scale: [1, 1.08, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-5xl mx-auto"
            style={{ opacity, y }}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center mb-10"
            >
              <motion.div variants={itemVariants} className="inline-block mb-4">
                <div className="bg-blue-500/20 backdrop-blur-sm px-4 py-1.5 rounded-full inline-flex items-center mb-6">
                  <span className="text-blue-400 text-sm font-medium">Established 2018</span>
                </div>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white font-heading"
              >
                About <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Bloggers Ground</span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed mb-10"
              >
                We're creating the best platform for bloggers to share their stories and connect 
                with readers around the world through immersive digital experiences.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
                <Button className="px-6 py-6 h-auto bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-900/20 transition-all duration-300 hover:-translate-y-0.5 group">
                  Start Blogging
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" className="px-6 py-6 h-auto border-blue-600/30 hover:border-blue-600/60 text-blue-400 hover:text-blue-300 rounded-lg font-medium backdrop-blur-sm">
                  Our Vision
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-blue-400/40 rounded-full flex items-center justify-center">
            <motion.div 
              className="w-1.5 h-1.5 bg-blue-400 rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>
      
      {/* Values Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-block bg-blue-950/50 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
              <span className="text-blue-400 text-sm font-medium">Our Core Values</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white font-heading">
              The Guiding Principles <span className="text-blue-400">Behind Our Mission</span>
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto">
              At Bloggers Ground, we're driven by a set of core values that shape everything we do,
              from the features we build to how we interact with our community.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((prop, index) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden shadow-xl shadow-blue-900/5 group hover:shadow-blue-600/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${prop.color} flex items-center justify-center mb-6 shadow-lg`}>
                    {prop.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{prop.title}</h3>
                  <p className="text-blue-100/70 leading-relaxed">
                    {prop.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 backdrop-blur-sm border-y border-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-xl bg-blue-600/20 text-blue-400">
                    <i className={`${stat.icon} text-2xl`}></i>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-blue-100/70">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-block bg-blue-950/50 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
              <span className="text-blue-400 text-sm font-medium">Our Story</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white font-heading">
              The <span className="text-blue-400">Journey</span> So Far
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto">
              From a small startup to a thriving platform, here's how we've grown and evolved over the years.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-blue-900/30"></div>
            
            <div className="space-y-20">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className="w-1/2"></div>
                  
                  {/* Year Circle */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center z-10 shadow-lg shadow-blue-900/20">
                    <span className="text-white font-bold">{milestone.year}</span>
                  </div>
                  
                  {/* Content Card */}
                  <div className={`w-1/2 ${
                    index % 2 === 0 ? 'pr-16 md:pr-24 text-right' : 'pl-16 md:pl-24'
                  }`}>
                    <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 p-6 rounded-xl shadow-lg hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1 group">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600/10 mb-4 group-hover:bg-blue-600/20 transition-colors duration-300">
                        <i className={`${milestone.icon} text-xl text-blue-400`}></i>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white">{milestone.title}</h3>
                      <p className="text-blue-100/70">{milestone.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-block bg-blue-950/50 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
              <span className="text-blue-400 text-sm font-medium">Our Team</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white font-heading">
              Meet the <span className="text-blue-400">Minds</span> Behind Bloggers Ground
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto">
              Our team of passionate individuals is dedicated to creating the best platform for content creators around the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden shadow-lg shadow-blue-900/5 group hover:shadow-blue-600/10 transition-all duration-300"
              >
                {/* Gradient top border */}
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-700"></div>
                
                <div className="p-6">
                  <Avatar className="w-24 h-24 mx-auto mb-6 border-4 border-zinc-800 ring-2 ring-blue-500/30 futuristic-glow">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-blue-900 text-blue-100 text-2xl">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-xl font-bold mb-1 text-white">{member.name}</h3>
                  <p className="text-blue-400 font-medium mb-4">{member.role}</p>
                  
                  <p className="text-blue-100/70 mb-6 line-clamp-3">{member.bio}</p>
                  
                  <div className="flex justify-center space-x-4">
                    {member.socialLinks.twitter && (
                      <a 
                        href={member.socialLinks.twitter} 
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 transition-colors"
                      >
                        <i className="ri-twitter-fill"></i>
                      </a>
                    )}
                    {member.socialLinks.linkedin && (
                      <a 
                        href={member.socialLinks.linkedin} 
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 transition-colors"
                      >
                        <i className="ri-linkedin-fill"></i>
                      </a>
                    )}
                    {member.socialLinks.github && (
                      <a 
                        href={member.socialLinks.github} 
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 transition-colors"
                      >
                        <i className="ri-github-fill"></i>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/30 to-zinc-900/80 backdrop-blur-sm border border-blue-900/30 rounded-2xl p-10 lg:p-16 text-center shadow-2xl shadow-blue-900/10 relative overflow-hidden"
          >
            {/* Background effect */}
            <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
              <motion.div 
                className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"
                animate={{
                  x: [0, 10, 0],
                  y: [0, -10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white font-heading">
                Ready to Join Our Community of <span className="text-blue-400">Future-Forward Bloggers</span>?
              </h2>
              
              <p className="text-lg text-blue-100/80 mb-10 max-w-2xl mx-auto">
                Whether you're a blogger looking to share your voice or a reader seeking fresh perspectives, Bloggers Ground has something for you.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg shadow-blue-900/20 transition-all duration-300 hover:-translate-y-0.5 group">
                  Start Creating
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
                
                <Button size="lg" variant="outline" className="h-14 px-8 border-blue-600/30 hover:border-blue-600/60 text-blue-400 hover:text-blue-300 rounded-lg font-medium transition-colors">
                  Learn More
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
}
