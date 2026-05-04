import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight, Search, ShieldCheck, Users, Star, Award,
  Clock, Headphones, CheckCircle2, TrendingUp, MapPin,
  Home as HomeIcon, Building2, TreePine, Store, Quote,
} from 'lucide-react';
import HeroSection from '@/components/home/HeroSection';
import StatsBar from '@/components/home/StatsBar';
import FeaturedProperties from '@/components/home/FeaturedProperties';

const HOW_IT_WORKS = [
  {
    title: 'Search & Discover',
    desc: 'Browse thousands of verified listings. Filter by city, type, budget, and more to find the perfect match.',
    icon: Search,
  },
  {
    title: 'Connect with Agents',
    desc: 'Get in touch instantly with our trusted network of professional agents across all major cities.',
    icon: Users,
  },
  {
    title: 'Close the Deal',
    desc: 'Finalize your purchase or rental with secure documentation and full legal support every step of the way.',
    icon: CheckCircle2,
  },
];

const PROPERTY_TYPES = [
  { id: 'apartment', label: 'Apartments', count: '8',  image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80', icon: Building2 },
  { id: 'house',     label: 'Houses',     count: '6',  image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80', icon: HomeIcon },
  { id: 'villa',     label: 'Villas',     count: '4',  image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', icon: Award },
  { id: 'commercial',label: 'Commercial', count: '6',  image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', icon: Store },
  { id: 'land',      label: 'Land',       count: '6',  image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', icon: TreePine },
];

const POPULAR_CITIES = [
  { name: 'Kathmandu', listings: '12', image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=700&q=80' },
  { name: 'Lalitpur',  listings: '7',  image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=700&q=80' },
  { name: 'Pokhara',   listings: '5',  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80' },
  { name: 'Bhaktapur', listings: '3',  image: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=700&q=80' },
  { name: 'Biratnagar',listings: '2',  image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=700&q=80' },
  { name: 'Dharan',    listings: '2',  image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=80' },
];

const WHY_US = [
  { icon: ShieldCheck, title: 'Verified Listings',   desc: 'Every property is physically verified by our team before going live on the platform.' },
  { icon: Users,       title: 'Expert Agents',        desc: 'Our team of 6 dedicated agents covers all listed cities with deep local market knowledge.' },
  { icon: Clock,       title: 'Fast Transactions',    desc: 'Streamlined paperwork and dedicated legal support to close deals in record time.' },
  { icon: Headphones,  title: '24/7 Support',         desc: 'Round-the-clock customer service in Nepali and English — we are always available.' },
];

const TESTIMONIALS = [
  {
    name: 'Sanjay Thapa',
    location: 'Kathmandu',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    text: 'Found our dream apartment in Thamel within a week. The agent was incredibly helpful and the whole process was completely smooth. Highly recommend NepalEstates!',
  },
  {
    name: 'Anita Sharma',
    location: 'Lalitpur',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    text: 'As a first-time buyer I was nervous, but NepalEstates guided me every step of the way. I now own a beautiful house in Jawalakhel thanks to their amazing team!',
  },
  {
    name: 'Rajesh Karki',
    location: 'Pokhara',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    text: 'Rented out my Lakeside property to wonderful tenants through NepalEstates. The platform is easy to use and the team is professional and responsive.',
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.55, ease: 'easeOut' },
});

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────── */}
      <HeroSection />

      {/* ── Stats Bar ────────────────────────────────── */}
      <StatsBar />

      {/* ── How It Works ─────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1 text-primary border-primary/40 font-medium">
              Simple 3-Step Process
            </Badge>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
              How NepalEstates Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From search to keys in hand — we make property transactions simple and stress-free.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-12 left-[19%] right-[19%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            {HOW_IT_WORKS.map(({ title, desc, icon: Icon }, i) => (
              <motion.div key={title} {...fadeUp(i * 0.15)} className="flex flex-col items-center text-center px-2">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-primary/8 border-2 border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
                    <Icon className="w-9 h-9 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-primary-foreground rounded-full text-xs font-bold flex items-center justify-center shadow">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Properties ───────────────────────── */}
      <FeaturedProperties />

      {/* ── Browse by Type ───────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <Badge variant="outline" className="mb-4 px-4 py-1 text-primary border-primary/40 font-medium">
              Explore Categories
            </Badge>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
              Browse by Property Type
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From cozy studios to vast open plots — find exactly what you are looking for.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {PROPERTY_TYPES.map(({ id, label, count, image, icon: Icon }, i) => (
              <motion.div key={id} {...fadeUp(i * 0.08)}>
                <Link to={`/properties?type=${id}`}>
                  <div className="group relative overflow-hidden rounded-2xl cursor-pointer" style={{ aspectRatio: '3/4' }}>
                    <img
                      src={image}
                      alt={label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-500" />
                    <div className="absolute top-3 left-3">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-bold text-base">{label}</p>
                      <p className="text-white/65 text-xs mt-0.5">{count} listings</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Cities ────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <Badge variant="outline" className="mb-4 px-4 py-1 text-primary border-primary/40 font-medium">
              Top Locations
            </Badge>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Popular Cities
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Discover verified properties in Nepal's most sought-after urban destinations.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {POPULAR_CITIES.map(({ name, listings, image }, i) => (
              <motion.div key={name} {...fadeUp(i * 0.09)}>
                <Link to={`/properties?city=${name}`}>
                  <div className="group relative overflow-hidden rounded-2xl cursor-pointer h-48">
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-colors duration-500" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <p className="text-white font-bold text-lg leading-tight">{name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-white/60" />
                        <p className="text-white/60 text-xs">{listings} listings</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────── */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1 bg-white/20 hover:bg-white/20 text-white border-white/20 font-medium">
              Our Commitment
            </Badge>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
              The NepalEstates Difference
            </h2>
            <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto">
              30 verified properties across 8 cities — every listing inspected and agent-backed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_US.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                {...fadeUp(i * 0.1)}
                className="group bg-white/8 hover:bg-white/14 backdrop-blur-sm rounded-2xl p-7 border border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1"
              >
                <div className="w-13 h-13 w-12 h-12 bg-white/15 group-hover:bg-white/25 rounded-xl flex items-center justify-center mb-5 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-primary-foreground/65 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1 text-primary border-primary/40 font-medium">
              Client Stories
            </Badge>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Real stories from real families who found their home through NepalEstates.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, location, rating, image, text }, i) => (
              <motion.div
                key={name}
                {...fadeUp(i * 0.12)}
                className="bg-card border border-border rounded-2xl p-7 flex flex-col gap-5 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300"
              >
                <Quote className="w-9 h-9 text-primary/25" />
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{text}</p>
                <div className="space-y-3">
                  <StarRating count={rating} />
                  <div className="flex items-center gap-3 pt-1 border-t border-border">
                    <img
                      src={image}
                      alt={name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{name}</p>
                      <p className="text-muted-foreground text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {location}, Nepal
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp()}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-accent p-12 md:p-20 text-center text-primary-foreground"
          >
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h2 className="font-playfair text-3xl md:text-5xl font-bold leading-tight">
                Ready to Find Your<br />Perfect Property?
              </h2>
              <p className="text-primary-foreground/75 text-lg">
                30 verified properties across 8 cities — browse apartments, houses, villas, commercial spaces, and land.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link to="/properties">
                  <Button size="lg" variant="secondary" className="font-semibold w-full sm:w-auto px-8 h-12 text-base shadow-lg">
                    Browse All Properties
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 hover:text-white font-semibold w-full sm:w-auto px-8 h-12 text-base"
                  >
                    Talk to an Agent
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
