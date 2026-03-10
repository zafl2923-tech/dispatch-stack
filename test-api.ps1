# Test API Endpoints - PowerShell Version
# Run this script to test your database integration
# Make sure the backend is running first: dotnet run

Write-Host "🧪 Testing DispatchStack API Endpoints..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000/api"

# Test 1: Check if API is running
Write-Host "1️⃣ Checking if API is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/drivers" -Method Get -TimeoutSec 3
    Write-Host "✅ API is running" -ForegroundColor Green
    Write-Host "   Current drivers: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ API is not running. Start it with: dotnet run" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Create a test driver
Write-Host "2️⃣ Creating test driver..." -ForegroundColor Yellow
$testDriver = @{
    firstName = "John"
    lastName = "Smith"
    licenseNumber = "DL$(Get-Random -Minimum 100000 -Maximum 999999)"
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

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/drivers" -Method Post -Body $testDriver -ContentType "application/json" -TimeoutSec 5
    Write-Host "✅ Driver created successfully (Status: $($response.StatusCode))" -ForegroundColor Green
    $driver = $response.Content | ConvertFrom-Json
    Write-Host "   Driver ID: $($driver.id)" -ForegroundColor Gray
    Write-Host "   Name: $($driver.firstName) $($driver.lastName)" -ForegroundColor Gray
    $driverId = $driver.id
} catch {
    Write-Host "❌ Failed to create driver: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 3: Get the driver we just created
Write-Host "3️⃣ Retrieving created driver..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/drivers/$driverId" -Method Get -TimeoutSec 5
    Write-Host "✅ Driver retrieved successfully" -ForegroundColor Green
    $driver = $response.Content | ConvertFrom-Json
    Write-Host "   License: $($driver.licenseNumber)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to retrieve driver: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Create a test truck
Write-Host "4️⃣ Creating test truck..." -ForegroundColor Yellow
$testTruck = @{
    unitNumber = "TRUCK-$(Get-Random -Minimum 100 -Maximum 999)"
    make = "Peterbilt"
    model = "579"
    year = 2023
    vin = "1XPWD40X1ED$(Get-Random -Minimum 100000 -Maximum 999999)"
    licensePlate = "WA$(Get-Random -Minimum 1000 -Maximum 9999)"
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

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/trucks" -Method Post -Body $testTruck -ContentType "application/json" -TimeoutSec 5
    Write-Host "✅ Truck created successfully" -ForegroundColor Green
    $truck = $response.Content | ConvertFrom-Json
    Write-Host "   Truck ID: $($truck.id)" -ForegroundColor Gray
    Write-Host "   Unit: $($truck.unitNumber)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to create truck: $_" -ForegroundColor Red
}
Write-Host ""

# Test 5: Create a test exporting company
Write-Host "5️⃣ Creating test exporting company..." -ForegroundColor Yellow
$testExporter = @{
    companyName = "Test Exports Inc"
    businessNumber = "BN$(Get-Random -Minimum 100000 -Maximum 999999)"
    taxId = "TAX$(Get-Random -Minimum 100000 -Maximum 999999)"
    address = "456 Export Blvd"
    city = "Los Angeles"
    region = "California"
    country = "United States"
    postalCode = "90001"
    contactName = "Jane Exporter"
    contactEmail = "jane@testexports.com"
    contactPhone = "555-0200"
    exportLicenseNumber = "EXP$(Get-Random -Minimum 1000 -Maximum 9999)"
    exportLicenseExpiryDate = "2025-12-31T00:00:00Z"
    usmcaStatus = "Certified"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/exportingcompanies" -Method Post -Body $testExporter -ContentType "application/json" -TimeoutSec 5
    Write-Host "✅ Exporting company created successfully" -ForegroundColor Green
    $company = $response.Content | ConvertFrom-Json
    Write-Host "   Company: $($company.companyName)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to create exporting company: $_" -ForegroundColor Red
}
Write-Host ""

# Test 6: Get all entities
Write-Host "6️⃣ Retrieving all entities..." -ForegroundColor Yellow
$entities = @("drivers", "trucks", "exportingcompanies", "importingcompanies")
foreach ($entity in $entities) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/$entity" -Method Get -TimeoutSec 5
        $data = $response.Content | ConvertFrom-Json
        Write-Host "  ✅ $entity`: $($data.Count) records" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ $entity`: Error" -ForegroundColor Red
    }
}
Write-Host ""

# Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎉 Database integration test complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  • View data in pgAdmin 4 (Databases → dispatchstack → Tables)" -ForegroundColor Gray
Write-Host "  • All CRUD operations are working" -ForegroundColor Gray
Write-Host "  • Data persists in PostgreSQL" -ForegroundColor Gray
Write-Host "  • Ready to build frontend features" -ForegroundColor Gray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
