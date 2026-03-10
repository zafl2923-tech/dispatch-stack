# Quick API Test Commands for PowerShell
# Make sure backend is running: dotnet run

# Get all drivers
Invoke-WebRequest http://localhost:5000/api/drivers | Select-Object -ExpandProperty Content

# Create a driver (PowerShell way)
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

Invoke-WebRequest -Uri http://localhost:5000/api/drivers -Method Post -Body $driver -ContentType "application/json" | Select-Object -ExpandProperty Content

# Get all trucks
Invoke-WebRequest http://localhost:5000/api/trucks | Select-Object -ExpandProperty Content

# Create a truck
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

Invoke-WebRequest -Uri http://localhost:5000/api/trucks -Method Post -Body $truck -ContentType "application/json" | Select-Object -ExpandProperty Content
