import User from '../models/User.js';
import { CustomError } from '../middleware/errorHandler.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      throw new CustomError('User not found', 'USER_NOT_FOUND', 404);
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { name, phone, updatedAt: new Date() } },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new CustomError('User not found', 'USER_NOT_FOUND', 404);
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
      throw new CustomError('User not found', 'USER_NOT_FOUND', 404);
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};
