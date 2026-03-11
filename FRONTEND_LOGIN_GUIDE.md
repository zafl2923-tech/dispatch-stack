# Frontend Login System - Quick Start Guide

## Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Make sure `frontend/.env.local` has the correct API URL:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start Backend API
```bash
cd backend/DispatchStack.Api
dotnet run
```

### 4. Start Frontend
```bash
cd frontend
npm run dev
```

### 5. Access the Application
Open browser: `http://localhost:3000`

You'll be automatically redirected to the login page.

## First Login

### Create Admin Account (Backend)
Use PowerShell to create the first admin:

```powershell
$body = @{
    username = "admin"
    email = "admin@dispatchstack.com"
    password = "Admin123!"
    role = "Admin"
} | ConvertTo-Json

Invoke-WebRequest `
    -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing
```

### Login via Frontend
1. Navigate to `http://localhost:3000` (auto-redirects to `/login`)
2. Enter:
   - Username: `admin`
   - Password: `Admin123!`
3. Click "Sign In"
4. You'll be redirected to the Admin Dashboard

## User Roles & Dashboards

| Role | Username | Dashboard | Access Level |
|------|----------|-----------|--------------|
| **Admin** | admin | `/admin-dashboard` | Full system access |
| **Dispatcher** | dispatcher1 | `/dispatcher-dashboard` | Full operational access |
| **Trucker** | john.trucker | `/trucker-dashboard` | Own data only |

## Creating Additional Users

### Via Frontend (Future Feature)
User management UI coming soon.

### Via Backend API
Use the test script or manual API calls:
```powershell
# Run the auth test script
.\test-auth.ps1
```

## Testing the Security

### Test 1: Unauthorized Access
1. Open incognito window
2. Try accessing: `http://localhost:3000/admin-dashboard`
3. **Expected**: Redirected to `/login`

### Test 2: Role-Based Access
1. Login as Trucker
2. Try accessing: `http://localhost:3000/admin-dashboard`
3. **Expected**: Redirected to `/trucker-dashboard`

### Test 3: Token Expiry
1. Login successfully
2. Open DevTools → Application → Session Storage
3. Delete `dispatch_token`
4. Refresh any protected page
5. **Expected**: Redirected to `/login`

### Test 4: XSS Prevention
1. In username field, enter: `<script>alert('XSS')</script>`
2. Submit login
3. **Expected**: No alert, `<>` characters removed

## Common Issues

### Issue: "Cannot connect to API"
**Solution**: Make sure backend is running on port 5000
```bash
cd backend/DispatchStack.Api
dotnet run
```

### Issue: "Invalid credentials"
**Solution**: Create admin account first (see "Create Admin Account" above)

### Issue: "Redirects in loop"
**Solution**: 
1. Clear browser cache
2. Delete all items in Session Storage
3. Close and reopen browser

### Issue: "Token expired immediately"
**Solution**: 
1. Check system clock is correct
2. Backend and frontend should be on same machine/network
3. Check CORS settings in backend

## File Structure

```
frontend/src/
├── app/
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── trucker-dashboard/
│   │   └── page.tsx              # Trucker dashboard
│   ├── dispatcher-dashboard/
│   │   └── page.tsx              # Dispatcher dashboard
│   ├── admin-dashboard/
│   │   └── page.tsx              # Admin dashboard
│   ├── layout.tsx                # Root layout with AuthProvider
│   └── globals.css               # Global styles + animations
├── components/
│   └── ProtectedRoute.tsx        # Route protection wrapper
├── contexts/
│   └── AuthContext.tsx           # Authentication context
└── lib/
    └── auth.ts                   # Auth utilities & API client
```

## Key Security Features

### ✅ What's Protected
- All routes except `/login` require authentication
- Role-based access enforced
- Tokens automatically expire
- Input sanitization prevents XSS
- API client handles token injection

### ✅ What Hackers Can't Do
- Access protected pages without login
- View other users' data (Trucker role)
- Steal tokens from localStorage (using sessionStorage)
- Execute malicious scripts (input sanitization)
- Brute force passwords (BCrypt slows attempts)
- Bypass role restrictions (enforced on backend)

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | User authentication |
| `/api/auth/me` | GET | Get current user info |
| `/api/auth/register` | POST | Create new user (Admin/Dispatcher only) |

## Environment Variables

### Development (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Production
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

## Customization

### Change Token Expiry
Edit `frontend/src/lib/auth.ts`:
```typescript
TokenStorage.set(response.token, 7); // 7 days
// Change to desired number of days
```

### Customize Login Page
Edit `frontend/src/app/login/page.tsx`:
- Colors, logo, text
- Add company branding
- Modify form fields

### Add New Dashboard
1. Create `frontend/src/app/your-dashboard/page.tsx`
2. Wrap in `<ProtectedRoute requiredRoles={['Role']}>`
3. Add navigation in other dashboards

## Testing Script

Create test users for all roles:
```powershell
# Run the authentication test script
.\test-auth.ps1
```

This creates:
- 1 Admin account
- 1 Dispatcher account  
- 1 Trucker account (linked to driver)

## Next Steps

1. **User Management UI**: Build admin interface to create/edit users
2. **Profile Pages**: Allow users to view/edit their profiles
3. **Password Reset**: Implement forgot password flow
4. **2FA**: Add two-factor authentication for admins
5. **Audit Logs**: Track login attempts and user actions

## Support

For detailed security information, see:
- `FRONTEND_SECURITY.md` - Comprehensive security documentation
- `USER_ACCOUNTS_GUIDE.md` - Backend authentication guide
- `AUTH_QUICK_REFERENCE.md` - Backend API reference

## Troubleshooting Commands

### Clear All Session Data
Open browser console:
```javascript
sessionStorage.clear();
location.reload();
```

### Check Token
```javascript
console.log(sessionStorage.getItem('dispatch_token'));
console.log(sessionStorage.getItem('dispatch_user'));
```

### Test API Connection
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'Admin123!' })
})
.then(r => r.json())
.then(console.log);
```

---

**Your frontend is now secure and ready for deployment!** 🎉
