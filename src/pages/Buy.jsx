import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';
import { useAdminData } from '@/lib/AdminDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function Buy() {
  const { properties: adminProperties } = useAdminData();
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [localFavorites, setLocalFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem('buy_local_favorites');
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    priceMin: '',
    priceMax: '',
    bedrooms: ''
  });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });
  const limit = 12;

  const activeAdminProperties = useMemo(
    () => adminProperties.filter((p) => p.admin_status === 'Active' || !p.admin_status),
    [adminProperties]
  );

  useEffect(() => {
    localStorage.setItem('buy_local_favorites', JSON.stringify([...localFavorites]));
  }, [localFavorites]);

  useEffect(() => {
    fetchProperties();
    fetchFavorites();
  }, [filters, page, activeAdminProperties]);

  const normalizeBackendProperty = (property) => ({
    id: property._id,
    title: property.title,
    city: property.city,
    type: property.type,
    status: property.status,
    price: property.price,
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    area: property.area || 0,
    areaUnit: property.areaUnit || property.area_unit || 'sqft',
    images: property.images || [],
    source: 'backend'
  });

  const normalizeAdminProperty = (property) => ({
    id: property.id,
    title: property.title,
    city: property.city,
    type: property.type,
    status: property.status,
    price: property.price,
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    area: property.area || 0,
    areaUnit: property.area_unit || property.areaUnit || 'sqft',
    images: property.images || [],
    source: 'local'
  });

  const matchesFilters = (property) => {
    const cityMatch = !filters.city || property.city?.toLowerCase().includes(filters.city.toLowerCase());
    const typeMatch = !filters.type || property.type === filters.type;
    const minMatch = !filters.priceMin || Number(property.price) >= Number(filters.priceMin);
    const maxMatch = !filters.priceMax || Number(property.price) <= Number(filters.priceMax);
    const bedroomMatch = !filters.bedrooms || Number(property.bedrooms) >= Number(filters.bedrooms);
    return cityMatch && typeMatch && minMatch && maxMatch && bedroomMatch;
  };

  const getFallbackProperties = () => {
    const filtered = activeAdminProperties
      .filter(matchesFilters)
      .map(normalizeAdminProperty);

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      properties: filtered.slice(start, end),
      pagination: {
        page,
        limit,
        total: filtered.length,
        pages: Math.max(1, Math.ceil(filtered.length / limit))
      }
    };
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({
        page,
        limit,
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
      });

      const response = await apiClient.get(`/properties?${params}`);

      // Handle both response formats
      const props = response.properties || response.data?.properties || [];
      const pag = response.pagination || response.data?.pagination || { total: 0, pages: 0, page, limit };

      if (props.length > 0) {
        setProperties(props.map(normalizeBackendProperty));
        setPagination(pag);
        setUsingFallbackData(false);
      } else {
        const fallback = getFallbackProperties();
        setProperties(fallback.properties);
        setPagination(fallback.pagination);
        setUsingFallbackData(true);
      }
    } catch (err) {
      const fallback = getFallbackProperties();
      setProperties(fallback.properties);
      setPagination(fallback.pagination);
      setUsingFallbackData(true);
      setError('Using local listings while backend data is unavailable.');
      console.error('Failed to load backend properties, using local data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await apiClient.get('/user/favorites?limit=1000');
      const favs = response.favorites || response.data?.favorites || [];
      setFavorites(new Set(favs.map((f) => f.propertyId?._id).filter(Boolean)));
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  };

  const toggleFavorite = async (propertyId, source) => {
    if (source === 'local') {
      const next = new Set(localFavorites);
      if (next.has(propertyId)) {
        next.delete(propertyId);
        toast.success('Removed from favorites');
      } else {
        next.add(propertyId);
        toast.success('Added to favorites');
      }
      setLocalFavorites(next);
      return;
    }

    try {
      if (favorites.has(propertyId)) {
        await apiClient.delete(`/user/favorites/${propertyId}`);
        const newFavorites = new Set(favorites);
        newFavorites.delete(propertyId);
        setFavorites(newFavorites);
        toast.success('Removed from favorites');
      } else {
        await apiClient.post(`/user/favorites/${propertyId}`);
        setFavorites(new Set(favorites).add(propertyId));
        toast.success('Added to favorites');
      }
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Browse Properties</h1>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">City</label>
                <Input
                  placeholder="Enter city"
                  value={filters.city}
                  onChange={(e) => {
                    setFilters({ ...filters, city: e.target.value });
                    setPage(1);
                  }}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => {
                    setFilters({ ...filters, type: e.target.value });
                    setPage(1);
                  }}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Min Price</label>
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => {
                    setFilters({ ...filters, priceMin: e.target.value });
                    setPage(1);
                  }}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Max Price</label>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => {
                    setFilters({ ...filters, priceMax: e.target.value });
                    setPage(1);
                  }}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Bedrooms</label>
                <Input
                  type="number"
                  placeholder="Min bedrooms"
                  value={filters.bedrooms}
                  onChange={(e) => {
                    setFilters({ ...filters, bedrooms: e.target.value });
                    setPage(1);
                  }}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {usingFallbackData && !error && (
          <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 rounded-md mb-4">
            Showing available dashboard listings because backend listings are currently empty.
          </div>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition">
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                {property.images?.[0] ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                )}
                <button
                  onClick={() => toggleFavorite(property.id, property.source)}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition"
                >
                  <Heart
                    className={`h-5 w-5 ${(property.source === 'local' ? localFavorites.has(property.id) : favorites.has(property.id)) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                  />
                </button>
              </div>

              <CardContent className="pt-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{property.title}</h3>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p className="font-medium text-lg text-blue-600">${property.price.toLocaleString()}</p>
                  <p>{property.city}</p>
                  <div className="flex gap-4 text-xs">
                    <span>{property.bedrooms} Beds</span>
                    <span>{property.bathrooms} Baths</span>
                    <span>{property.area} {property.areaUnit || 'sqft'}</span>
                  </div>
                </div>

                <div className="flex gap-2 items-center justify-between">
                  <div className="flex gap-2">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {property.type}
                    </span>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      {property.status}
                    </span>
                  </div>
                  <Link to={`/properties/${property.id}`}>
                    <Button size="sm" variant="outline">View Details</Button>
                  </Link>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  {property.source === 'local' ? 'Source: Dashboard listings' : 'Source: Backend listings'}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          </div>
        )}

        {!loading && properties.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No properties found matching your criteria
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(pagination.pages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={page === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setPage(Math.min(pagination.pages, page + 1))}
              disabled={page === pagination.pages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
