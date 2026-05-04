import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Home, Tag, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const cities = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Biratnagar", "Dharan", "Bharatpur", "Chitwan"];
const types = ["apartment", "house", "villa", "commercial", "land"];

const POPULAR_SEARCHES = [
  { label: "Apartments in Kathmandu", city: "Kathmandu", type: "apartment" },
  { label: "Villas for Sale",          type: "villa",      status: "sale" },
  { label: "Houses in Pokhara",        city: "Pokhara",    type: "house" },
  { label: "Land for Sale",            type: "land",       status: "sale" },
  { label: "Rent in Lalitpur",         city: "Lalitpur",   status: "rent" },
];

export default function HeroSection() {
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const buildSearch = (overrides = {}) => {
    const params = new URLSearchParams();
    const c = overrides.city   ?? city;
    const t = overrides.type   ?? type;
    const s = overrides.status ?? status;
    if (c) params.set("city", c);
    if (t) params.set("type", t);
    if (s) params.set("status", s);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1800&q=85"
          alt="Nepal mountains"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      </div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="absolute top-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full text-sm font-medium shadow-lg">
          <TrendingUp className="w-4 h-4 text-accent" />
          Nepal's Most Trusted Property Platform
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-white mb-5 leading-[1.1] tracking-tight">
            Find Your Dream<br />
            <span className="text-accent italic">Property in Nepal</span>
          </h1>
          <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Browse 30 verified listings across 8 cities — apartments, houses, villas, land, and commercial spaces.
          </p>
        </motion.div>

        {/* Search card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.65, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-card/96 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="h-12 rounded-xl border-border/60 focus:ring-primary">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="Select City" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-12 rounded-xl border-border/60 focus:ring-primary">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="Property Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {types.map(t => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-12 rounded-xl border-border/60 focus:ring-primary">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="Buy / Rent" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Buy</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => buildSearch()}
                className="h-12 rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Popular searches */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-4 flex flex-wrap items-center gap-2 justify-center"
          >
            <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Popular:</span>
            {POPULAR_SEARCHES.map((s) => (
              <button
                key={s.label}
                onClick={() => buildSearch(s)}
                className="text-xs text-white/75 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 px-3 py-1.5 rounded-full transition-all duration-200 backdrop-blur-sm"
              >
                {s.label}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <span className="text-white/40 text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 bg-white/50 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
