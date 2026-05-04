import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PropertyForm from '@/components/PropertyForm';

export default function Sell() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });

  useEffect(() => {
    fetchProperties();
  }, [page]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/user/properties?page=${page}&limit=10`);
      setProperties(response.data.properties);
      setPagination(response.data.pagination);
    } catch (err) {
      toast.error('Failed to load properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      await apiClient.delete(`/user/properties/${propertyId}`);
      toast.success('Property deleted successfully');
      fetchProperties();
    } catch (err) {
      toast.error('Failed to delete property');
    }
  };

  const handleFormSubmit = async (propertyData) => {
    try {
      if (editingProperty) {
        await apiClient.put(`/user/properties/${editingProperty._id}`, propertyData);
        toast.success('Property updated successfully');
      } else {
        await apiClient.post('/user/properties', propertyData);
        toast.success('Property created successfully');
      }
      setShowForm(false);
      setEditingProperty(null);
      fetchProperties();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save property');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Listings</h1>
          <Button
            onClick={() => {
              setEditingProperty(null);
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>

        {/* Property Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{editingProperty ? 'Edit Property' : 'Add New Property'}</CardTitle>
              </CardHeader>
              <CardContent>
                <PropertyForm
                  initialData={editingProperty}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingProperty(null);
                  }}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Properties List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            </div>
          ) : properties.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-500 mb-4">You haven't listed any properties yet</p>
              <Button
                onClick={() => {
                  setEditingProperty(null);
                  setShowForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Your First Listing
              </Button>
            </Card>
          ) : (
            properties.map((property) => (
              <Card key={property._id} className="overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex gap-6">
                    {/* Image */}
                    <div className="w-32 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                      {property.images?.[0] ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                        <p><strong>Price:</strong> ${property.price.toLocaleString()}</p>
                        <p><strong>Type:</strong> {property.type}</p>
                        <p><strong>City:</strong> {property.city}</p>
                        <p><strong>Status:</strong> {property.status}</p>
                        <p><strong>Area:</strong> {property.area} {property.areaUnit}</p>
                        <p><strong>Beds/Baths:</strong> {property.bedrooms}/{property.bathrooms}</p>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            property.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {property.published ? 'Published' : 'Draft'}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {property.views || 0} views
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingProperty(property);
                          setShowForm(true);
                        }}
                        className="w-full"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProperty(property._id)}
                        className="w-full"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

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
