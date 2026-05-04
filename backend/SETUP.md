# Backend Setup & Deployment Guide

## Prerequisites
- Node.js 16+ and npm
- MongoDB (local or cloud - MongoDB Atlas recommended)
- Git

## Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

**Important:** Change the JWT secrets in production:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start MongoDB
**Local MongoDB:**
```bash
mongod
```

**Cloud (MongoDB Atlas):**
- Create cluster at https://www.mongodb.com/cloud/atlas
- Update `DB_URI` in `.env` with connection string

### 4. Start Backend Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3000`

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

### Buy (Browse Properties)
- `GET /api/properties?city=&type=&priceMin=&priceMax=&bedrooms=&page=&limit=` - List published properties
- `GET /api/properties/:id` - Get property details
- `GET /api/user/favorites` - Get favorited properties (protected)
- `POST /api/user/favorites/:propertyId` - Add to favorites (protected)
- `DELETE /api/user/favorites/:propertyId` - Remove from favorites (protected)

### Sell (Manage Listings)
- `GET /api/user/properties` - Get user's properties (protected)
- `GET /api/user/properties/:id` - Get specific property (protected)
- `POST /api/user/properties` - Create property (protected)
- `PUT /api/user/properties/:id` - Update property (protected)
- `DELETE /api/user/properties/:id` - Delete property (protected)

### User
- `GET /api/user/me` - Get profile (protected)
- `PUT /api/user/me` - Update profile (protected)
- `DELETE /api/user/me` - Delete account (protected)

---

## Security Features Implemented

✅ **Password Security**
- Bcrypt hashing (12 salt rounds)
- Strong password requirements (8+ chars, uppercase, lowercase, number, special char)

✅ **Authentication**
- JWT tokens (15-minute access, 7-day refresh)
- HTTP-only, Secure, SameSite cookies
- Automatic token refresh on expiry

✅ **Authorization**
- Auth middleware on protected routes
- User can only access/modify own data
- Ownership verification on property CRUD

✅ **Input Validation**
- express-validator on all endpoints
- Zod schemas for complex objects
- Prevents SQL/NoSQL injection, malicious input

✅ **Rate Limiting**
- 5 login attempts per 15 minutes
- 100 general requests per hour per user
- 3 registration attempts per hour per IP

✅ **Security Headers**
- Helmet.js: HSTS, CSP, X-Frame-Options, etc.
- CORS restricted to frontend URL only
- No sensitive data in responses

✅ **XSS Protection**
- Input sanitization on backend
- Frontend uses DOMPurify (already installed)

✅ **File Upload Security**
- MIME type validation (jpg, png, webp only)
- File size limits (5MB per image, 40MB total)
- File signature validation
- UUID-based file renaming

✅ **Logging & Monitoring**
- Audit logs for: login, logout, failed login, property actions
- Log rotation (30-day auto-delete)
- IP address and User-Agent tracking
- No password/token logging

✅ **Data Protection**
- Passwords never returned in responses
- User fields like password excluded from queries
- Unique indexes on critical fields (email)
- MongoDB injection protection via Mongoose

---

## Testing the System

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Create Property (Protected)
```bash
curl -X POST http://localhost:3000/api/user/properties \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beautiful 3BR Apartment",
    "type": "apartment",
    "status": "sale",
    "price": 500000,
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 1500,
    "areaUnit": "sqft",
    "city": "Kathmandu",
    "address": "Downtown Area",
    "contactPhone": "+977-1234567890",
    "description": "Modern apartment with great location"
  }'
```

---

## Frontend Setup

1. Install frontend dependencies:
```bash
npm install
```

2. Update `.env` with backend URL:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

3. Start frontend dev server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Production Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables on hosting platform
2. Connect MongoDB Atlas database
3. Update `FRONTEND_URL` for CORS
4. Change NODE_ENV to `production`
5. Use strong JWT secrets (generate with crypto)

### Frontend (Vercel/Netlify)
1. Update API URL to production backend
2. Deploy with your provider
3. Set environment variables

### HTTPS
- All cookies require HTTPS in production
- Use SSL certificate (Let's Encrypt free option)

---

## Troubleshooting

**MongoDB Connection Error**
- Check MongoDB is running
- Verify DB_URI in .env
- For MongoDB Atlas, whitelist your IP

**CORS Error**
- Ensure FRONTEND_URL in backend .env matches actual frontend URL
- Check request headers include `Content-Type: application/json`

**Token Expired**
- Frontend automatically refreshes token
- Check browser cookies are enabled

**Rate Limited (429 Error)**
- Wait 15 minutes for login, 1 hour for general requests
- Check IP address in headers

---

## Database Seed (Optional)

To populate test data:
```bash
npm run seed  # (create this script for testing)
```

---

## Security Best Practices for Production

1. ✅ Use environment variables (NEVER commit secrets)
2. ✅ Enable HTTPS only
3. ✅ Use strong JWT secrets (32+ chars, random)
4. ✅ Regular security updates (`npm audit`)
5. ✅ Monitor audit logs regularly
6. ✅ Set up backup strategy for MongoDB
7. ✅ Use rate limiting (already configured)
8. ✅ Enable firewall rules
9. ✅ Implement request logging/monitoring
10. ✅ Consider Web Application Firewall (WAF)

---

## Next Steps

**Optional Enhancements:**
- [ ] Email verification on registration
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Image upload to cloud storage (AWS S3, Cloudinary)
- [ ] Email notifications
- [ ] Admin moderation system
- [ ] User messaging/inquiry management
- [ ] Payment integration (Stripe, Khalti)
- [ ] Analytics dashboard

---

## Support & Questions

Refer to plan file: `C:\Users\rajal\.claude\plans\resilient-cooking-planet.md`
