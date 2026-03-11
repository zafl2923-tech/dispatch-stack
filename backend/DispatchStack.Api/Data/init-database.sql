-- DispatchStack - Database Tables Initialization Script
-- PostgreSQL 14+
--
-- ⚠️ IMPORTANT: This script is for REFERENCE ONLY
--
-- RECOMMENDED: Use EF Core migrations instead:
--   cd backend/DispatchStack.Api
--   dotnet ef migrations add InitialCreate
--   dotnet ef database update
--
-- EF Core migrations are better because:
--   ✅ Automatically tracks schema changes
--   ✅ Version controlled
--   ✅ Can rollback changes
--   ✅ Works across all environments
--   ✅ Generates tables from your C# models
--
-- =============================================================================
-- Only use this script if you need to create tables manually (not recommended)
-- =============================================================================
--
-- Instructions (if not using EF Core):
-- 1. Create database first (use create-db-simple.sql or EF Core)
-- 2. Open pgAdmin 4
-- 3. Right-click 'dispatchstack' database → "Query Tool"
-- 4. Run this script
--
-- =============================================================================

-- Create tables for the four core entities

-- Drivers table
CREATE TABLE IF NOT EXISTS "Drivers" (
    "Id" UUID PRIMARY KEY,
    "FirstName" VARCHAR(100) NOT NULL,
    "LastName" VARCHAR(100) NOT NULL,
    "LicenseNumber" VARCHAR(50) NOT NULL UNIQUE,
    "LicenseClass" VARCHAR(10),
    "LicenseCountry" VARCHAR(100),
    "LicenseExpiryDate" TIMESTAMP NOT NULL,
    "Email" VARCHAR(255),
    "Phone" VARCHAR(20),
    "DateOfBirth" TIMESTAMP NOT NULL,
    "Address" VARCHAR(500),
    "City" VARCHAR(100),
    "Region" VARCHAR(100),
    "Country" VARCHAR(100),
    "PostalCode" VARCHAR(20),
    "EmploymentStatus" VARCHAR(50),
    "HireDate" TIMESTAMP NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL,
    "UpdatedAt" TIMESTAMP NOT NULL
);

-- Trucks table
CREATE TABLE IF NOT EXISTS "Trucks" (
    "Id" UUID PRIMARY KEY,
    "UnitNumber" VARCHAR(50) NOT NULL UNIQUE,
    "Make" VARCHAR(100),
    "Model" VARCHAR(100),
    "Year" INTEGER NOT NULL,
    "VIN" VARCHAR(17) UNIQUE,
    "LicensePlate" VARCHAR(20),
    "LicenseCountry" VARCHAR(100),
    "LicenseRegion" VARCHAR(100),
    "GrossVehicleWeight" DOUBLE PRECISION NOT NULL,
    "MaxLoadCapacity" DOUBLE PRECISION NOT NULL,
    "FuelType" VARCHAR(50),
    "FuelCapacity" DOUBLE PRECISION NOT NULL,
    "Status" VARCHAR(50),
    "LastMaintenanceDate" TIMESTAMP NOT NULL,
    "NextMaintenanceDue" TIMESTAMP NOT NULL,
    "Odometer" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL,
    "UpdatedAt" TIMESTAMP NOT NULL
);

-- ExportingCompanies table
CREATE TABLE IF NOT EXISTS "ExportingCompanies" (
    "Id" UUID PRIMARY KEY,
    "CompanyName" VARCHAR(200) NOT NULL,
    "BusinessNumber" VARCHAR(50),
    "TaxId" VARCHAR(50),
    "Address" VARCHAR(500),
    "City" VARCHAR(100),
    "Region" VARCHAR(100),
    "Country" VARCHAR(100),
    "PostalCode" VARCHAR(20),
    "ContactName" VARCHAR(200),
    "ContactEmail" VARCHAR(255),
    "ContactPhone" VARCHAR(20),
    "ExportLicenseNumber" VARCHAR(100),
    "ExportLicenseExpiryDate" TIMESTAMP,
    "USMCAStatus" VARCHAR(50),
    "CreatedAt" TIMESTAMP NOT NULL,
    "UpdatedAt" TIMESTAMP NOT NULL
);

-- ImportingCompanies table
CREATE TABLE IF NOT EXISTS "ImportingCompanies" (
    "Id" UUID PRIMARY KEY,
    "CompanyName" VARCHAR(200) NOT NULL,
    "BusinessNumber" VARCHAR(50),
    "TaxId" VARCHAR(50),
    "Address" VARCHAR(500),
    "City" VARCHAR(100),
    "Region" VARCHAR(100),
    "Country" VARCHAR(100),
    "PostalCode" VARCHAR(20),
    "ContactName" VARCHAR(200),
    "ContactEmail" VARCHAR(255),
    "ContactPhone" VARCHAR(20),
    "ImportLicenseNumber" VARCHAR(100),
    "ImportLicenseExpiryDate" TIMESTAMP,
    "USMCAStatus" VARCHAR(50),
    "CreatedAt" TIMESTAMP NOT NULL,
    "UpdatedAt" TIMESTAMP NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "IX_Drivers_Email" ON "Drivers" ("Email");
CREATE INDEX IF NOT EXISTS "IX_Drivers_Country" ON "Drivers" ("Country");
CREATE INDEX IF NOT EXISTS "IX_Trucks_Status" ON "Trucks" ("Status");
CREATE INDEX IF NOT EXISTS "IX_Trucks_LicensePlate" ON "Trucks" ("LicensePlate");
CREATE INDEX IF NOT EXISTS "IX_ExportingCompanies_Country" ON "ExportingCompanies" ("Country");
CREATE INDEX IF NOT EXISTS "IX_ImportingCompanies_Country" ON "ImportingCompanies" ("Country");

-- Grant privileges (adjust username as needed)
GRANT ALL PRIVILEGES ON DATABASE dispatchstack TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
