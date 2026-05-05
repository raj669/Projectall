# Deployment Guide - Vercel Multi-Service Deployment

## Overview
This project consists of:
- **Frontend**: Vite + React app served from root (`/`)
- **Backend**: Express.js API served from `/_/backend` (proxied to backend routes)

## Prerequisites
1. Vercel account (https://vercel.com)
2. GitHub repository connected to Vercel
3. MongoDB Atlas account for production database

## Step-by-Step Deployment

### 1. Prepare MongoDB Atlas
- Create a MongoDB Atlas cluster (free tier available)
- Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database_name`
- Whitelist Vercel IP addresses in Network Access

### 2. Set Environment Variables in Vercel
In your Vercel project settings, add these environment variables:

```
# Backend
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/real-estate
JWT_SECRET=<generate-strong-random-secret>
JWT_REFRESH_SECRET=<generate-strong-random-secret>
NODE_ENV=production
FRONTEND_URL=https://your-project.vercel.app

# Frontend
VITE_API_BASE_URL=/_/backend/api
VITE_ANTHROPIC_API_KEY=<your-key-if-needed>
```

Generate secure secrets with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Deploy via GitHub
1. Push changes to GitHub
2. Vercel automatically detects and deploys
3. Frontend builds first, then backend

### 4. Verify Deployment

**Frontend Check:**
```
https://your-project.vercel.app/
```

**Backend Health Check:**
```
https://your-project.vercel.app/_/backend/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-05-05T..."
}
```

## Troubleshooting

### Frontend not loading
- Check `VITE_API_BASE_URL` is set correctly
- Verify dist folder exists in build output

### Backend returning 502/503
- Check MongoDB connection string in `DB_URI`
- Verify MongoDB whitelist includes Vercel IP
- Check environment variables are set in Vercel dashboard

### CORS errors
- Verify `FRONTEND_URL` matches your Vercel domain
- Check CORS headers in backend/server.js

### API calls failing
- Test with: `curl https://your-project.vercel.app/_/backend/api/health`
- Check backend logs in Vercel dashboard
- Verify JWT_SECRET matches across deployments

## File Structure for Deployment

```
root/
├── dist/              # Frontend build output
├── src/              # Frontend source
├── backend/
│   ├── server.js     # Express entry point
│   ├── vercel.json   # Backend config
│   └── ...
├── vercel.json       # Root config for routing
├── package.json      # Frontend dependencies
└── vite.config.js
```

## Important Notes

1. **First Deployment**: Takes 2-5 minutes as Vercel builds and deploys both services
2. **Database Seeding**: Run seed script locally before deployment:
   ```bash
   cd backend && npm run seed:all
   ```
3. **Environment Secrets**: Never commit `.env` files; use Vercel dashboard
4. **Route Prefix**: Backend API is served at `/_/backend` - update frontend config if needed

## Rolling Back
If deployment fails:
1. Go to Vercel dashboard
2. Select desired previous deployment
3. Click "Redeploy"

## Monitoring

Monitor deployment health in Vercel dashboard:
- Function logs at `/_/backend/*`
- Frontend deployment status
- Build duration and output

## Support
For issues specific to Vercel, refer to:
- https://vercel.com/docs
- https://vercel.com/docs/deployments/overview
