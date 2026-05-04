import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Building2, Phone, BarChart3, Menu, X, Settings, Flame, ShoppingBag, Home as HomeSell, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

const publicNavLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/properties", label: "Properties", icon: Building2 },
  { to: "/heatmap", label: "Heatmap", icon: Flame, pulse: true },
  { to: "/contact", label: "Contact", icon: Phone },
  { to: "/report", label: "Report", icon: BarChart3 },
];

const authNavLinks = [
  { to: "/buy", label: "Buy", icon: ShoppingBag },
  { to: "/sell", label: "Sell", icon: HomeSell },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMobileOpen(false);
  };

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
            {isAuthenticated ? (
              <>
                {authNavLinks.map(({ to, label, icon: Icon }) => {
                  const active = location.pathname === to;
                  return (
                    <Link key={to} to={to}>
                      <Button
                        variant={active ? "default" : "ghost"}
                        size="sm"
                        className={`relative ${active ? "" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <Icon className="w-4 h-4 mr-1.5" />
                        {label}
                      </Button>
                    </Link>
                  );
                })}
                <div className="w-px h-6 bg-border mx-1" />
                <Link to="/profile">
                  <Button
                    variant={location.pathname === "/profile" ? "default" : "ghost"}
                    size="sm"
                    className={location.pathname === "/profile" ? "" : "text-muted-foreground hover:text-foreground"}
                  >
                    <User className="w-4 h-4 mr-1.5" />
                    {user?.name}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                {publicNavLinks.map(({ to, label, icon: Icon, pulse }) => {
                  const active = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
                  return (
                    <Link key={to} to={to}>
                      <Button
                        variant={active ? "default" : "ghost"}
                        size="sm"
                        className={`relative ${active ? "" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <Icon className="w-4 h-4 mr-1.5" />
                        {label}
                        {pulse && !active && (
                          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                          </span>
                        )}
                      </Button>
                    </Link>
                  );
                })}
                <div className="w-px h-6 bg-border mx-1" />
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
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
          {isAuthenticated ? (
            <>
              {authNavLinks.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to;
                return (
                  <Link key={to} to={to} onClick={() => setMobileOpen(false)}>
                    <div className={`relative flex items-center gap-3 px-3 py-3 rounded-lg mt-1 transition-colors ${
                      active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}>
                      <Icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{label}</span>
                    </div>
                  </Link>
                );
              })}
              <Link to="/profile" onClick={() => setMobileOpen(false)}>
                <div className={`flex items-center gap-3 px-3 py-3 rounded-lg mt-1 transition-colors ${
                  location.pathname === "/profile" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}>
                  <User className="w-4 h-4" />
                  <span className="font-medium text-sm">Profile</span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg mt-1 transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </>
          ) : (
            <>
              {publicNavLinks.map(({ to, label, icon: Icon, pulse }) => {
                const active = location.pathname === to;
                return (
                  <Link key={to} to={to} onClick={() => setMobileOpen(false)}>
                    <div className={`relative flex items-center gap-3 px-3 py-3 rounded-lg mt-1 transition-colors ${
                      active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}>
                      <Icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{label}</span>
                      {pulse && !active && (
                        <span className="ml-auto flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-orange-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start mt-2">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <Button variant="default" size="sm" className="w-full justify-start mt-2 bg-blue-600 hover:bg-blue-700">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
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