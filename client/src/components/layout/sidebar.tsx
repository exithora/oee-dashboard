import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Home, Settings } from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  ];

  return (
    <div className="w-64 min-h-screen bg-sidebar p-4 border-r">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-sidebar-foreground">OEE Monitor</h2>
      </div>
      
      <nav className="space-y-2">
        {links.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}>
            <a
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                location === href ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );
}
