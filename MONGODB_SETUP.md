# MongoDB Setup Guide

## ⚠️ The Problem

Backend shows "offline" because **MongoDB is not running**.

Backend needs MongoDB to start. If MongoDB isn't available, the server exits immediately.

---

## ✅ Solution 1: Start MongoDB Service (Windows)

### If MongoDB is Already Installed

Open Command Prompt **as Administrator** and run:

```bash
net start MongoDB
```

**You should see**:
```
The MongoDB service is starting.
The MongoDB service was started successfully.
```

---

## ✅ Solution 2: Install MongoDB Community Edition

### Download & Install

1. Go to: https://www.mongodb.com/try/download/community
2. Select **Windows** and **MSI** format
3. Download the installer
4. Run installer with default settings
5. MongoDB will be installed as a Windows service

### Start MongoDB Service

```bash
net start MongoDB
```

---

## ✅ Solution 3: Use MongoDB Atlas (Cloud - No Installation)

### Best for Testing - Free!

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free M0 cluster
4. Get connection string
5. Update `backend/.env`:
   ```
   DB_URI=mongodb+srv://username:password@cluster.mongodb.net/real-estate?retryWrites=true&w=majority
   ```
6. Backend will automatically connect to cloud MongoDB

---

## 🔍 Verify MongoDB is Running

### Method 1: Windows Service Check
```bash
sc query MongoDB
```

Should show:
```
STATE              : 4  RUNNING
```

### Method 2: Try to Connect
```bash
mongosh
```

If you see `>` prompt, MongoDB is running!

---

## 📋 Complete Startup Steps

### 1. Ensure MongoDB is Running
```bash
net start MongoDB
# or check if already running: sc query MongoDB
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Start Backend
```bash
npm run dev
```

Wait for:
```
✅ Server running on http://localhost:3000
✓ Database connected to: mongodb://localhost:27017/real-estate
```

### 4. In New Terminal: Start Frontend
```bash
cd ..
npm run dev
```

### 5. Test
Open: http://localhost:5173/register

---

## 🚀 Easy Way: Use STARTUP.bat

Just double-click: **`STARTUP.bat`**

This will:
- ✅ Check MongoDB
- ✅ Start MongoDB if needed
- ✅ Install backend dependencies
- ✅ Start backend
- ✅ Start frontend
- ✅ Open browser

---

## ❌ If Still Not Working

### Check Backend Errors

Run backend manually and watch the terminal:

```bash
cd backend
npm run dev
```

**Common Errors**:

**Error**: `ECONNREFUSED - Connection refused`
- **Solution**: MongoDB not running. Run `net start MongoDB`

**Error**: `Port 3000 in use`
- **Solution**: Kill process on port 3000 or use different port

**Error**: `Cannot find module`
- **Solution**: Run `npm install` in backend folder

---

## 📞 Still Stuck?

### Try This Order

1. Restart your computer (clears everything)
2. Open Command Prompt **as Administrator**
3. Run: `net start MongoDB`
4. Wait 5 seconds
5. Double-click: **`STARTUP.bat`**
6. Open: http://localhost:5173/register

---

## 🎯 What Should Happen

**Backend Terminal** shows:
```
✅ Server running on http://localhost:3000
✓ Database connected
```

**Frontend Terminal** shows:
```
VITE ready in 200ms
➜ Local: http://localhost:5173
```

**Browser** at `http://localhost:5173/register` shows registration form without "Backend offline" error

---

**If you have MongoDB Atlas**, update `backend/.env` with your connection string instead of using local MongoDB.

---

**Next Step**: 
1. Ensure MongoDB is running: `net start MongoDB`
2. Double-click: `STARTUP.bat`
3. Everything will start automatically!
