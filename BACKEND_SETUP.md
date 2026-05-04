# Backend Setup Guide

## Prerequisites
- Node.js (v16+)
- MongoDB running locally OR MongoDB Atlas account
- npm or yarn

## Installation & Running

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure MongoDB
- **Local Development (Default)**: MongoDB should be running on `localhost:27017`
  - Install MongoDB Community Edition
  - Start MongoDB service
  
- **Or use MongoDB Atlas**:
  - Create account at https://www.mongodb.com/cloud/atlas
  - Update `.env` file: `DB_URI=mongodb+srv://username:password@cluster.mongodb.net/real-estate`

### 3. Start Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on: **http://localhost:3000**

### 4. Verify Backend is Running
Visit: http://localhost:3000/api/health

You should see: `{ "status": "OK", "timestamp": "..." }`

## Environment Variables (.env)

| Variable | Value | Notes |
|----------|-------|-------|
| DB_URI | mongodb://localhost:27017/real-estate | Local MongoDB |
| JWT_SECRET | your_secret_key | Change in production! |
| JWT_REFRESH_SECRET | your_refresh_secret | Change in production! |
| NODE_ENV | development | Use 'production' for deployment |
| PORT | 3000 | Backend server port |
| FRONTEND_URL | http://localhost:5173 | Frontend URL for CORS |

## Security Features Implemented
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ JWT authentication with access & refresh tokens
- ✅ CORS protection
- ✅ Helmet for security headers
- ✅ Rate limiting on login/register
- ✅ Password validation (8+ chars, uppercase, lowercase, number, special char)
- ✅ Audit logging for auth events
- ✅ Secure cookie handling for refresh tokens

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `net start MongoDB` (Windows) or `brew services start mongodb-community` (Mac)
- Check DB_URI in .env file
- Try using MongoDB Atlas instead of local

### "Backend not responding"
- Check if port 3000 is in use: `netstat -ano | findstr :3000`
- Kill process: `taskkill /PID <PID> /F`
- Restart backend: `npm run dev`

### "Cors Error from Frontend"
- Ensure FRONTEND_URL in .env matches your frontend URL
- Default: `http://localhost:5173`

## API Endpoints

### Auth Routes
- POST `/api/auth/register` - Create account
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- POST `/api/auth/refresh` - Refresh access token

### Protected Routes
- GET `/api/user/profile` - Get user profile
- PUT `/api/user/profile` - Update profile

## Next Steps
1. Start MongoDB
2. Run: `npm run dev` in backend folder
3. Verify server is running at http://localhost:3000/api/health
4. Frontend will auto-connect to backend at http://localhost:3000/api
