import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAdminData } from "@/lib/AdminDataContext";
import PropertyCard from "../properties/PropertyCard";

export default function FeaturedProperties() {
  const { properties } = useAdminData();
  const featured = properties.filter(p => p.featured && (p.admin_status === 'Active' || !p.admin_status)).slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-3">
            Featured Properties
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Hand-picked premium properties across Nepal
          </p>
        </motion.div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">No featured properties at the moment.</p>
        )}

        <div className="text-center mt-10">
          <Link to="/properties">
            <Button variant="outline" size="lg" className="font-semibold">
              View All Properties
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
