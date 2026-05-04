# Registration & Login Troubleshooting Guide

## ❌ Error: "Backend server is offline"

**Cause**: The backend Node.js/Express server is not running.

**Solution**:
```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies (first time only)
npm install

# 3. Start backend server
npm run dev
```

**Verify**: Visit http://localhost:3000/api/health - You should see:
```json
{ "status": "OK", "timestamp": "..." }
```

---

## ❌ Error: "Cannot connect to MongoDB"

**Cause**: MongoDB database is not running or misconfigured.

### Option 1: Local MongoDB (Recommended for Development)

```bash
# Windows - Start MongoDB service
net start MongoDB

# Mac - Start MongoDB
brew services start mongodb-community

# Linux - Start MongoDB
sudo systemctl start mongod
```

**Verify**: 
```bash
mongosh  # or mongo
> show databases
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string
4. Update `backend/.env`:
   ```
   DB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/real-estate?retryWrites=true&w=majority
   ```

---

## ❌ Error: "Email already registered"

**Cause**: You're trying to register with an email that already exists.

**Solution**:
- Use a different email address
- OR login with that email if you already created an account

---

## ❌ Error: "Invalid email or password" (Login)

**Cause**: Incorrect credentials.

**Check**:
- Ensure email is spelled correctly
- Ensure CAPS LOCK is off
- Password is case-sensitive

**If you forgot password**:
- Currently, no password reset implemented
- Create new account with different email

---

## ❌ Error: "CORS Error" / "Failed to fetch"

**Cause**: Frontend can't communicate with backend.

**Check**:
1. Backend is running: http://localhost:3000/api/health
2. Frontend is on: http://localhost:5173
3. Backend `.env` has correct FRONTEND_URL:
   ```
   FRONTEND_URL=http://localhost:5173
   ```

**Solution**:
```bash
# Kill any process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Restart backend
npm run dev
```

---

## ❌ Error: "Too many registration attempts"

**Cause**: Rate limiting - you've tried to register too many times in 1 hour.

**Solution**:
- Wait 1 hour before trying again
- OR clear browser localStorage and try again:
  ```javascript
  // Open browser console (F12) and run:
  localStorage.removeItem('registration_attempts');
  ```

---

## ✅ Successful Registration & Login Flow

1. **Navigate to** http://localhost:5173/register
2. **Fill form**:
   - Name: Your full name
   - Email: your@email.com
   - Password: Must have:
     - At least 8 characters
     - 1 uppercase letter (A-Z)
     - 1 lowercase letter (a-z)
     - 1 number (0-9)
     - 1 special character (@$!%*?&)
3. **Submit** - Account created!
4. **Auto-redirect** to /buy page
5. **Next time** - Go to http://localhost:5173/login
6. **Pre-filled** email will be remembered

---

## 🔐 Security Features

✅ **Passwords are encrypted** with bcrypt (12 salt rounds)
✅ **JWT tokens** for session management
✅ **Rate limiting** prevents brute force attacks (5 attempts/hour)
✅ **Password strength validation** enforced
✅ **Session data** stored securely (cleared on browser close)
✅ **Audit logging** tracks all auth events
✅ **CORS protection** blocks unauthorized domains

---

## 📝 Quick Start Checklist

- [ ] MongoDB is running (check with `mongosh`)
- [ ] Backend dependencies installed (`npm install` in backend folder)
- [ ] Backend server running (`npm run dev`)
- [ ] Backend health check passes (http://localhost:3000/api/health)
- [ ] Frontend running (http://localhost:5173)
- [ ] Can access registration page
- [ ] Can create account with valid password
- [ ] Auto-redirects to /buy on success

---

## 🆘 Still Having Issues?

Check backend console for error messages:
```bash
# Terminal where backend is running should show:
✅ Server running on http://localhost:3000
✓ Database connected to: mongodb://localhost:27017/real-estate
```

**Common Backend Errors**:
- `ECONNREFUSED` = MongoDB not running
- `EADDRINUSE` = Port 3000 already in use
- `CastError` = Database schema issue

---

## 💾 User Data Storage

**Registration data stored in**:
- `sessionStorage` - Cleared when browser closes (secure)
- `localStorage.lastRegisteredEmail` - For login convenience

**Never stored**:
- Passwords (hashed on backend)
- Tokens (stored in memory)
- Sensitive user info

---

## 🚀 Production Deployment

Before deploying:

1. **Update `.env`**:
   ```
   NODE_ENV=production
   JWT_SECRET=<generate-random-secret>
   JWT_REFRESH_SECRET=<generate-random-secret>
   DB_URI=<mongodb-atlas-connection>
   PORT=<production-port>
   ```

2. **Generate secure secrets**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Enable HTTPS** in production

4. **Use environment variables** (not .env file)

5. **Set up monitoring** for authentication events
