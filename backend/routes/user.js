import express from 'express';
import { getProfile, updateProfile, deleteAccount } from '../controllers/userController.js';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/propertyController.js';
import { auth } from '../middleware/auth.js';
import { updateProfileValidation, favoriteValidation } from '../middleware/validation.js';

const router = express.Router();

router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfileValidation, updateProfile);
router.delete('/me', auth, deleteAccount);

router.get('/favorites', auth, getFavorites);
router.post('/favorites/:propertyId', auth, favoriteValidation, addFavorite);
router.delete('/favorites/:propertyId', auth, favoriteValidation, removeFavorite);

export default router;
