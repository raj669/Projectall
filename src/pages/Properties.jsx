import { useState } from 'react';
import { Building2, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CITIES } from '@/lib/constants';
import { useAdminData } from '@/lib/AdminDataContext';
import PropertyCard from '@/components/properties/PropertyCard';

const PROPERTY_TYPES = [
  { id: 'apartment', label: 'Apartment', icon: '🏢' },
  { id: 'house', label: 'House', icon: '🏠' },
  { id: 'villa', label: 'Villa', icon: '🏡' },
  { id: 'commercial', label: 'Commercial', icon: '🏬' },
  { id: 'land', label: 'Land', icon: '🌳' },
];

export default function Properties() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const { properties } = useAdminData();

  const activeProperties = properties.filter(p => p.admin_status === 'Active' || !p.admin_status);

  const filteredProperties = activeProperties.filter((prop) => {
    const matchesSearch =
      prop.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.address?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || prop.type === selectedType;
    const matchesCity = !selectedCity || prop.city === selectedCity;
    return matchesSearch && matchesType && matchesCity;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/10 to-accent/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Browse Properties</h1>
          <p className="text-muted-foreground">Discover the perfect property for your needs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, city, or address..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Property Type</h3>
              <div className="space-y-2">
                <Button
                  variant={selectedType === null ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedType(null)}
                >
                  All Types
                </Button>
                {PROPERTY_TYPES.map((t) => (
                  <Button
                    key={t.id}
                    variant={selectedType === t.id ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedType(t.id)}
                  >
                    <span className="mr-2">{t.icon}</span>
                    {t.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">City</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <Button
                  variant={selectedCity === null ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedCity(null)}
                >
                  All Cities
                </Button>
                {CITIES.map((city) => (
                  <Button
                    key={city}
                    variant={selectedCity === city ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedCity(city)}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {city}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            <p className="text-sm text-muted-foreground mb-4">
              Showing {filteredProperties.length} properties
            </p>

            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property, i) => (
                  <PropertyCard key={property.id} property={property} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Building2 className="w-16 h-16 text-muted-foreground/50" />
                <p className="text-muted-foreground">No properties found matching your criteria</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType(null);
                    setSelectedCity(null);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
