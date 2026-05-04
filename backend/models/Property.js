import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  type: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'commercial', 'land'],
    required: [true, 'Property type is required']
  },
  status: {
    type: String,
    enum: ['sale', 'rent'],
    required: [true, 'Property status is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  bedrooms: {
    type: Number,
    required: true,
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: true,
    min: [0, 'Bathrooms cannot be negative']
  },
  area: {
    type: Number,
    required: [true, 'Area is required'],
    min: [0, 'Area cannot be negative']
  },
  areaUnit: {
    type: String,
    enum: ['sqft', 'sqm', 'aana'],
    default: 'sqft'
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  district: {
    type: String,
    default: null,
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  description: {
    type: String,
    default: '',
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  contactPhone: {
    type: String,
    required: true,
    match: [/^[0-9\-\+\(\) ]{10,}$/, 'Invalid phone format']
  },
  images: [{
    type: String,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/.+|\/uploads\/.+)$/.test(v);
      },
      message: 'Invalid image URL'
    }
  }],
  features: {
    type: [String],
    default: []
  },
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for filtering queries
propertySchema.index({ userId: 1, published: 1 });
propertySchema.index({ city: 1, status: 1 });
propertySchema.index({ createdAt: -1 });

export default mongoose.model('Property', propertySchema);
