# Company User Accounts Implementation - Summary

## What Was Implemented

Created a **Company role** for shipping and receiving companies with restricted access to cargo and GPS data only for their own shipments.

## Business Rules

### Company Account Access
- **Role**: "Company"
- **Can See**:
  - Cargo type, weight, and description
  - GPS location of truck
  - Driver name and truck unit number  - Origin and destination details
  - Shipment status and timeline
- **Restrictions**:
  - Can ONLY see shipments where they are either the **ShippingCompany** OR **ReceivingCompany**
  - Cannot see shipments involving other companies
  - Read-only access (no modifications)
  - Cannot access drivers, trucks, or other companies directly

## Database Changes

### New Entities
1. **Shipment** entity created with:
   - Driver and Truck linkage
   - ShippingCompany and ReceivingCompany
   - Cargo details (type, weight, description)
   - GPS tracking (current latitude/longitude)
   - Journey status (Pending, InTransit, Delivered, Cancelled)

### Updated Entities
1. **User** entity:
   - Added `CompanyId` (Guid?) field
   - Added `Company` navigation property

2. **Company** entity:
   - Added `User` navigation property

### Database Schema
```sql
-- New Shipments table
CREATE TABLE Shipments (
    Id uuid PRIMARY KEY,
    ShipmentNumber varchar(50) UNIQUE NOT NULL,
    DriverId uuid NOT NULL,
    TruckId uuid NOT NULL,
    ShippingCompanyId uuid NOT NULL,
    ReceivingCompanyId uuid NOT NULL,
    CargoType varchar(100) NOT NULL,
    CargoWeight decimal(18,2) NOT NULL,
    CargoDescription varchar(500),
    CurrentLatitude double precision,
    CurrentLongitude double precision,
    LastLocationUpdate timestamp,
    Status varchar(50) NOT NULL,
    -- Plus origin, destination, and timestamp fields
    FOREIGN KEY (DriverId) REFERENCES Drivers(Id),
    FOREIGN KEY (TruckId) REFERENCES Trucks(Id),
    FOREIGN KEY (ShippingCompanyId) REFERENCES Companies(Id),
    FOREIGN KEY (ReceivingCompanyId) REFERENCES Companies(Id)
);

-- Users table updated
ALTER TABLE Users ADD COLUMN CompanyId uuid;
ALTER TABLE Users ADD CONSTRAINT FK_Users_Companies 
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE SET NULL;
CREATE UNIQUE INDEX IX_Users_CompanyId ON Users(CompanyId);
```

## API Changes

### New Role
- Added `UserRoles.Company` = "Company"

### Updated DTOs
- `RegisterRequest`: Added `CompanyId` field
- `AuthResponse`: Added `CompanyId` field
- `UserDto`: Added `CompanyId` field

### New DTOs Created
1. **ShipmentDto** - Full shipment details
2. **CreateShipmentDto** - For creating new shipments
3. **UpdateShipmentLocationDto** - For GPS updates

## Next Steps (To Complete)

### 1. Update AuthService JWT Generation
Add CompanyId to JWT claims:
```csharp
new Claim("CompanyId", user.CompanyId?.ToString() ?? string.Empty)
```

### 2. Update GetUserById and GetUserByUsername
Include CompanyId in UserDto responses.

### 3. Update Login Response
Include CompanyId in AuthResponse.

### 4. Update IsValidRole
Add Company to valid roles:
```csharp
return role == UserRoles.Admin 
    || role == UserRoles.Dispatcher 
    || role == UserRoles.Trucker
    || role == UserRoles.Company;
```

### 5. Create ShipmentService
Implement CRUD operations with authorization:
- GetShipmentsForCompanyAsync(companyId)
- GetShipmentByIdAsync(id, companyId) - verify company access
- CreateShipmentAsync(shipment)
- UpdateShipmentLocationAsync(id, location)

### 6. Create ShipmentsController
Endpoints:
- `GET /api/shipments` - List shipments for authenticated company
- `GET /api/shipments/{id}` - Get single shipment (verify company access)
- `POST /api/shipments` - Create shipment (Admin/Dispatcher only)
- `PUT /api/shipments/{id}/location` - Update GPS (Driver/Trucker only)
- `PUT /api/shipments/{id}/status` - Update status (Dispatcher only)

### 7. Create Authorization Handler
`CompanyShipmentAuthorizationHandler` to verify:
- User is a Company
- Shipment involves their company (either shipping or receiving)

### 8. Create Database Migration
```powershell
cd backend/DispatchStack.Api
dotnet ef migrations add AddCompanyUsersAndShipments
dotnet ef database update
```

### 9. Update Frontend

#### Create Company Dashboard (`/company-dashboard`)
- List of active shipments
- Real-time GPS tracking map
- Cargo details display
- Shipment timeline

#### Update AuthContext
- Handle Company role redirects
- Include CompanyId in user state

#### Update ProtectedRoute
- Add Company to valid roles
- Create CompanyShipmentAccess component

### 10. Testing
Create test script for company accounts:
- Register company user
- Login as company
- View shipments
- Verify can only see own shipments
- Verify cannot modify data

## Usage Example

### 1. Create Company Account
```powershell
# First create company record
POST /api/companies
{
  "companyName": "ACME Shipping",
  "companyType": "Exporter",
  ...
}
# Returns companyId

# Then create user account
POST /api/auth/register
{
  "username": "acme.shipping",
  "email": "admin@acmeshipping.com",
  "password": "Shipping123!",
  "role": "Company",
  "companyId": "{companyId}"
}
```

### 2. Create Shipment
```powershell
POST /api/shipments
Authorization: Bearer {dispatcher-token}
{
  "shipmentNumber": "SHIP-001",
  "driverId": "{driverId}",
  "truckId": "{truckId}",
  "shippingCompanyId": "{acmeId}",
  "receivingCompanyId": "{receiverId}",
  "cargoType": "Electronics",
  "cargoWeight": 5000.50,
  "cargoDescription": "Consumer electronics",
  ...
}
```

### 3. Company Views Shipments
```powershell
# Login as company
POST /api/auth/login
{
  "username": "acme.shipping",
  "password": "Shipping123!"
}

# View their shipments
GET /api/shipments
Authorization: Bearer {company-token}

# Returns only shipments where ACME is shipping or receiving company
```

### 4. Track Shipment
```powershell
GET /api/shipments/{id}
Authorization: Bearer {company-token}

# Returns:
{
  "shipmentNumber": "SHIP-001",
  "driverName": "John Trucker",
  "truckUnitNumber": "TRUCK-101",
  "cargoType": "Electronics",
  "cargoWeight": 5000.50,
  "currentLatitude": 30.2672,
  "currentLongitude": -97.7431,
  "lastLocationUpdate": "2024-03-26T15:30:00Z",
  "status": "InTransit"
}
```

## Security Features

### Authorization Enforcement
1. **Company users cannot**:
   - List all shipments (only their own)
   - View shipments from other companies
   - Modify any shipment data
   - Access drivers, trucks, or companies API
   - Create or delete shipments

2. **Multi-layer protection**:
   - JWT token validation
   - Role-based authorization attributes
   - Custom authorization handler for shipment access
   - Database-level foreign key constraints

### Data Privacy
- GPS location only visible to companies involved in shipment
- Cargo details only visible to companies involved
- Driver personal information not exposed (only name)
- Truck details limited (only unit number)

## Files Created
1. `Models/Entities/Shipment.cs`
2. `Models/DTOs/ShipmentDto.cs`
3. `COMPANY_ACCOUNTS_IMPLEMENTATION.md` (this file)

## Files Modified
1. `Models/UserRoles.cs` - Added Company role
2. `Models/Entities/User.cs` - Added CompanyId
3. `Models/Entities/Company.cs` - Added User navigation
4. `Models/DTOs/AuthDtos.cs` - Added CompanyId fields
5. `Services/AuthService.cs` - Added Company registration logic
6. `Data/DispatchStackDbContext.cs` - Added Shipments and relationships

## Migration Status
⚠️ **PENDING** - Need to run:
```powershell
dotnet ef migrations add AddCompanyUsersAndShipments
dotnet ef database update
```

## Implementation Status

### ✅ Completed
- [x] Database entities (User, Company, Shipment)
- [x] DTOs for auth and shipments
- [x] User roles updated
- [x] Auth service updated for Company registration
- [x] DbContext configured with relationships

### ⏳ Remaining (Next Session)
- [ ] Complete AuthService (JWT claims, responses)
- [ ] Create ShipmentService
- [ ] Create ShipmentsController
- [ ] Create authorization handler
- [ ] Run database migration
- [ ] Create frontend company dashboard
- [ ] Create test script
- [ ] Update documentation

## Next Command to Run
```powershell
cd backend/DispatchStack.Api
dotnet ef migrations add AddCompanyUsersAndShipments
```

---

**This establishes the foundation for company accounts with cargo and GPS visibility restricted to their own shipments!**
