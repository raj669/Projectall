import Property from '../models/Property.js';
import Favorite from '../models/Favorite.js';
import { CustomError } from '../middleware/errorHandler.js';

export const getAllProperties = async (req, res, next) => {
  try {
    const { city, type, status, priceMin, priceMax, bedrooms, page = 1, limit = 20 } = req.query;

    const filter = { published: true };

    if (city) filter.city = { $regex: city, $options: 'i' };
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };

    const skip = (Number(page) - 1) * Number(limit);

    const properties = await Property.find(filter)
      .populate('userId', 'name phone email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Property.countDocuments(filter);

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

export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('userId', 'name phone email');

    if (!property) {
      throw new CustomError('Property not found', 'PROPERTY_NOT_FOUND', 404);
    }

    // Increment views
    property.views = (property.views || 0) + 1;
    await property.save();

    res.json({ property });
  } catch (error) {
    next(error);
  }
};

export const getFavorites = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const favorites = await Favorite.find({ userId: req.userId })
      .populate({
        path: 'propertyId',
        select: 'title type status price bedrooms bathrooms area city images featured views'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Favorite.countDocuments({ userId: req.userId });

    res.json({
      favorites,
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

export const addFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      throw new CustomError('Property not found', 'PROPERTY_NOT_FOUND', 404);
    }

    // Check if already favorited
    const existing = await Favorite.findOne({ userId: req.userId, propertyId });
    if (existing) {
      throw new CustomError('Property already in favorites', 'ALREADY_FAVORITED', 400);
    }

    const favorite = new Favorite({ userId: req.userId, propertyId });
    await favorite.save();

    res.status(201).json({ message: 'Added to favorites', favorite });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const result = await Favorite.findOneAndDelete({ userId: req.userId, propertyId });
    if (!result) {
      throw new CustomError('Favorite not found', 'FAVORITE_NOT_FOUND', 404);
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    next(error);
  }
};
