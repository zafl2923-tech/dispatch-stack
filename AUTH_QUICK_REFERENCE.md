# DispatchStack Authentication - Quick Reference

## Quick Start

### 1. First Time Setup
```powershell
# Restore packages
cd backend/DispatchStack.Api
dotnet restore

# Apply migration (if not already applied)
dotnet ef database update

# Run the API
dotnet run
```

### 2. Create First Admin
```powershell
# POST http://localhost:5000/api/auth/register
$body = @{
    username = "admin"
    email = "admin@dispatchstack.com"
    password = "Admin123!"
    role = "Admin"
} | ConvertTo-Json

$response = Invoke-WebRequest `
    -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing

($response.Content | ConvertFrom-Json).token
```

### 3. Run Automated Tests
```powershell
.\test-auth.ps1
```

## User Roles Quick Reference

| Role | Access Level | Use Case |
|------|--------------|----------|
| **Admin** | Full system access | IT administrators, system management |
| **Dispatcher** | Full operational access | Fleet managers, dispatch operations |
| **Trucker** | Own data only, read-only | Drivers, owner-operators |

## Common Commands

### Login
```powershell
$creds = @{
    username = "your_username"
    password = "your_password"
} | ConvertTo-Json

$response = Invoke-WebRequest `
    -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $creds

$token = ($response.Content | ConvertFrom-Json).token
Write-Host "Token: $token"
```

### Create Trucker Account (Admin/Dispatcher only)
```powershell
# First, create a driver
$driver = @{
    firstName = "John"
    lastName = "Doe"
    licenseNumber = "CDL-12345"
    licenseClass = "A"
    licenseCountry = "USA"
    licenseExpiryDate = "2026-12-31T00:00:00Z"
    email = "john.doe@example.com"
    phone = "555-0100"
    dateOfBirth = "1985-05-15T00:00:00Z"
    address = "123 Main St"
    city = "Austin"
    region = "TX"
    country = "USA"
    postalCode = "78701"
    employmentStatus = "Active"
    hireDate = "2020-01-01T00:00:00Z"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $adminToken"
    "Content-Type" = "application/json"
}

$driverResponse = Invoke-WebRequest `
    -Uri "http://localhost:5000/api/drivers" `
    -Method POST `
    -Headers $headers `
    -Body $driver

$driverId = ($driverResponse.Content | ConvertFrom-Json).id

# Then create user account
$user = @{
    username = "john.doe"
    email = "john.doe@example.com"
    password = "Trucker123!"
    role = "Trucker"
    driverId = $driverId
} | ConvertTo-Json

Invoke-WebRequest `
    -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -Headers $headers `
    -Body $user
```

### Make Authenticated Request
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-WebRequest `
    -Uri "http://localhost:5000/api/drivers" `
    -Method GET `
    -Headers $headers
```

### Get Current User Info
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-WebRequest `
    -Uri "http://localhost:5000/api/auth/me" `
    -Method GET `
    -Headers $headers
```

## Trucker Access Rules

### ✅ Trucker CAN:
- Login (`POST /api/auth/login`)
- View own profile (`GET /api/drivers/{their-id}`)
- View trucks list (`GET /api/trucks`)
- View specific truck (`GET /api/trucks/{id}`)
- View companies list (`GET /api/companies`)
- View specific company (`GET /api/companies/{id}`)

### ❌ Trucker CANNOT:
- List all drivers (`GET /api/drivers`)
- View other drivers' profiles (`GET /api/drivers/{other-id}`)
- Create/update/delete drivers (`POST/PUT/DELETE /api/drivers/*`)
- Create/update/delete trucks (`POST/PUT/DELETE /api/trucks/*`)
- Create/update/delete companies (`POST/PUT/DELETE /api/companies/*`)
- Create user accounts (`POST /api/auth/register`)

## Troubleshooting

### 401 Unauthorized
```
Problem: No token or invalid token
Solution: Include "Authorization: Bearer {token}" header
```

### 403 Forbidden
```
Problem: Authenticated but insufficient permissions
Solution: Check user role matches endpoint requirements
```

### "First user must be an Admin"
```
Problem: Trying to create non-admin as first user
Solution: Create admin account first, then create other users
```

### Database Connection Error
```
Problem: PostgreSQL not running
Solution: Start PostgreSQL or use Docker:
  docker-compose up -d
```

## Docker Commands

### Start PostgreSQL
```powershell
docker-compose up -d
```

### Stop PostgreSQL
```powershell
docker-compose down
```

### View Logs
```powershell
docker-compose logs -f postgres
```

## Database Commands

### Create New Migration
```powershell
cd backend/DispatchStack.Api
dotnet ef migrations add MigrationName
```

### Apply Migrations
```powershell
dotnet ef database update
```

### Rollback Migration
```powershell
dotnet ef database update PreviousMigrationName
```

### View All Users (SQL)
```sql
SELECT "Id", "Username", "Email", "Role", "DriverId", "IsActive", "CreatedAt"
FROM "Users";
```

## API Response Examples

### Successful Login
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john.doe",
  "email": "john.doe@example.com",
  "role": "Trucker",
  "driverId": "guid-value-here"
}
```

### Get Current User
```json
{
  "id": "user-guid",
  "username": "john.doe",
  "email": "john.doe@example.com",
  "role": "Trucker",
  "isActive": true,
  "driverId": "driver-guid",
  "createdAt": "2024-03-26T10:00:00Z"
}
```

### 403 Error (Forbidden)
```json
{
  "message": "Access denied. Insufficient permissions."
}
```

## JWT Token Format

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload (Claims):
{
  "nameid": "user-guid",
  "unique_name": "username",
  "email": "user@example.com",
  "role": "Trucker",
  "DriverId": "driver-guid-or-empty",
  "nbf": timestamp,
  "exp": timestamp,
  "iss": "DispatchStack",
  "aud": "DispatchStack"
}
```

## Configuration

### appsettings.json
```json
{
  "Jwt": {
    "Key": "YourSecretKeyHere",
    "Issuer": "DispatchStack",
    "Audience": "DispatchStack"
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=dispatchstack;Username=postgres;Password=postgres"
  }
}
```

### Environment Variables (Production)
```bash
JWT__KEY=YourProductionSecretKey
ConnectionStrings__DefaultConnection=YourProductionConnectionString
```

## Testing Checklist

- [ ] First admin can register without token
- [ ] Subsequent registrations require authentication
- [ ] Login returns valid JWT token
- [ ] Token works in Authorization header
- [ ] Trucker can view own driver profile
- [ ] Trucker cannot view other drivers
- [ ] Trucker cannot list all drivers
- [ ] Trucker cannot create/update/delete records
- [ ] Trucker can view trucks (read-only)
- [ ] Trucker can view companies (read-only)
- [ ] Dispatcher can access all resources
- [ ] Admin can create all types of accounts

## Support

For detailed documentation, see:
- `USER_ACCOUNTS_GUIDE.md` - Complete authentication guide
- `AUTHENTICATION_IMPLEMENTATION.md` - Implementation summary
- `DATABASE_GUIDE.md` - Database setup and structure

For testing:
- Run `.\test-auth.ps1` - Automated authentication tests
- Run `.\test-api.ps1` - General API tests
