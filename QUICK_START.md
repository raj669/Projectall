# ⚡ Quick Start Guide

## What's Ready

Your **complete secure real estate system** with backend and frontend is ready to run!

---

## 1️⃣ Start MongoDB

**Local (if installed):**
```bash
mongod
```

**Cloud (MongoDB Atlas):**
- Create free cluster: https://www.mongodb.com/cloud/atlas
- Copy connection string
- Update `backend/.env` with `DB_URI`

---

## 2️⃣ Start Backend

```bash
cd backend
npm install
npm run dev
```

✅ Backend runs on `http://localhost:3000`

---

## 3️⃣ Start Frontend

```bash
npm install
npm run dev
```

✅ Frontend runs on `http://localhost:5173`

---

## 4️⃣ Test It!

1. Open http://localhost:5173 in browser
2. Click "Sign Up"
3. Create account (password must have uppercase, lowercase, number, special char)
4. See password strength indicator
5. Login
6. Browse "Buy" section - see all properties
7. Go to "Sell" section - add your first property
8. Click heart icon on Buy page to favorite properties

---

## 📁 Key Files

### Backend
- `backend/server.js` - Main server
- `backend/.env` - Configuration (UPDATE THIS!)
- `backend/SETUP.md` - Full backend guide
- `backend/models/` - Database schemas
- `backend/routes/` - API endpoints
- `backend/controllers/` - Business logic

### Frontend
- `src/pages/auth/Login.jsx` - Login page
- `src/pages/auth/Register.jsx` - Registration
- `src/pages/Buy.jsx` - Browse & favorite properties
- `src/pages/Sell.jsx` - Manage listings
- `src/lib/AuthContext.jsx` - Auth state management (UPDATED)
- `src/lib/apiClient.js` - API calls (NEW)
- `src/components/ProtectedRoute.jsx` - Route protection (NEW)

---

## 🔑 Key Features

### Authentication ✅
- Register with email + strong password
- Login with email + password
- Logout
- Automatic token refresh
- Protected routes

### Buy Section ✅
- Browse published properties
- Filter by city, type, price, bedrooms
- Add/remove favorites
- View property details

### Sell Section ✅
- View your listings
- Add new property with images
- Edit existing properties
- Delete properties
- Track views

### Security ✅
- Bcrypt password hashing
- JWT tokens
- Rate limiting (login protected)
- Input validation
- HTTP-only cookies
- CORS protection
- Audit logging

---

## 🔒 Default Credentials (For Testing)

After first `npm run dev`, create test account:
- Email: test@example.com
- Password: TestPass123!

---

## 🚨 Important - Update Before Production

**Backend `.env`:**
```bash
# Change these!
JWT_SECRET=<use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
JWT_REFRESH_SECRET=<use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">

# Set correct URLs
FRONTEND_URL=your-frontend-url
DB_URI=your-mongodb-uri (if using cloud)
NODE_ENV=production
```

---

## 📊 API Testing

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"j@test.com","password":"SecurePass123!"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"j@test.com","password":"SecurePass123!"}'
```

(Copy `accessToken` from response)

### Get Properties
```bash
curl http://localhost:3000/api/properties
```

### Add Property (Protected)
```bash
curl -X POST http://localhost:3000/api/user/properties \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"3BR Home",
    "type":"house",
    "status":"sale",
    "price":500000,
    "bedrooms":3,
    "bathrooms":2,
    "area":1500,
    "areaUnit":"sqft",
    "city":"Kathmandu",
    "address":"Downtown",
    "contactPhone":"+977123456"
  }'
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB error | Install MongoDB or use MongoDB Atlas |
| Port 3000 in use | Change `PORT` in `.env` |
| CORS error | Check `FRONTEND_URL` in backend `.env` |
| npm modules error | Delete `node_modules` & `package-lock.json`, run `npm install` |
| Localhost not resolving | Try `127.0.0.1` instead of `localhost` |

---

## 📖 Full Documentation

- Detailed guide: `backend/SETUP.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
- Architecture plan: `.claude/plans/resilient-cooking-planet.md`

---

## ✨ What's Next?

1. ✅ Get it running (this guide)
2. ✅ Test features (buy, sell, favorites)
3. ⬜ Add email verification
4. ⬜ Add password reset
5. ⬜ Deploy to production

---

**Ready? Start MongoDB and run `npm run dev` in both `backend/` and root directories!** 🚀
