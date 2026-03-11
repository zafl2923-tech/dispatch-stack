# Company User Accounts - Complete Implementation Guide

## ✅ What Was Implemented

Successfully added **Company role** for shipping and receiving companies with restricted access to cargo and GPS data only for their own shipments.

## 🎯 Business Rules

### Company Account Access
✅ **Can View (Read-Only)**:
- Cargo type, weight, and description
- Real-time GPS location of truck
- Driver name (first and last)
- Truck unit number
- Shipment status and timeline
- Origin and destination details

✅ **Restrictions**:
- Can ONLY see shipments where they are either **Shipping Company** OR **Receiving Company**
- Cannot see other companies' shipments
- Read-only access (no create/update/delete)
- Cannot access drivers, trucks, or other companies APIs
- Cannot view driver personal details beyond name

✅ **Both shipping and receiving companies see the same data** for a shared shipment

## 📊 Database Schema

### New Table: Shipments
```sql
CREATE TABLE "Shipments" (
    "Id" uuid PRIMARY KEY,
    "ShipmentNumber" varchar(50) UNIQUE NOT NULL,
    
    -- Links
    "DriverId" uuid NOT NULL,
    "TruckId" uuid NOT NULL,
    "ShippingCompanyId" uuid NOT NULL,
    "ReceivingCompanyId" uuid NOT NULL,
    
    -- Cargo (visible to companies)
    "CargoType" varchar(100) NOT NULL,
    "CargoWeight" decimal(18,2) NOT NULL,
    "CargoDescription" varchar(500),
    
    -- GPS tracking (visible to companies)
    "CurrentLatitude" double precision,
    "CurrentLongitude" double precision,
    "LastLocationUpdate" timestamp,
    
    -- Journey details
    "OriginAddress" text,
    "OriginCity" text,
    "OriginRegion" text,
    "OriginCountry" text,
    "DestinationAddress" text,
    "DestinationCity" text,
    "DestinationRegion" text,
    "DestinationCountry" text,
    
    -- Status tracking
    "Status" varchar(50) NOT NULL,  -- "Pending", "InTransit", "Delivered", "Cancelled"
    "PickupTime" timestamp,
    "EstimatedDeliveryTime" timestamp,
    "ActualDeliveryTime" timestamp,
    "CreatedAt" timestamp NOT NULL,
    "UpdatedAt" timestamp NOT NULL,
    
    FOREIGN KEY ("DriverId") REFERENCES "Drivers"("Id") ON DELETE RESTRICT,
    FOREIGN KEY ("TruckId") REFERENCES "Trucks"("Id") ON DELETE RESTRICT,
    FOREIGN KEY ("ShippingCompanyId") REFERENCES "Companies"("Id") ON DELETE RESTRICT,
    FOREIGN KEY ("ReceivingCompanyId") REFERENCES "Companies"("Id") ON DELETE RESTRICT
);

CREATE UNIQUE INDEX "IX_Shipments_ShipmentNumber" ON "Shipments"("ShipmentNumber");
CREATE INDEX "IX_Shipments_Status" ON "Shipments"("Status");
CREATE INDEX "IX_Shipments_ShippingCompanyId" ON "Shipments"("ShippingCompanyId");
CREATE INDEX "IX_Shipments_ReceivingCompanyId" ON "Shipments"("ReceivingCompanyId");
```

### Updated Table: Users
```sql
-- Added company linking
ALTER TABLE "Users" ADD COLUMN "CompanyId" uuid;
CREATE UNIQUE INDEX "IX_Users_CompanyId" ON "Users"("CompanyId");
ALTER TABLE "Users" ADD CONSTRAINT "FK_Users_Companies_CompanyId" 
    FOREIGN KEY ("CompanyId") REFERENCES "Companies"("Id") ON DELETE SET NULL;
```

## 🔐 User Roles Summary

| Role | Access Level | Use Case |
|------|--------------|----------|
| **Admin** | Full system | IT administrators |
| **Dispatcher** | Full operational | Fleet managers |
| **Trucker** | Own data only | Drivers |
| **Company** | Own shipments only | Shipping/Receiving companies |

## 📝 API Endpoints (Next Phase)

### Shipments API (To Be Created)
```http
# List company's shipments
GET /api/shipments
Authorization: Bearer {company-token}
Response: Array of ShipmentDto (filtered by company)

# Get specific shipment
GET /api/shipments/{id}
Authorization: Bearer {company-token}
Response: ShipmentDto (only if company is involved)

# Create shipment (Dispatcher/Admin only)
POST /api/shipments
Authorization: Bearer {dispatcher-token}
Body: CreateShipmentDto

# Update GPS location (Driver/Trucker only - future)
PUT /api/shipments/{id}/location
Authorization: Bearer {trucker-token}
Body: { latitude, longitude }

# Update status (Dispatcher only)
PUT /api/shipments/{id}/status
Authorization: Bearer {dispatcher-token}
Body: { status: "InTransit" }
```

## 🚀 How to Use

### 1. Create Company Record
```powershell
# Admin/Dispatcher creates company
POST http://localhost:5000/api/companies
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "companyName": "ACME Shipping Co",
  "companyType": "Exporter",
  "businessNumber": "123456789",
  "taxId": "TAX-001",
  "address": "100 Shipping Lane",
  "city": "Houston",
  "region": "TX",
  "country": "USA",
  "postalCode": "77001",
  "contactName": "John Manager",
  "contactEmail": "contact@acmeshipping.com",
  "contactPhone": "555-0200",
  "exportLicenseNumber": "EXP-12345",
  "exportLicenseExpiryDate": "2027-12-31T00:00:00Z",
  "usmcaStatus": "Certified"
}

# Returns: { "id": "company-guid", ... }
```

### 2. Create Company User Account
```powershell
# Admin/Dispatcher creates login for company
POST http://localhost:5000/api/auth/register
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "username": "acme.shipping",
  "email": "admin@acmeshipping.com",
  "password": "Shipping123!",
  "role": "Company",
  "companyId": "company-guid-from-step-1"
}

# Returns: { "token": "...", "role": "Company", "companyId": "..." }
```

### 3. Company Logs In
```powershell
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "acme.shipping",
  "password": "Shipping123!"
}

# Returns JWT token with CompanyId claim
```

### 4. Create Shipment (Dispatcher)
```powershell
POST http://localhost:5000/api/shipments
Authorization: Bearer {dispatcher-token}
Content-Type: application/json

{
  "shipmentNumber": "SHIP-2024-001",
  "driverId": "driver-guid",
  "truckId": "truck-guid",
  "shippingCompanyId": "acme-guid",
  "receivingCompanyId": "receiver-guid",
  "cargoType": "Electronics",
  "cargoWeight": 5000.50,
  "cargoDescription": "Consumer electronics - fragile",
  "originAddress": "100 Warehouse Rd",
  "originCity": "Houston",
  "originRegion": "TX",
  "originCountry": "USA",
  "destinationAddress": "200 Receiving St",
  "destinationCity": "Mexico City",
  "destinationRegion": "CDMX",
  "destinationCountry": "Mexico",
  "pickupTime": "2024-03-26T08:00:00Z",
  "estimatedDeliveryTime": "2024-03-28T16:00:00Z"
}
```

### 5. Company Views Their Shipments
```powershell
GET http://localhost:5000/api/shipments
Authorization: Bearer {company-token}

# Returns only shipments where:
# - ShippingCompanyId == company's ID, OR
# - ReceivingCompanyId == company's ID
```

### 6. Track Shipment GPS
```powershell
GET http://localhost:5000/api/shipments/SHIP-2024-001
Authorization: Bearer {company-token}

# Returns:
{
  "id": "...",
  "shipmentNumber": "SHIP-2024-001",
  "driverName": "John Trucker",
  "truckUnitNumber": "TRUCK-101",
  "cargoType": "Electronics",
  "cargoWeight": 5000.50,
  "currentLatitude": 29.7604,
  "currentLongitude": -95.3698,
  "lastLocationUpdate": "2024-03-26T14:30:00Z",
  "status": "InTransit",
  "estimatedDeliveryTime": "2024-03-28T16:00:00Z"
}
```

## 🔒 Authorization Matrix

| Endpoint | Admin | Dispatcher | Trucker | Company |
|----------|-------|------------|---------|---------|
| `POST /api/auth/register` (Company) | ✅ | ✅ | ❌ | ❌ |
| `GET /api/shipments` | ✅ | ✅ | ❌ | ✅ (own only) |
| `GET /api/shipments/{id}` | ✅ | ✅ | ❌ | ✅ (own only) |
| `POST /api/shipments` | ✅ | ✅ | ❌ | ❌ |
| `PUT /api/shipments/{id}/location` | ✅ | ✅ | ✅ | ❌ |
| `PUT /api/shipments/{id}/status` | ✅ | ✅ | ❌ | ❌ |
| `DELETE /api/shipments/{id}` | ✅ | ✅ | ❌ | ❌ |
| `GET /api/drivers` | ✅ | ✅ | ❌ | ❌ |
| `GET /api/trucks` | ✅ | ✅ | ✅ | ❌ |
| `GET /api/companies` | ✅ | ✅ | ✅ | ❌ |

## 📁 Files Created/Modified

### ✅ Created
1. `backend/DispatchStack.Api/Models/Entities/Shipment.cs`
2. `backend/DispatchStack.Api/Models/DTOs/ShipmentDto.cs`
3. `COMPANY_ACCOUNTS_IMPLEMENTATION.md`
4. `COMPANY_ACCOUNTS_COMPLETE_GUIDE.md` (this file)

### ✅ Modified
1. `backend/DispatchStack.Api/Models/UserRoles.cs` - Added Company role
2. `backend/DispatchStack.Api/Models/Entities/User.cs` - Added CompanyId field
3. `backend/DispatchStack.Api/Models/Entities/Company.cs` - Added User navigation
4. `backend/DispatchStack.Api/Models/DTOs/AuthDtos.cs` - Added CompanyId to all auth DTOs
5. `backend/DispatchStack.Api/Services/AuthService.cs` - Added Company registration and JWT claims
6. `backend/DispatchStack.Api/Data/DispatchStackDbContext.cs` - Added Shipments table configuration

### ✅ Database
- **Migration Created**: `20260311154959_AddCompanyUsersAndShipments`
- **Migration Applied**: ✅ Successfully
- **New Table**: `Shipments`
- **Updated Table**: `Users` (added CompanyId column)

## ⏳ Next Steps (To Complete Company Accounts)

### Required Components

#### 1. ShipmentService (CRUD with authorization)
```csharp
public interface IShipmentService
{
    Task<IEnumerable<Shipment>> GetShipmentsForCompanyAsync(Guid companyId);
    Task<Shipment?> GetShipmentByIdAsync(Guid id, Guid? companyId = null);
    Task<Shipment> CreateAsync(Shipment shipment);
    Task<Shipment?> UpdateLocationAsync(Guid id, double latitude, double longitude);
    Task<Shipment?> UpdateStatusAsync(Guid id, string status);
}
```

#### 2. ShipmentsController
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ShipmentsController : ControllerBase
{
    // GET /api/shipments - filtered by role
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShipmentDto>>> GetShipments()
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        var companyIdClaim = User.FindFirst("CompanyId")?.Value;
        
        if (role == "Company" && !string.IsNullOrEmpty(companyIdClaim))
        {
            // Return only shipments for this company
            var companyId = Guid.Parse(companyIdClaim);
            var shipments = await _shipmentService.GetShipmentsForCompanyAsync(companyId);
            return Ok(shipments.Select(MapToDto));
        }
        
        // Admin/Dispatcher see all
        // ... implementation
    }
}
```

#### 3. Authorization Handler
```csharp
public class CompanyShipmentRequirement : IAuthorizationRequirement { }

public class CompanyShipmentHandler : AuthorizationHandler<CompanyShipmentRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        CompanyShipmentRequirement requirement)
    {
        var role = context.User.FindFirst(ClaimTypes.Role)?.Value;
        
        if (role == "Admin" || role == "Dispatcher")
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
        
        if (role == "Company")
        {
            var companyIdClaim = context.User.FindFirst("CompanyId")?.Value;
            // Verify shipment involves this company
            // ... implementation
        }
        
        context.Fail();
        return Task.CompletedTask;
    }
}
```

#### 4. Frontend Company Dashboard
```typescript
// /app/company-dashboard/page.tsx
<ProtectedRoute requiredRoles={['Company']}>
  <div>
    <h1>Company Dashboard</h1>
    <ShipmentList companyId={user.companyId} />
    <GPSTrackingMap shipments={shipments} />
  </div>
</ProtectedRoute>
```

## 🧪 Testing Guide

### Create Test Data

#### 1. Create Companies
```powershell
# Shipping company
POST /api/companies
{
  "companyName": "ACME Shipping",
  "companyType": "Exporter",
  ...
}
# Save ID: $shippingCompanyId

# Receiving company  
POST /api/companies
{
  "companyName": "MexiCo Imports",
  "companyType": "Importer",
  ...
}
# Save ID: $receivingCompanyId
```

#### 2. Create Company User Accounts
```powershell
# Shipping company account
POST /api/auth/register
{
  "username": "acme.shipping",
  "email": "admin@acmeshipping.com",
  "password": "Shipping123!",
  "role": "Company",
  "companyId": "$shippingCompanyId"
}

# Receiving company account
POST /api/auth/register
{
  "username": "mexico.imports",
  "email": "admin@mexicoimports.com",
  "password": "Imports123!",
  "role": "Company",
  "companyId": "$receivingCompanyId"
}
```

#### 3. Create Shipment
```powershell
POST /api/shipments
Authorization: Bearer {dispatcher-token}
{
  "shipmentNumber": "SHIP-001",
  "driverId": "{existingDriverId}",
  "truckId": "{existingTruckId}",
  "shippingCompanyId": "$shippingCompanyId",
  "receivingCompanyId": "$receivingCompanyId",
  "cargoType": "Electronics",
  "cargoWeight": 5000.50,
  "cargoDescription": "Consumer electronics",
  "originAddress": "100 Warehouse Rd",
  "originCity": "Houston",
  "originRegion": "TX",
  "originCountry": "USA",
  "destinationAddress": "200 Receiving St",
  "destinationCity": "Mexico City",
  "destinationRegion": "CDMX",
  "destinationCountry": "Mexico",
  "pickupTime": "2024-03-26T08:00:00Z",
  "estimatedDeliveryTime": "2024-03-28T16:00:00Z"
}
```

#### 4. Test Company Access
```powershell
# Login as ACME Shipping
POST /api/auth/login
{
  "username": "acme.shipping",
  "password": "Shipping123!"
}
# Save token: $acmeToken

# View their shipments
GET /api/shipments
Authorization: Bearer $acmeToken
# Should return SHIP-001 (they are the shipping company)

# Login as MexiCo Imports
POST /api/auth/login
{
  "username": "mexico.imports",
  "password": "Imports123!"
}
# Save token: $mexicoToken

# View their shipments
GET /api/shipments
Authorization: Bearer $mexicoToken
# Should return SHIP-001 (they are the receiving company)

# Create unrelated company and verify no access
POST /api/companies { "companyName": "Other Co", ... }
POST /api/auth/register { "username": "other", "role": "Company", "companyId": "..." }
POST /api/auth/login { "username": "other", ... }
GET /api/shipments
# Should return empty array (not involved in any shipments)
```

## 🔐 Security Implementation

### Authorization Layers

#### Layer 1: Route Protection
```csharp
[Authorize] // All endpoints require authentication
```

#### Layer 2: Role-Based Access
```csharp
[Authorize(Roles = "Admin,Dispatcher")] // Only admins and dispatchers
```

#### Layer 3: Company-Specific Data Filtering
```csharp
// In ShipmentService.GetShipmentsForCompanyAsync
var shipments = await _context.Shipments
    .Where(s => s.ShippingCompanyId == companyId || s.ReceivingCompanyId == companyId)
    .ToListAsync();
```

#### Layer 4: Individual Shipment Access Check
```csharp
// In ShipmentService.GetShipmentByIdAsync
var shipment = await _context.Shipments.FindAsync(id);
if (companyId.HasValue)
{
    // Verify company is involved in shipment
    if (shipment.ShippingCompanyId != companyId && shipment.ReceivingCompanyId != companyId)
    {
        return null; // Company not authorized
    }
}
```

### Data Filtering

**What Companies See:**
```json
{
  "shipmentNumber": "SHIP-001",
  "driverName": "John Trucker",        // ✅ Name only
  "truckUnitNumber": "TRUCK-101",      // ✅ Unit number only
  "cargoType": "Electronics",          // ✅ Full cargo details
  "cargoWeight": 5000.50,              // ✅
  "currentLatitude": 29.7604,          // ✅ Real-time GPS
  "currentLongitude": -95.3698,        // ✅
  "status": "InTransit"                // ✅ Shipment status
}
```

**What Companies DON'T See:**
- ❌ Driver personal information (address, DOB, license details)
- ❌ Driver employment details (hire date, status)
- ❌ Truck maintenance records
- ❌ Truck VIN, license plate, fuel capacity
- ❌ Other companies' shipments
- ❌ Other companies' contact details
- ❌ Hours of Service (HOS) data

## 📊 Use Cases

### Use Case 1: Shipping Company Tracks Outbound Cargo
```
1. ACME Shipping logs in
2. Views shipments list (filtered to their shipments)
3. Clicks on SHIP-001
4. Sees real-time GPS location of truck
5. Sees cargo is "Electronics, 5000.50 kg"
6. Sees status is "InTransit"
7. Sees ETA is "March 28, 4:00 PM"
```

### Use Case 2: Receiving Company Monitors Inbound Delivery
```
1. MexiCo Imports logs in
2. Views shipments list (same SHIP-001 visible)
3. Clicks on SHIP-001
4. Sees exact same data as shipping company
5. Tracks truck approaching their facility
6. Prepares receiving dock based on cargo details
```

### Use Case 3: Company Tries to Access Unauthorized Data (Blocked)
```
1. ACME Shipping logs in
2. Tries GET /api/shipments/{other-company-shipment-id}
3. Returns 404 Not Found (or 403 Forbidden)
4. Tries GET /api/drivers
5. Returns 403 Forbidden
6. Tries POST /api/shipments
7. Returns 403 Forbidden
```

## 🛡️ Security Checklist

### ✅ Implemented
- [x] Company role added to system
- [x] User-Company one-to-one relationship
- [x] Shipment entity with company relationships
- [x] CompanyId in JWT claims
- [x] Registration validation for companies
- [x] Database migration applied

### ⏳ To Implement
- [ ] ShipmentService with authorization
- [ ] ShipmentsController with role checks
- [ ] Authorization handler for shipment access
- [ ] Frontend company dashboard
- [ ] GPS tracking map component
- [ ] Real-time location updates (SignalR or polling)
- [ ] Test script for company accounts

## 🎨 Frontend Dashboard (Planned)

### Company Dashboard Features
1. **Shipments List**
   - Active shipments (InTransit)
   - Pending pickups
   - Delivered shipments (last 30 days)
   - Filters by status

2. **GPS Tracking Map**
   - Real-time truck locations
   - Route visualization
   - ETA calculations
   - Geofencing alerts

3. **Shipment Details**
   - Cargo information
   - Driver and truck info
   - Timeline (pickup → delivery)
   - Status updates

4. **Notifications**
   - Pickup completed
   - Border crossing alerts
   - Delivery approaching
   - Delivered confirmation

## 🚀 Quick Start Commands

### Stop Backend (if running)
```powershell
# Press Ctrl+C in terminal running dotnet
```

### Build Project
```powershell
cd backend/DispatchStack.Api
dotnet build
```

### Create Migration (✅ Already Done)
```powershell
dotnet ef migrations add AddCompanyUsersAndShipments
```

### Apply Migration (✅ Already Done)
```powershell
dotnet ef database update
```

### Start Backend
```powershell
dotnet run
```

### Test Company Registration
```powershell
# See test-auth.ps1 for automated tests
.\test-auth.ps1
```

## 📚 Documentation

- **Setup**: `COMPANY_ACCOUNTS_IMPLEMENTATION.md`
- **Complete Guide**: `COMPANY_ACCOUNTS_COMPLETE_GUIDE.md` (this file)
- **Auth System**: `USER_ACCOUNTS_GUIDE.md`
- **Frontend**: `FRONTEND_LOGIN_GUIDE.md`

## 🎉 Summary

### ✅ Phase 1 Complete (Database & Auth)
- Company role created
- Shipment tracking entity created
- User-Company linking implemented
- Database migration applied successfully
- JWT authentication updated for companies

### 🔜 Phase 2 (Next Session)
- Shipment service and controller
- Authorization handlers
- Frontend company dashboard
- GPS tracking map
- Testing scripts

---

**Company accounts foundation is complete! The database and authentication system now support company users with restricted access to shipment cargo and GPS data.** 🚢📦🗺️
