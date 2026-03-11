# 🚀 Complete Testing Guide

## ⚡ **Quick Start (3 Steps)**

### **Step 1: Start the Backend** (Keep this terminal open)

```powershell
cd backend\DispatchStack.Api
dotnet run
```

**Wait for this message:**
```
Now listening on: http://localhost:5000
```

✅ Backend is now running!

---

### **Step 2: Open a NEW PowerShell Terminal**

Press `Windows Key`, type "PowerShell", open a new window.

Navigate to your project:
```powershell
cd C:\Users\zafl2\OneDrive\Documents\Projects\dispatch-stack
```

---

### **Step 3: Run Tests**

```powershell
.\test-api.ps1
```

This will test all endpoints and create sample data.

---

## 🧪 **Manual Testing (If You Prefer)**

### **In the NEW terminal** (backend still running in first terminal):

#### Get All Drivers
```powershell
Invoke-WebRequest http://localhost:5000/api/drivers | Select-Object -ExpandProperty Content
```

Expected result: `[]` or list of drivers

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

#### Verify Driver Was Created
```powershell
Invoke-WebRequest http://localhost:5000/api/drivers | Select-Object -ExpandProperty Content
```

You should see the driver you just created!

---

## 🌐 **Alternative: Use Browser**

With backend running, open browser and visit:
- http://localhost:5000/api/drivers
- http://localhost:5000/api/trucks
- http://localhost:5000/api/exportingcompanies
- http://localhost:5000/api/importingcompanies

---

## ⚠️ **Common Issues**

### Backend not starting?
```powershell
# Check for errors
cd backend\DispatchStack.Api
dotnet build
# Fix any errors, then:
dotnet run
```

### Port 5000 already in use?
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000
# Kill the process or change the port in Program.cs
```

### Connection to database failed?
- Check PostgreSQL is running (Services or Docker)
- Verify password in `appsettings.Development.json`
- Test connection in pgAdmin 4

---

## ✅ **Success Checklist**

- [ ] Backend running on http://localhost:5000
- [ ] Can GET all drivers (returns `[]` or list)
- [ ] Can POST to create driver (returns 201 Created)
- [ ] Can GET drivers again (shows created driver)
- [ ] Can view data in pgAdmin 4

---

**🎉 When all checks pass, your database integration is fully working!**
