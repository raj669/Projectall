# ⚡ Quick Start - 5 Minutes to Registration

## Prerequisites Check
- [ ] Node.js installed? (https://nodejs.org)
- [ ] MongoDB running? (Start: `net start MongoDB`)
- [ ] Administrator access? (May need for MongoDB)

---

## 🚀 Step 1: Setup Backend (2 minutes)

```bash
# Open terminal/PowerShell in project root
cd backend
npm install
npm run dev
```

**Expected Output**:
```
✅ Server running on http://localhost:3000
✓ Database connected
```

**Verify** in browser: http://localhost:3000/api/health
Should show: `{ "status": "OK", "timestamp": "..." }`

---

## 🚀 Step 2: Setup Frontend (1 minute)

```bash
# Open new terminal in project root
npm run dev
```

**Opens automatically**: http://localhost:5173

---

## 🧪 Step 3: Test Registration (1 minute)

1. **Go to**: http://localhost:5173/register

2. **Fill form**:
   ```
   Name: John Doe
   Email: john@example.com
   Password: SecurePass123! (must have: Upper, lower, number, special)
   ```

3. **Click**: "Create Account"

4. **Result**: ✅ Auto-redirects to /buy page

---

## 🔑 Step 4: Test Login (1 minute)

1. **Go to**: http://localhost:5173/login

2. **Notice**: Email is pre-filled! 👏

3. **Enter**: Password from registration

4. **Click**: "Sign In"

5. **Result**: ✅ Auto-redirects to /buy page

---

## ✅ Success Indicators

| Item | Status | Notes |
|------|--------|-------|
| Backend online | ✅ | http://localhost:3000/api/health |
| MongoDB connected | ✅ | Check backend console |
| Registration works | ✅ | Creates user account |
| Login works | ✅ | Authentication successful |
| Email remembered | ✅ | Pre-fills in login form |
| Password strength | ✅ | Shows visual meter |
| Rate limiting | ✅ | Try 6 attempts, see error |

---

## ❌ Troubleshooting

| Issue | Solution | Command |
|-------|----------|---------|
| Backend offline | Start backend | `cd backend && npm run dev` |
| MongoDB error | Start MongoDB | `net start MongoDB` |
| Port 3000 in use | Kill process | `netstat -ano \| findstr :3000` |
| Port 5173 in use | Use different port | `npm run dev -- --port 5174` |
| npm install fails | Clear cache | `npm cache clean --force` |

---

## 📱 Access Anywhere

```
Frontend: http://localhost:5173
Backend:  http://localhost:3000
API:      http://localhost:3000/api

Register: http://localhost:5173/register
Login:    http://localhost:5173/login
Buy:      http://localhost:5173/buy
Sell:     http://localhost:5173/sell
```

---

## 🔐 Password Requirements

✅ At least 8 characters
✅ 1 uppercase letter (A-Z)
✅ 1 lowercase letter (a-z)
✅ 1 number (0-9)
✅ 1 special character (@$!%*?&)

**Example**: `MyPassword@123`

---

## 🎯 What's Fixed

✅ Registration now works (backend was missing!)
✅ User data is remembered (email pre-fills)
✅ Security measures added (rate limiting, validation)
✅ Password strength shown (visual meter)
✅ Clear error messages (no more confusion)
✅ Backend status check (shows if offline)
✅ Scroll issue fixed (property details)
✅ Footer links fixed (no dead links)

---

## 📚 Full Documentation

- **Setup**: `BACKEND_SETUP.md`
- **Issues**: `TROUBLESHOOTING_AUTH.md`
- **Details**: `AUTH_SECURITY_FIXES.md`
- **Complete**: `REGISTRATION_FIX_COMPLETE.md`

---

## 🆘 Still Having Issues?

1. Check browser console (F12)
2. Check backend terminal for errors
3. Ensure MongoDB is running
4. See `TROUBLESHOOTING_AUTH.md`

---

## 🎉 You're All Set!

**Time to complete**: ~5 minutes
**Status**: ✅ Ready to test
**Next**: Deploy to production!

---

**Need help? See the documentation files created in the project root.**
