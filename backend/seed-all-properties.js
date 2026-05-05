#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Property from './models/Property.js';
import { DEMO_PROPERTIES } from '../src/lib/demoProperties.js';

dotenv.config();

const DEFAULT_DB_URI = 'mongodb://localhost:27017/real-estate';
const DEMO_OWNER_EMAIL = 'demo.owner@nepalestates.com';
const DEMO_OWNER_PASSWORD = 'DemoOwner@12345';

const normalizeAreaUnit = (value) => {
  if (value === 'sqm' || value === 'aana') return value;
  return 'sqft';
};

const toPropertyDoc = (demo, userId) => ({
  userId,
  title: demo.title,
  type: demo.type,
  status: demo.status,
  price: Number(demo.price || 0),
  bedrooms: Number(demo.bedrooms || 0),
  bathrooms: Number(demo.bathrooms || 0),
  area: Number(demo.area || 0),
  areaUnit: normalizeAreaUnit(demo.area_unit || demo.areaUnit),
  city: demo.city || 'Unknown',
  district: demo.district || null,
  address: demo.address || 'Unknown address',
  description: demo.description || '',
  contactPhone: demo.contact_phone || demo.seller?.phone || '+977-1-4234567',
  images: Array.isArray(demo.images) ? demo.images : [],
  features: Array.isArray(demo.features) ? demo.features : [],
  featured: Boolean(demo.featured),
  published: true,
  createdAt: demo.listed_date ? new Date(demo.listed_date) : new Date(),
  updatedAt: new Date()
});

async function getOrCreateDemoOwner() {
  let user = await User.findOne({ email: DEMO_OWNER_EMAIL });
  if (user) return user;

  user = await User.create({
    name: 'Demo Property Owner',
    email: DEMO_OWNER_EMAIL,
    password: DEMO_OWNER_PASSWORD,
    phone: '+977-980-0000000'
  });

  return user;
}

async function seedAllProperties() {
  const dbUri = process.env.DB_URI || DEFAULT_DB_URI;
  console.log('Connecting to MongoDB...');
  await mongoose.connect(dbUri);

  try {
    const owner = await getOrCreateDemoOwner();
    const ops = DEMO_PROPERTIES.map((demo) => ({
      updateOne: {
        filter: { title: demo.title, address: demo.address },
        update: { $set: toPropertyDoc(demo, owner._id) },
        upsert: true
      }
    }));

    const result = await Property.bulkWrite(ops, { ordered: false });
    const total = await Property.countDocuments({ published: true });

    console.log(`Upserted demo properties: ${result.upsertedCount || 0}`);
    console.log(`Modified existing properties: ${result.modifiedCount || 0}`);
    console.log(`Total published backend properties: ${total}`);
  } finally {
    await mongoose.connection.close();
  }
}

seedAllProperties()
  .then(() => {
    console.log('All demo properties are now in backend.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  });
