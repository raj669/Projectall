import Property from '../models/Property.js';
import { CustomError } from '../middleware/errorHandler.js';
import { logAction, getClientIp, getUserAgent } from '../utils/logger.js';

export const getUserProperties = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const properties = await Property.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Property.countDocuments({ userId: req.userId });

    res.json({
      properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!property) {
      throw new CustomError('Property not found', 'PROPERTY_NOT_FOUND', 404);
    }

    res.json({ property });
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (req, res, next) => {
  try {
    const { title, type, status, price, bedrooms, bathrooms, area, areaUnit, city, district, address, description, contactPhone, images, features } = req.body;

    const property = new Property({
      userId: req.userId,
      title,
      type,
      status,
      price,
      bedrooms,
      bathrooms,
      area,
      areaUnit,
      city,
      district,
      address,
      description,
      contactPhone,
      images: images || [],
      features: features || []
    });

    await property.save();
    await logAction(req.userId, '', 'property_added', getClientIp(req), getUserAgent(req), { propertyId: property._id });

    res.status(201).json({
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, type, status, price, bedrooms, bathrooms, area, areaUnit, city, district, address, description, contactPhone, images, features, published, featured } = req.body;

    // Check ownership
    const property = await Property.findById(id);
    if (!property) {
      throw new CustomError('Property not found', 'PROPERTY_NOT_FOUND', 404);
    }

    if (property.userId.toString() !== req.userId) {
      throw new CustomError('Unauthorized to update this property', 'UNAUTHORIZED', 403);
    }

    // Update property
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          type,
          status,
          price,
          bedrooms,
          bathrooms,
          area,
          areaUnit,
          city,
          district,
          address,
          description,
          contactPhone,
          images: images || property.images,
          features: features || property.features,
          published: published !== undefined ? published : property.published,
          featured: featured !== undefined ? featured : property.featured,
          updatedAt: new Date()
        }
      },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Property updated successfully',
      property: updatedProperty
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check ownership
    const property = await Property.findById(id);
    if (!property) {
      throw new CustomError('Property not found', 'PROPERTY_NOT_FOUND', 404);
    }

    if (property.userId.toString() !== req.userId) {
      throw new CustomError('Unauthorized to delete this property', 'UNAUTHORIZED', 403);
    }

    await Property.findByIdAndDelete(id);
    await logAction(req.userId, '', 'property_deleted', getClientIp(req), getUserAgent(req), { propertyId: id });

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    next(error);
  }
};
