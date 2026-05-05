#!/usr/bin/env node

/**
 * Database Seeding Script
 * Adds demo properties to MongoDB
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Property Model
const propertySchema = new mongoose.Schema({
  title: String,
  type: String,
  status: String,
  price: Number,
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  area_unit: String,
  city: String,
  district: String,
  address: String,
  featured: Boolean,
  listed_date: Date,
  contact_phone: String,
  images: [String],
  features: [String],
  description: String,
  seller: {
    name: String,
    phone: String,
    email: String,
    agency: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Property = mongoose.model('Property', propertySchema);

async function seedDatabase() {
  try {
    console.log('\n========================================');
    console.log('  Database Seeding Script');
    console.log('========================================\n');

    // Connect to MongoDB
    const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/real-estate';
    console.log('📦 Connecting to MongoDB...');
    console.log(`   URI: ${dbUri}\n`);

    await mongoose.connect(dbUri);
    console.log('✅ Connected to MongoDB\n');

    // Check if properties already exist
    const count = await Property.countDocuments();
    if (count > 0) {
      console.log(`⚠️  Database already has ${count} properties`);
      console.log('   Skipping seed to avoid duplicates\n');
      await mongoose.connection.close();
      console.log('✅ Done!\n');
      return;
    }

    console.log('📥 Creating demo properties...\n');

    // Demo properties hardcoded here
    const demoProperties = [
      {
        title: 'Modern 3BHK Apartment in Thamel',
        type: 'apartment',
        status: 'sale',
        price: 8500000,
        bedrooms: 3,
        bathrooms: 2,
        area: 1200,
        area_unit: 'sqft',
        city: 'Kathmandu',
        district: 'Kathmandu',
        address: 'Thamel Marg, Ward 26, Kathmandu Metropolitan City',
        featured: true,
        published: true,
        listed_date: new Date('2026-01-15'),
        contact_phone: '+977-980-1234567',
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
        ],
        features: ['Covered Parking', '24/7 Security', 'Balcony', 'Modern Kitchen'],
        description: 'Beautiful 3BHK apartment in Thamel with modern amenities.',
        seller: { name: 'Ramesh Shrestha', phone: '+977-980-1234567', email: 'ramesh@nepalestates.com', agency: 'NepalEstates' }
      },
      {
        title: 'Cozy 2BHK House in Jhamsikhel',
        type: 'house',
        status: 'sale',
        price: 12000000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1500,
        area_unit: 'sqft',
        city: 'Lalitpur',
        district: 'Lalitpur',
        address: 'Jhamsikhel, Lalitpur',
        featured: true,
        published: true,
        listed_date: new Date('2026-02-20'),
        contact_phone: '+977-981-9876543',
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
        ],
        features: ['Garden', 'Parking', 'Natural Light'],
        description: 'Spacious 2BHK house perfect for families.',
        seller: { name: 'Priya Sharma', phone: '+977-981-9876543', email: 'priya@nepalestates.com', agency: 'NepalEstates' }
      },
      {
        title: 'Luxury 4BHK Villa in Bhaktapur',
        type: 'villa',
        status: 'sale',
        price: 25000000,
        bedrooms: 4,
        bathrooms: 3,
        area: 3000,
        area_unit: 'sqft',
        city: 'Bhaktapur',
        district: 'Bhaktapur',
        address: 'Dudhpati, Bhaktapur',
        featured: true,
        published: true,
        listed_date: new Date('2026-01-10'),
        contact_phone: '+977-982-5555555',
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
        ],
        features: ['Pool', 'Garden', 'Gate', 'Parking'],
        description: 'Luxurious villa with stunning views.',
        seller: { name: 'Suresh Gurung', phone: '+977-982-5555555', email: 'suresh@nepalestates.com', agency: 'NepalEstates' }
      },
      {
        title: 'Furnished Studio near Pulchowk Campus',
        type: 'apartment',
        status: 'rent',
        price: 18000,
        bedrooms: 1,
        bathrooms: 1,
        area: 450,
        area_unit: 'sqft',
        city: 'Lalitpur',
        district: 'Lalitpur',
        address: 'Pulchowk, Lalitpur',
        featured: false,
        published: true,
        listed_date: new Date('2026-03-18'),
        contact_phone: '+977-982-6601234',
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
        ],
        features: ['Furnished', 'WiFi', 'Kitchen'],
        description: 'Perfect for students and working professionals.',
        seller: { name: 'Maya Joshi', phone: '+977-982-6601234', email: 'maya@nepalestates.com', agency: 'NepalEstates' }
      },
      {
        title: 'Commercial Space in Kamaladi',
        type: 'commercial',
        status: 'rent',
        price: 45000,
        bedrooms: 0,
        bathrooms: 2,
        area: 800,
        area_unit: 'sqft',
        city: 'Kathmandu',
        district: 'Kathmandu',
        address: 'Kamaladi, Kathmandu',
        featured: false,
        published: true,
        listed_date: new Date('2026-02-28'),
        contact_phone: '+977-980-7776666',
        images: [
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
        ],
        features: ['Display Window', 'Storage', 'Parking'],
        description: 'Prime commercial location for retail or office.',
        seller: { name: 'Arjun Thapa', phone: '+977-980-7776666', email: 'arjun@nepalestates.com', agency: 'NepalEstates' }
      }
    ];

    console.log(`➕ Adding ${demoProperties.length} demo properties...\n`);

    const result = await Property.insertMany(demoProperties);
    console.log(`✅ Successfully added ${result.length} properties!\n`);

    // Show summary
    const stats = await Property.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } }
    ]);

    console.log('📊 Properties by City:');
    stats.forEach(stat => {
      console.log(`   • ${stat._id}: ${stat.count} properties`);
    });

    console.log('\n========================================');
    console.log('✅ Seeding Complete!');
    console.log('========================================\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
