# 🗄️ DispatchStack Database Guide

Complete guide for database setup, testing, and management.

---

## 📑 Table of Contents

1. [Quick Start](#-quick-start)
2. [Prerequisites](#-prerequisites)
3. [Database Setup](#-database-setup)
4. [Testing the API](#-testing-the-api)
5. [Database Structure](#-database-structure)
6. [Common Tasks](#-common-tasks)
7. [Troubleshooting](#-troubleshooting)
8. [Backend Architecture](#-backend-architecture)

---

## ⚡ Quick Start

**The fastest way to get your database running:**

```powershell
# 1. Install EF Core tools (one-time)
dotnet tool install --global dotnet-ef

# 2. Update password in backend/DispatchStack.Api/appsettings.Development.json
# Change "Password=postgres" to your actual PostgreSQL password

# 3. Create database and tables
cd backend/DispatchStack.Api
dotnet ef migrations add InitialCreate
dotnet ef database update

# 4. Run backend
dotnet run

# 5. Test (in another terminal)
.\test-api.ps1
```

✅ **Done!** Your database is ready.

---

## 📋 Prerequisites

### Required
- ✅ PostgreSQL 14+ installed and running
- ✅ .NET 10 SDK installed
- ✅ PowerShell (for Windows testing)

### Installation Links
- PostgreSQL: https://www.postgresql.org/download/
- .NET SDK: https://dotnet.microsoft.com/download

### Verify Installation
```powershell
# Check PostgreSQL
pg_isready

# Check .NET
dotnet --version

# Check EF Core tools
dotnet ef --version
```

---

## 🗄️ Database Setup

### Option 1: Using Docker (Easiest)

```powershell
# Start PostgreSQL container
docker-compose up -d

# Wait 10 seconds, then create migrations
cd backend/DispatchStack.Api
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Option 2: Using Local PostgreSQL

#### Step 1: Configure Connection String

Edit `backend/DispatchStack.Api/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=dispatchstack;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

#### Step 2: Create Database and Tables

```powershell
cd backend/DispatchStack.Api

# Install EF Core tools (if not already installed)
dotnet tool install --global dotnet-ef

# Restore packages
dotnet restore

# Create migration
dotnet ef migrations add InitialCreate

# Apply migration (creates database and tables)
dotnet ef database update
```

**EF Core will automatically:**
- ✅ Create the `dispatchstack` database
- ✅ Create all tables
- ✅ Apply indexes and constraints

#### Step 3: Verify Setup

```powershell
# Check database connection
dotnet ef dbcontext info

# Should show:
# Database name: dispatchstack
# Data source: tcp://localhost:5432
```

---

## 🧪 Testing the API

### Start the Backend

**Terminal 1:**
```powershell
cd backend/DispatchStack.Api
dotnet run
```

**Wait for:**
```
Now listening on: http://localhost:5000
```

### Run Automated Tests

**Terminal 2:**
```powershell
.\test-api.ps1
```

This tests all endpoints and creates sample data.

### Manual Testing (PowerShell)

#### Get All Drivers
```powershell
Invoke-WebRequest http://localhost:5000/api/drivers | Select-Object -ExpandProperty Content
```

#### Create a Driver
```powershell
$driver = @{
    firstName = "John"
    lastName = "Smith"
    licenseNumber = "DL123456"
    licenseClass = "A"
    licenseCountry = "United States"
    licenseExpiryDate = "2025-12-31T00:00:00Z"
    email = "john.smith@example.com"
    phone = "555-0123"
    dateOfBirth = "1985-03-15T00:00:00Z"
    address = "123 Main St"
    city = "Seattle"
    region = "Washington"
    country = "United States"
    postalCode = "98101"
    employmentStatus = "Active"
    hireDate = "2024-01-01T00:00:00Z"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5000/api/drivers -Method Post -Body $driver -ContentType "application/json"
```

#### Create a Truck
```powershell
$truck = @{
    unitNumber = "TRUCK-001"
    make = "Peterbilt"
    model = "579"
    year = 2023
    vin = "1XPWD40X1ED123456"
    licensePlate = "WA1234"
    licenseCountry = "United States"
    licenseRegion = "Washington"
    grossVehicleWeight = 80000
    maxLoadCapacity = 45000
    fuelType = "Diesel"
    fuelCapacity = 300
    status = "Active"
    lastMaintenanceDate = "2024-01-01T00:00:00Z"
    nextMaintenanceDue = "2024-07-01T00:00:00Z"
    odometer = 50000
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5000/api/trucks -Method Post -Body $truck -ContentType "application/json"
```

#### Create a Company
```powershell
$company = @{
    companyName = "Global Trade Inc"
    companyType = "Both"
    businessNumber = "BN123456"
    taxId = "TAX123456"
    address = "789 Trade Blvd"
    city = "Chicago"
    region = "Illinois"
    country = "United States"
    postalCode = "60601"
    contactName = "Bob Johnson"
    contactEmail = "bob@global.com"
    contactPhone = "555-0300"
    exportLicenseNumber = "EXP9012"
    exportLicenseExpiryDate = "2025-12-31T00:00:00Z"
    importLicenseNumber = "IMP3456"
    importLicenseExpiryDate = "2025-12-31T00:00:00Z"
    usmcaStatus = "Certified"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5000/api/companies -Method Post -Body $company -ContentType "application/json"
```

### Using Browser

For GET requests only, open browser:
- http://localhost:5000/api/drivers
- http://localhost:5000/api/trucks
- http://localhost:5000/api/companies
- http://localhost:5000/api/companies?type=Exporter

---

## 📊 Database Structure

### Tables

```
dispatchstack (Database)
│
├── Drivers
│   ├── Id (UUID, PK)
│   ├── FirstName, LastName
│   ├── LicenseNumber (UNIQUE)
│   ├── LicenseClass, LicenseCountry
│   ├── Email, Phone
│   ├── Address, City, Region, Country, PostalCode
│   ├── EmploymentStatus, HireDate
│   └── CreatedAt, UpdatedAt
│
├── Trucks
│   ├── Id (UUID, PK)
│   ├── UnitNumber (UNIQUE)
│   ├── Make, Model, Year
│   ├── VIN (UNIQUE)
│   ├── LicensePlate, LicenseCountry, LicenseRegion
│   ├── GrossVehicleWeight, MaxLoadCapacity
│   ├── FuelType, FuelCapacity
│   ├── Status, Odometer
│   ├── LastMaintenanceDate, NextMaintenanceDue
│   └── CreatedAt, UpdatedAt
│
└── Companies
    ├── Id (UUID, PK)
    ├── CompanyName
    ├── CompanyType ("Exporter", "Importer", "Both")
    ├── BusinessNumber, TaxId
    ├── Address, City, Region, Country, PostalCode
    ├── ContactName, ContactEmail, ContactPhone
    ├── ExportLicenseNumber, ExportLicenseExpiryDate
    ├── ImportLicenseNumber, ImportLicenseExpiryDate
    ├── USMCAStatus
    └── CreatedAt, UpdatedAt
```

### API Endpoints

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/drivers` | GET, POST | List/create drivers |
| `/api/drivers/{id}` | GET, PUT, DELETE | Single driver operations |
| `/api/trucks` | GET, POST | List/create trucks |
| `/api/trucks/{id}` | GET, PUT, DELETE | Single truck operations |
| `/api/companies` | GET, POST | List/create companies |
| `/api/companies?type=Exporter` | GET | Filter by type |
| `/api/companies/{id}` | GET, PUT, DELETE | Single company operations |

---

## 🔧 Common Tasks

### View Data in pgAdmin 4

1. Open pgAdmin 4
2. Navigate: **dispatchstack** → **Schemas** → **public** → **Tables**
3. Right-click a table → **View/Edit Data** → **All Rows**

### Create a New Migration

After modifying entity models:

```powershell
cd backend/DispatchStack.Api
dotnet ef migrations add DescriptiveName
dotnet ef database update
```

### View Migration SQL

```powershell
dotnet ef migrations script
```

### Rollback Migration

```powershell
dotnet ef database update PreviousMigrationName
```

### Remove Last Migration

```powershell
dotnet ef migrations remove
```

### Reset Database

```powershell
dotnet ef database drop --force
dotnet ef database update
```

### Check Database Connection

```powershell
dotnet ef dbcontext info
```

---

## ⚠️ Troubleshooting

### Backend Won't Start

**Error: "Unable to connect to database"**

✅ **Solutions:**
1. Check PostgreSQL is running
   - Windows: Services → "postgresql-x64-16" service
   - Docker: `docker ps`
2. Verify connection string in `appsettings.Development.json`
3. Test connection in pgAdmin 4

**Error: "Build failed"**

```powershell
cd backend/DispatchStack.Api
dotnet restore
dotnet build
```

### Migration Issues

**Error: "Migration already exists"**

```powershell
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
```

**Error: "No project was found"**

```powershell
cd backend/DispatchStack.Api
dotnet ef migrations add InitialCreate
```

### Testing Issues

**Error: "API is not running"**

1. Start backend first: `cd backend/DispatchStack.Api; dotnet run`
2. Wait for "Now listening on: http://localhost:5000"
3. Then run tests in another terminal

**PowerShell curl commands don't work**

✅ Use PowerShell syntax:
- Use `Invoke-WebRequest` instead of `curl`
- Use `-Body` instead of `-d`
- See testing examples above

### Database Issues

**Error: "Password authentication failed"**

Update password in `appsettings.Development.json` to match your PostgreSQL password.

**Error: "Database does not exist"**

Run: `dotnet ef database update` - EF Core will create it automatically.

**Port 5000 already in use**

```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Or change port in Program.cs
```

---

## 🏗️ Backend Architecture

### Project Structure

```
backend/DispatchStack.Api/
│
├── Controllers/           # API endpoints
│   ├── DriversController.cs
│   ├── TrucksController.cs
│   ├── CompaniesController.cs
│   ├── GeoController.cs
│   └── HosController.cs
│
├── Data/                  # Database layer
│   └── DispatchStackDbContext.cs
│
├── Models/
│   ├── Entities/          # Database models
│   │   ├── Driver.cs
│   │   ├── Truck.cs
│   │   └── Company.cs
│   │
│   └── DTOs/              # API contracts
│       ├── DriverDto.cs
│       ├── TruckDto.cs
│       └── CompanyDto.cs
│
├── Services/              # Business logic
│   ├── DriverService.cs
│   ├── TruckService.cs
│   └── CompanyService.cs
│
├── Migrations/            # EF Core migrations
├── appsettings.json       # Production config
├── appsettings.Development.json  # Dev config
└── Program.cs             # App startup
```

### Request Flow

```
HTTP Request
    ↓
Controller (validates, maps DTOs)
    ↓
Service (business logic)
    ↓
DbContext (EF Core)
    ↓
PostgreSQL Database
```

### Design Patterns

- **Repository Pattern** - Services as data repositories
- **DTO Pattern** - Separate API from database models
- **Dependency Injection** - Services injected into controllers
- **Code-First Migrations** - Database from C# models

---

## 📚 Additional Resources

- [Entity Framework Core Documentation](https://learn.microsoft.com/en-us/ef/core/)
- [Npgsql EF Core Provider](https://www.npgsql.org/efcore/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)

---

## 🎉 Success Checklist

- [ ] PostgreSQL installed and running
- [ ] EF Core tools installed (`dotnet ef --version`)
- [ ] Database created (`dotnet ef database update`)
- [ ] Backend starts (`dotnet run`)
- [ ] API responds (`curl http://localhost:5000/api/drivers`)
- [ ] Can create/read data via API
- [ ] Data persists after backend restart
- [ ] Can view data in pgAdmin 4

✅ **All checked?** Your database integration is complete!

---

**Need help?** Check the [Troubleshooting](#-troubleshooting) section or review specific sections above.
