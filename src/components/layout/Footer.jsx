import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Browse Properties" },
  { to: "/buy", label: "Buy Property" },
  { to: "/sell", label: "Sell Property" },
  { to: "/heatmap", label: "Heatmap" },
  { to: "/contact", label: "Contact Us" },
  { to: "/report", label: "Market Report" },
];

const PROPERTY_TYPES = [
  { to: "/properties?type=apartment", label: "Apartments" },
  { to: "/properties?type=house",     label: "Houses" },
  { to: "/properties?type=villa",     label: "Villas" },
  { to: "/properties?type=commercial",label: "Commercial" },
  { to: "/properties?type=land",      label: "Land & Plots" },
];

const TOP_CITIES = [
  { to: "/properties?city=Kathmandu", label: "Kathmandu" },
  { to: "/properties?city=Pokhara",   label: "Pokhara" },
  { to: "/properties?city=Lalitpur",  label: "Lalitpur" },
  { to: "/properties?city=Bhaktapur", label: "Bhaktapur" },
  { to: "/properties?city=Chitwan",   label: "Chitwan" },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">🏠</span>
              <span className="font-playfair text-xl font-bold">NepalEstates</span>
            </div>
            <p className="text-background/55 text-sm leading-relaxed mb-6">
              Nepal's most trusted property platform. Find verified homes, apartments, villas, land, and commercial spaces across 12+ cities.
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2.5 text-background/55">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                <span>Durbar Marg, Kathmandu 44600, Nepal</span>
              </div>
              <div className="flex items-center gap-2.5 text-background/55">
                <Phone className="w-4 h-4 shrink-0 text-accent" />
                <span>+977-1-4234567</span>
              </div>
              <div className="flex items-center gap-2.5 text-background/55">
                <Mail className="w-4 h-4 shrink-0 text-accent" />
                <span>info@nepalestates.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-background/80 mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex items-center gap-1.5 text-sm text-background/55 hover:text-background transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-background/80 mb-5">
              Property Types
            </h4>
            <ul className="space-y-2.5">
              {PROPERTY_TYPES.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex items-center gap-1.5 text-sm text-background/55 hover:text-background transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Cities */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-background/80 mb-5">
              Top Cities
            </h4>
            <ul className="space-y-2.5">
              {TOP_CITIES.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex items-center gap-1.5 text-sm text-background/55 hover:text-background transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/35">
          <p>© 2026 NepalEstates. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-background/60 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-background/60 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-background/60 cursor-pointer transition-colors">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
