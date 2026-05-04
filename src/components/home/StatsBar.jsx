import { motion } from "framer-motion";
import { Building2, MapPin, Users, ShieldCheck } from "lucide-react";
import { useAdminData } from "@/lib/AdminDataContext";

export default function StatsBar() {
  const { properties, users } = useAdminData();

  const activeListings = properties.filter(p => p.admin_status === 'Active' || !p.admin_status).length;
  const citiesCovered = [...new Set(properties.map(p => p.city).filter(Boolean))].length;
  const agentCount = users.filter(u => u.role === 'Agent').length;

  const stats = [
    { icon: Building2,   value: activeListings, label: "Active Listings",    sub: "verified and available" },
    { icon: MapPin,      value: citiesCovered,  label: "Cities Covered",     sub: "across Nepal" },
    { icon: Users,       value: agentCount,     label: "Expert Agents",      sub: "ready to help you" },
    { icon: ShieldCheck, value: "100%",          label: "Verified Properties", sub: "inspected before listing" },
  ];

  return (
    <section className="bg-card border-y border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-border">
          {stats.map(({ icon: Icon, value, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className="flex flex-col items-center text-center px-4 py-2"
            >
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="font-playfair text-3xl md:text-4xl font-bold text-foreground">{value}</p>
              <p className="text-foreground font-semibold text-sm mt-0.5">{label}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
