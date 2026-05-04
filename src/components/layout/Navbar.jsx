import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Building2, Phone, BarChart3, Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/properties", label: "Properties", icon: Building2 },
  { to: "/contact", label: "Contact", icon: Phone },
  { to: "/report", label: "Report", icon: BarChart3 },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🏠</span>
            <span className="font-playfair text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              NepalEstates
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
              return (
                <Link key={to} to={to}>
                  <Button
                    variant={active ? "default" : "ghost"}
                    size="sm"
                    className={active ? "" : "text-muted-foreground hover:text-foreground"}
                  >
                    <Icon className="w-4 h-4 mr-1.5" />
                    {label}
                  </Button>
                </Link>
              );
            })}
            {user?.role === "admin" && (
              <Link to="/admin">
                <Button
                  variant={location.pathname.startsWith("/admin") ? "default" : "ghost"}
                  size="sm"
                  className={location.pathname.startsWith("/admin") ? "" : "text-muted-foreground hover:text-foreground"}
                >
                  <Settings className="w-4 h-4 mr-1.5" />
                  Admin
                </Button>
              </Link>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card pb-4 px-4">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} onClick={() => setMobileOpen(false)}>
                <div className={`flex items-center gap-3 px-3 py-3 rounded-lg mt-1 transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}>
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{label}</span>
                </div>
              </Link>
            );
          })}
          {user?.role === "admin" && (
            <Link to="/admin" onClick={() => setMobileOpen(false)}>
              <div className={`flex items-center gap-3 px-3 py-3 rounded-lg mt-1 transition-colors ${
                location.pathname.startsWith("/admin") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
                <Settings className="w-4 h-4" />
                <span className="font-medium text-sm">Admin</span>
              </div>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}