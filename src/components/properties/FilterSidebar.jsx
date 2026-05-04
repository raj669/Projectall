import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal } from "lucide-react";

const cities = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Biratnagar", "Dharan", "Bharatpur"];
const types = ["apartment", "house", "villa", "commercial", "land"];

export default function FilterSidebar({ filters, setFilters, onReset }) {
  const update = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const activeCount = Object.values(filters).filter(v => v && v !== "" && v !== "all").length;

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-5 sticky top-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">Filters</h3>
          {activeCount > 0 && (
            <Badge variant="secondary" className="text-xs">{activeCount}</Badge>
          )}
        </div>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset} className="text-xs text-muted-foreground">
            <X className="w-3 h-3 mr-1" /> Clear
          </Button>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">City</Label>
        <Select value={filters.city || "all"} onValueChange={v => update("city", v === "all" ? "" : v)}>
          <SelectTrigger><SelectValue placeholder="All Cities" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Type</Label>
        <Select value={filters.type || "all"} onValueChange={v => update("type", v === "all" ? "" : v)}>
          <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Status</Label>
        <Select value={filters.status || "all"} onValueChange={v => update("status", v === "all" ? "" : v)}>
          <SelectTrigger><SelectValue placeholder="Buy / Rent" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Min Price (NPR)</Label>
        <Input
          type="number"
          placeholder="0"
          value={filters.minPrice || ""}
          onChange={e => update("minPrice", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Max Price (NPR)</Label>
        <Input
          type="number"
          placeholder="No limit"
          value={filters.maxPrice || ""}
          onChange={e => update("maxPrice", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Min Bedrooms</Label>
        <Select value={filters.bedrooms || "all"} onValueChange={v => update("bedrooms", v === "all" ? "" : v)}>
          <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            {[1, 2, 3, 4, 5].map(n => <SelectItem key={n} value={String(n)}>{n}+</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Featured Only</Label>
        <Select value={filters.featured || "all"} onValueChange={v => update("featured", v === "all" ? "" : v)}>
          <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            <SelectItem value="true">Featured Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}