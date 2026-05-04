/**
 * API service for making HTTP requests
 * Uses the base44 client for authentication
 */

import { base44 } from '@/api/base44Client';
import { DEMO_PROPERTIES } from '@/lib/demoProperties';

class PropertyService {
  /**
   * Fetch all properties with optional filters
   */
  static async getProperties(params = {}) {
    try {
      // This would typically call an API endpoint
      // For now, return mock data
      return Promise.resolve({
        data: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
      });
    } catch (error) {
      throw new Error(`Failed to fetch properties: ${error.message}`);
    }
  }

  /**
   * Fetch a single property by ID
   */
  static async getProperty(id) {
    if (String(id).startsWith('demo-')) {
      const demo = DEMO_PROPERTIES.find((p) => p.id === id);
      if (demo) return demo;
      throw new Error('Property not found.');
    }
    try {
      return await base44.entities.Property.get(id);
    } catch (error) {
      throw new Error(`Failed to fetch property: ${error.message}`);
    }
  }

  /**
   * Create a new property
   */
  static async createProperty(data) {
    try {
      return Promise.resolve({ id: 1, ...data });
    } catch (error) {
      throw new Error(`Failed to create property: ${error.message}`);
    }
  }

  /**
   * Update a property
   */
  static async updateProperty(id, data) {
    try {
      return Promise.resolve({ id, ...data });
    } catch (error) {
      throw new Error(`Failed to update property: ${error.message}`);
    }
  }

  /**
   * Delete a property
   */
  static async deleteProperty(id) {
    try {
      return Promise.resolve({ success: true, id });
    } catch (error) {
      throw new Error(`Failed to delete property: ${error.message}`);
    }
  }
}

class InquiryService {
  /**
   * Fetch all inquiries
   */
  static async getInquiries(params = {}) {
    try {
      return Promise.resolve({
        data: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
      });
    } catch (error) {
      throw new Error(`Failed to fetch inquiries: ${error.message}`);
    }
  }

  /**
   * Submit a new inquiry
   */
  static async submitInquiry(data) {
    try {
      return Promise.resolve({ id: 1, ...data, status: 'new' });
    } catch (error) {
      throw new Error(`Failed to submit inquiry: ${error.message}`);
    }
  }

  /**
   * Update inquiry status
   */
  static async updateInquiryStatus(id, status) {
    try {
      return Promise.resolve({ id, status });
    } catch (error) {
      throw new Error(`Failed to update inquiry: ${error.message}`);
    }
  }
}

class UserService {
  /**
   * Fetch current user profile
   */
  static async getProfile() {
    try {
      const user = await base44.auth.me();
      return user;
    } catch (error) {
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(data) {
    try {
      return Promise.resolve({ success: true, ...data });
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  /**
   * Fetch all users (admin only)
   */
  static async getUsers(params = {}) {
    try {
      return Promise.resolve({
        data: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
      });
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  /**
   * Delete a user (admin only)
   */
  static async deleteUser(id) {
    try {
      return Promise.resolve({ success: true, id });
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}

export { PropertyService, InquiryService, UserService };
