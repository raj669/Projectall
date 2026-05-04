import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Bed, Bath, Maximize, Star } from "lucide-react";
import { motion } from "framer-motion";

function formatPrice(price) {
  if (price >= 10000000) return `NPR ${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `NPR ${(price / 100000).toFixed(1)} L`;
  return `NPR ${price.toLocaleString()}`;
}

export default function PropertyCard({ property, index = 0 }) {
  const image = property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/properties/${property.id}`}>
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 border-border/50 cursor-pointer h-full">
          <div className="relative overflow-hidden aspect-[4/3]">
            <img
              src={image}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className="bg-primary text-primary-foreground text-xs">
                {property.status === "sale" ? "For Sale" : "For Rent"}
              </Badge>
              {property.featured && (
                <Badge className="bg-accent text-accent-foreground text-xs">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Featured
                </Badge>
              )}
            </div>

            <div className="absolute bottom-3 left-3">
              <p className="text-white font-bold text-lg drop-shadow-lg">
                {formatPrice(property.price)}
                {property.status === "rent" && <span className="text-sm font-normal">/mo</span>}
              </p>
            </div>
          </div>

          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1.5">
              {property.title}
            </h3>

            <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{property.address || `${property.city}, ${property.district}`}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-3">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5" />
                  <span>{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5" />
                  <span>{property.bathrooms}</span>
                </div>
              )}
              {property.area > 0 && (
                <div className="flex items-center gap-1">
                  <Maximize className="w-3.5 h-3.5" />
                  <span>{property.area} {property.area_unit || "sqft"}</span>
                </div>
              )}
              <Badge variant="outline" className="ml-auto text-xs capitalize">
                {property.type}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}