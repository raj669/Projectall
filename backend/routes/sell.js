import express from 'express';
import { getUserProperties, getUserPropertyById, createProperty, updateProperty, deleteProperty } from '../controllers/sellController.js';
import { auth } from '../middleware/auth.js';
import { propertyValidation } from '../middleware/validation.js';

const router = express.Router();

router.get('/properties', auth, getUserProperties);
router.get('/properties/:id', auth, getUserPropertyById);
router.post('/properties', auth, propertyValidation, createProperty);
router.put('/properties/:id', auth, propertyValidation, updateProperty);
router.delete('/properties/:id', auth, deleteProperty);

export default router;
