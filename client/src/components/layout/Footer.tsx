import { Link } from "wouter";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Blogs", href: "/blogs" },
  { name: "Web Stories", href: "/webstories" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const categories = [
  { name: "Technology", href: "/blogs?category=technology" },
  { name: "Design", href: "/blogs?category=design" },
  { name: "Development", href: "/blogs?category=development" },
  { name: "Business", href: "/blogs?category=business" },
  { name: "Travel", href: "/blogs?category=travel" },
];

const legal = [
  { name: "Terms of Service", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Cookie Policy", href: "/cookie-policy" },
  { name: "GDPR", href: "/gdpr" },
];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-xl font-heading font-bold">
                <span className="text-primary">Bloggers</span>{" "}
                <span className="text-foreground">Ground</span>
              </span>
            </div>
            <p className="text-muted-foreground mb-6">
              A platform for bloggers to share their ideas and stories with the world.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors duration-300"
                aria-label="Facebook"
              >
                <i className="ri-facebook-fill"></i>
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors duration-300"
                aria-label="Twitter"
              >
                <i className="ri-twitter-fill"></i>
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors duration-300"
                aria-label="Instagram"
              >
                <i className="ri-instagram-fill"></i>
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <i className="ri-linkedin-fill"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.href}>
                  <Link 
                    href={category.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-zinc-800 mt-12 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Bloggers Ground. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
