# 🔧 Testing API in PowerShell

**Problem:** The `curl` commands in the documentation use Bash syntax, which doesn't work in PowerShell.

---

## ✅ **Solution: Use These PowerShell Scripts**

### **Option 1: Run Complete Test Suite** (Recommended)

```powershell
.\test-api.ps1
```

This will:
- ✅ Test all 4 endpoints
- ✅ Create test data
- ✅ Verify database persistence
- ✅ Show results

### **Option 2: Quick Manual Commands**

Open the test commands file and copy-paste:
```powershell
.\test-commands.ps1
```

Or run commands individually (see below).

---

## 📝 **PowerShell Command Examples**

### Start the Backend (Terminal 1)
```powershell
cd backend\DispatchStack.Api
dotnet run
```

### Test Endpoints (Terminal 2)

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

Invoke-WebRequest -Uri http://localhost:5000/api/drivers -Method Post -Body $driver -ContentType "application/json" | Select-Object -ExpandProperty Content
```

#### Get All Trucks
```powershell
Invoke-WebRequest http://localhost:5000/api/trucks | Select-Object -ExpandProperty Content
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

Invoke-WebRequest -Uri http://localhost:5000/api/trucks -Method Post -Body $truck -ContentType "application/json" | Select-Object -ExpandProperty Content
```

---

## 🎯 **Easiest Way: Use the Test Script**

**In PowerShell, from project root:**

1. **Start backend** (keep this running):
```powershell
cd backend\DispatchStack.Api
dotnet run
```

2. **Open new PowerShell terminal**, then run:
```powershell
.\test-api.ps1
```

This automatically tests all endpoints and creates sample data!

---

## 🌐 **Alternative: Use a Browser or Postman**

### Browser (for GET requests only)
- http://localhost:5000/api/drivers
- http://localhost:5000/api/trucks
- http://localhost:5000/api/exportingcompanies
- http://localhost:5000/api/importingcompanies

### Postman
1. Download Postman: https://www.postman.com/downloads/
2. Import the JSON examples from the scripts
3. Visual interface for testing

---

## 🐛 **Why curl Commands Don't Work in PowerShell**

1. **Backslash (`\`) line continuation** doesn't work in PowerShell (use backtick `` ` `` instead)
2. **Single quotes (`'`) in JSON** conflict with PowerShell string handling
3. **`-d` flag** doesn't work (use `-Body` instead)
4. **PowerShell has `curl` as alias** for `Invoke-WebRequest`, but with different syntax

---

## ✅ **Verify Database Persistence**

After creating data:

1. **Stop the backend** (Ctrl+C)
2. **Restart it**: `dotnet run`
3. **Get data again**:
   ```powershell
   Invoke-WebRequest http://localhost:5000/api/drivers | Select-Object -ExpandProperty Content
   ```
4. **Your data is still there!** 🎉 (persisted in PostgreSQL)

---

## 📊 **View in pgAdmin 4**

1. Open pgAdmin 4
2. Navigate: **dispatchstack** → **Schemas** → **public** → **Tables**
3. Right-click **"Drivers"** → **View/Edit Data** → **All Rows**
4. See your data in the database!

---

**🚀 Quick Start:** Just run `.\test-api.ps1` - it does everything for you!
