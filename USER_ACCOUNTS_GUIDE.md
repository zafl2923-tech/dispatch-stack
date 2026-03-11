# User Accounts & Authentication Guide

## Overview

DispatchStack now includes a comprehensive user authentication and role-based access control (RBAC) system using JWT tokens. This ensures that users can only access data they're authorized to see.

## User Roles

### 1. **Trucker**
- **Access Level**: Minimal - Own data only
- **Can Do**:
  - View their own driver profile (GET `/api/drivers/{their-id}`)
  - View trucks list (GET `/api/trucks`)
  - View companies list (GET `/api/companies`)
- **Cannot Do**:
  - List all drivers
  - Create, update, or delete any records
  - Access other drivers' data
  - Modify their own driving times (read-only access)

### 2. **Dispatcher**
- **Access Level**: Full operational access
- **Can Do**:
  - Full CRUD on drivers, trucks, and companies
  - Create trucker accounts
  - View all data
- **Cannot Do**:
  - Create admin accounts (admin only)

### 3. **Admin**
- **Access Level**: Complete system access
- **Can Do**:
  - Everything a dispatcher can do
  - Create admin, dispatcher, and trucker accounts
  - Manage all system resources

## Business Rules

### Trucker Account Rules
1. **Zero Database Write Access**: Truckers cannot create, update, or delete ANY records
2. **Own Data Only**: Truckers can only view their own driver profile
3. **Read-Only Reference Data**: Can view trucks and companies for operational context
4. **Cannot Alter Driving Times**: No write access prevents tampering with HOS data
5. **Must Link to Driver**: Every trucker account must be linked to an existing driver record

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Authorization: Bearer {admin-or-dispatcher-token}
Content-Type: application/json

{
  "username": "john.trucker",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "role": "Trucker",
  "driverId": "guid-of-existing-driver"  // Required for Trucker role
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john.trucker",
  "email": "john@example.com",
  "role": "Trucker",
  "driverId": "guid-of-existing-driver"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john.trucker",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john.trucker",
  "email": "john@example.com",
  "role": "Trucker",
  "driverId": "guid-of-existing-driver"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "user-guid",
  "username": "john.trucker",
  "email": "john@example.com",
  "role": "Trucker",
  "isActive": true,
  "driverId": "driver-guid",
  "createdAt": "2024-03-26T10:00:00Z"
}
```

### Protected Endpoints

All endpoints now require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer {your-jwt-token}
```

## Database Schema

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| Id | Guid | Primary key |
| Username | string | Unique username |
| Email | string | Unique email |
| PasswordHash | string | BCrypt hashed password |
| Role | string | "Admin", "Dispatcher", or "Trucker" |
| IsActive | bool | Account active status |
| DriverId | Guid? | Link to Driver (for Trucker role) |
| CreatedAt | DateTime | Account creation timestamp |
| UpdatedAt | DateTime | Last update timestamp |

**Indexes:**
- Unique index on `Username`
- Unique index on `Email`
- Index on `Role`

### Driver-User Relationship

- **One-to-One**: Each driver can have at most one user account
- **Optional**: Not all drivers need login access (contractors, etc.)
- **Foreign Key**: User.DriverId -> Driver.Id (nullable, set null on delete)

## Setup Instructions

### 1. Install Dependencies

The required packages are already added to `DispatchStack.Api.csproj`:
- `Microsoft.AspNetCore.Authentication.JwtBearer` v9.0.0
- `System.IdentityModel.Tokens.Jwt` v8.2.1
- `BCrypt.Net-Next` v4.0.3

### 2. Create Migration

```powershell
cd backend/DispatchStack.Api
dotnet ef migrations add AddUserAuthentication
dotnet ef database update
```

### 3. Configure JWT Settings

Update `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "DispatchStack",
    "Audience": "DispatchStack"
  }
}
```

**Production Note**: Store the JWT key in environment variables or Azure Key Vault, not in appsettings.json.

### 4. Run the Backend

```powershell
cd backend/DispatchStack.Api
dotnet run
```

### 5. Test Authentication

```powershell
.\test-auth.ps1
```

This script will:
1. Create a driver
2. Create admin, dispatcher, and trucker accounts
3. Test login for each role
4. Verify authorization rules
5. Confirm truckers can only access their own data

## Testing with PowerShell

### Create First Admin (Manual)

Since registration requires authentication, you'll need to temporarily modify the AuthController to allow the first admin to be created without authentication, or create the admin directly in the database.

**Option 1: Temporarily Remove `[Authorize]` from Register endpoint**

1. Comment out `[Authorize(Roles = "Admin,Dispatcher")]` on the Register endpoint
2. Create admin account
3. Restore the authorization attribute
4. Restart the API

**Option 2: Direct Database Insert**

```sql
INSERT INTO "Users" ("Id", "Username", "Email", "PasswordHash", "Role", "IsActive", "CreatedAt", "UpdatedAt")
VALUES (
  gen_random_uuid(),
  'admin',
  'admin@dispatchstack.com',
  '$2a$11$YourBCryptHashedPasswordHere',  -- Use BCrypt to hash 'Admin123!'
  'Admin',
  true,
  now(),
  now()
);
```

### Login and Get Token

```powershell
$loginJson = @{
    username = "admin"
    password = "Admin123!"
} | ConvertTo-Json

$response = Invoke-WebRequest `
    -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginJson `
    -UseBasicParsing

$token = ($response.Content | ConvertFrom-Json).token
```

### Use Token in Requests

```powershell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-WebRequest `
    -Uri "http://localhost:5000/api/drivers" `
    -Method GET `
    -Headers $headers `
    -UseBasicParsing
```

## Security Considerations

### Password Requirements

Currently basic validation. Consider adding:
- Minimum length (8+ characters)
- Complexity requirements (uppercase, lowercase, numbers, symbols)
- Password history (prevent reuse)
- Expiration policy

### Token Security

- **Lifetime**: Tokens expire after 7 days (configurable in AuthService)
- **Storage**: Client should store tokens securely (HttpOnly cookies or secure storage)
- **HTTPS**: Always use HTTPS in production
- **Refresh Tokens**: Consider implementing refresh tokens for better security

### Rate Limiting

Consider adding rate limiting for login attempts to prevent brute force attacks.

### Audit Logging

Future enhancement: Log all authentication attempts and access to sensitive data.

## Common Scenarios

### Scenario 1: Onboard New Trucker

1. **Dispatcher creates driver record**:
   ```powershell
   POST /api/drivers
   Authorization: Bearer {dispatcher-token}
   ```

2. **Admin/Dispatcher creates user account**:
   ```powershell
   POST /api/auth/register
   Authorization: Bearer {admin-token}
   Body: { username, email, password, role: "Trucker", driverId }
   ```

3. **Give credentials to trucker**

4. **Trucker logs in and accesses only their data**

### Scenario 2: Trucker Views Their Profile

```powershell
# Trucker logs in
POST /api/auth/login
Body: { username: "john.trucker", password: "..." }

# Get driver ID from token
GET /api/auth/me

# View own profile
GET /api/drivers/{their-driver-id}
Authorization: Bearer {trucker-token}
```

### Scenario 3: Trucker Tries to Alter Data (Blocked)

```powershell
# This will return 403 Forbidden
PUT /api/drivers/{their-driver-id}
Authorization: Bearer {trucker-token}
Body: { ... modified data ... }

# Error: "Access denied. Insufficient permissions."
```

## Troubleshooting

### Issue: "401 Unauthorized"

**Cause**: Missing or invalid token

**Solution**: 
- Ensure token is included in Authorization header
- Check token hasn't expired
- Verify token format: `Bearer {token}`

### Issue: "403 Forbidden"

**Cause**: Authenticated but insufficient permissions

**Solution**:
- Check user role matches endpoint requirements
- Verify trucker is accessing only their own data
- Confirm endpoint allows the user's role

### Issue: Cannot create first admin

**Solution**: Use one of the bootstrap methods described above:
- Temporarily disable auth on register endpoint
- Direct database insert with hashed password

### Issue: Trucker can see other drivers

**Cause**: Authorization logic error

**Solution**: 
- Verify DriversController has correct role checks
- Check DriverId claim matches requested driver ID
- Review authorization handler logic

## Next Steps

### Recommended Enhancements

1. **HOS Data Protection**: Create separate endpoints for HOS data with strict trucker read-only access
2. **Refresh Tokens**: Implement refresh token rotation for better security
3. **Password Reset**: Add forgot password / reset password flow
4. **Email Verification**: Verify email addresses on registration
5. **Two-Factor Authentication**: Add 2FA for admin accounts
6. **Audit Trail**: Log all data access and modifications
7. **Session Management**: Track active sessions and allow revocation
8. **Account Lockout**: Lock accounts after failed login attempts

## Architecture

### Authentication Flow

```
1. User sends credentials (POST /api/auth/login)
   ↓
2. AuthService validates username/password
   ↓
3. Generate JWT token with claims (userId, username, role, driverId)
   ↓
4. Return token to client
   ↓
5. Client includes token in subsequent requests
   ↓
6. JWT middleware validates token
   ↓
7. Authorization policies check role/permissions
   ↓
8. Controller action executes if authorized
```

### Authorization Flow for Truckers

```
1. Trucker requests: GET /api/drivers/{id}
   ↓
2. JWT middleware authenticates user
   ↓
3. Authorization checks role == "Trucker"
   ↓
4. Controller extracts DriverId claim from token
   ↓
5. Compares claim with requested {id}
   ↓
6. If match: Allow access
   If no match: Return 403 Forbidden
```

## Files Created/Modified

### Created
- `Models/Entities/User.cs` - User entity
- `Models/UserRoles.cs` - Role constants
- `Models/DTOs/AuthDtos.cs` - Auth request/response DTOs
- `Services/AuthService.cs` - Authentication logic
- `Controllers/AuthController.cs` - Auth endpoints
- `Authorization/SameDriverAuthorizationHandler.cs` - Custom authorization
- `test-auth.ps1` - Authentication testing script
- `USER_ACCOUNTS_GUIDE.md` - This file

### Modified
- `Program.cs` - Added JWT authentication & authorization
- `DispatchStack.Api.csproj` - Added auth packages
- `Data/DispatchStackDbContext.cs` - Added Users DbSet and configuration
- `Models/Entities/Driver.cs` - Added User navigation property
- `Controllers/DriversController.cs` - Added authorization
- `Controllers/TrucksController.cs` - Added authorization
- `Controllers/CompaniesController.cs` - Added authorization
- `appsettings.json` - Added JWT configuration

## Summary

The user authentication system ensures:
- ✅ **Truckers cannot alter driving time data** (no write access)
- ✅ **Truckers can only view their own profile** (enforced by authorization)
- ✅ **Role-based access control** (Admin, Dispatcher, Trucker)
- ✅ **JWT token authentication** (stateless, scalable)
- ✅ **Secure password storage** (BCrypt hashing)
- ✅ **One-to-one driver-user relationship** (proper data modeling)

This foundation can be extended with additional security features as needed.
