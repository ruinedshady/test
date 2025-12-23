import { Link, useLocation } from "wouter";
import { Heart, Camera, Calendar, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();

  const links = [
    { href: "/", icon: Heart, label: "Home" },
    { href: "/memories", icon: Camera, label: "Memories" },
    { href: "/timeline", icon: Calendar, label: "Timeline" },
    { href: "/notes", icon: Mail, label: "Love Jar" },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-pink-100 shadow-xl shadow-pink-200/50 rounded-full px-6 py-3 flex items-center gap-2 z-50">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = location === link.href;
        
        return (
          <Link key={link.href} href={link.href}>
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 translate-y-[-2px]" 
                  : "text-muted-foreground hover:bg-pink-50 hover:text-primary"
              )}
            >
              <Icon size={20} className={isActive ? "fill-current" : ""} />
              <span className={cn("font-medium font-body", isActive ? "block" : "hidden md:block")}>
                {link.label}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
