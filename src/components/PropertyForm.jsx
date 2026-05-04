import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title cannot exceed 200 characters'),
  type: z.enum(['apartment', 'house', 'villa', 'commercial', 'land']),
  status: z.enum(['sale', 'rent']),
  price: z.coerce.number().min(0, 'Price must be positive'),
  bedrooms: z.coerce.number().min(0, 'Bedrooms must be non-negative'),
  bathrooms: z.coerce.number().min(0, 'Bathrooms must be non-negative'),
  area: z.coerce.number().min(0, 'Area must be positive'),
  areaUnit: z.enum(['sqft', 'sqm', 'aana']).default('sqft'),
  city: z.string().min(1, 'City is required'),
  district: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  description: z.string().max(5000, 'Description cannot exceed 5000 characters').optional(),
  contactPhone: z.string().regex(/^[0-9\-\+\(\) ]{10,}$/, 'Invalid phone format'),
  features: z.array(z.string()).default([]),
  published: z.boolean().default(true)
});

export default function PropertyForm({ initialData, onSubmit, onCancel }) {
  const [images, setImages] = useState(initialData?.images || []);
  const [imagePreviews, setImagePreviews] = useState(initialData?.images || []);
  const [features, setFeatures] = useState(initialData?.features?.join(', ') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData || {
      areaUnit: 'sqft',
      published: true
    }
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 8) {
      alert('Maximum 8 images allowed');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreviews(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });

    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      // Handle images - convert to base64 or file objects for API
      const finalImages = [];
      for (let img of images) {
        if (typeof img === 'string') {
          // Existing image
          finalImages.push(img);
        } else if (img instanceof File) {
          // New image - convert to base64
          const reader = new FileReader();
          await new Promise(resolve => {
            reader.onload = () => {
              finalImages.push(reader.result);
              resolve();
            };
            reader.readAsDataURL(img);
          });
        }
      }

      const submitData = {
        ...formData,
        images: finalImages,
        features: features.split(',').map(f => f.trim()).filter(f => f)
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Basic Information</h3>

        <div>
          <label className="text-sm font-medium">Title *</label>
          <Input
            {...register('title')}
            placeholder="e.g., Beautiful 3-bedroom apartment in downtown"
            className="mt-1"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Type *</label>
            <select {...register('type')} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
            </select>
            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Status *</label>
            <select {...register('status')} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
            {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Location</h3>

        <div>
          <label className="text-sm font-medium">City *</label>
          <Input {...register('city')} placeholder="e.g., Kathmandu" className="mt-1" />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">District</label>
          <Input {...register('district')} placeholder="Optional" className="mt-1" />
        </div>

        <div>
          <label className="text-sm font-medium">Address *</label>
          <Input {...register('address')} placeholder="Street address" className="mt-1" />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Property Details</h3>

        <div>
          <label className="text-sm font-medium">Price *</label>
          <Input {...register('price')} type="number" placeholder="0" className="mt-1" />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Bedrooms *</label>
            <Input {...register('bedrooms')} type="number" placeholder="0" className="mt-1" />
            {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Bathrooms *</label>
            <Input {...register('bathrooms')} type="number" placeholder="0" className="mt-1" />
            {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Area *</label>
            <Input {...register('area')} type="number" placeholder="0" className="mt-1" />
            {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Area Unit</label>
          <select {...register('areaUnit')} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="sqft">Square Feet (sqft)</option>
            <option value="sqm">Square Meters (sqm)</option>
            <option value="aana">Aana</option>
          </select>
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Contact Information</h3>

        <div>
          <label className="text-sm font-medium">Phone *</label>
          <Input {...register('contactPhone')} placeholder="+977..." className="mt-1" />
          {errors.contactPhone && <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Description</h3>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            {...register('description')}
            placeholder="Describe your property..."
            rows={4}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Features</label>
          <Input
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder="e.g., Parking, Garden, Pool (comma-separated)"
            className="mt-1"
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Images (Max 8)</h3>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            disabled={images.length >= 8}
            className="hidden"
            id="image-input"
          />
          <label htmlFor="image-input" className="cursor-pointer">
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">JPG, PNG, WebP (max 5MB per image)</p>
          </label>
        </div>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Property' : 'Add Property'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
