# pgAdmin 4 Setup Guide

This guide shows how to view and manage your DispatchStack database using pgAdmin 4.

**Note:** We recommend using EF Core migrations to create the database. This guide is for viewing and managing the database after it's created.

---

## Step-by-Step with EF Core (Recommended)

### Step 1: Install EF Core Tools

```bash
dotnet tool install --global dotnet-ef
```

### Step 2: Configure Connection String

Edit `backend/DispatchStack.Api/appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=dispatchstack;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

### Step 3: Create Database and Tables with EF Core

```bash
cd backend/DispatchStack.Api
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
```

✅ **Done!** EF Core has created your database and all tables.

### Step 4: View in pgAdmin 4

1. Open pgAdmin 4
2. Right-click **"Databases"** in left sidebar → Select **"Refresh"**
3. Expand **"dispatchstack"** → **"Schemas"** → **"public"** → **"Tables"**
4. You'll see all your tables:
   - Drivers
   - Trucks
   - ExportingCompanies
   - ImportingCompanies
   - __EFMigrationsHistory (tracks migrations)

---

## Viewing and Managing Data

### View Table Data
1. Right-click on a table (e.g., "Drivers")
2. Select **"View/Edit Data"** → **"All Rows"**
3. Data grid appears showing all records

### Run Queries
1. Right-click the "dispatchstack" database
2. Select **"Query Tool"**
3. Type your SQL query:
   ```sql
   SELECT * FROM "Drivers";
   SELECT * FROM "Trucks" WHERE "Status" = 'Active';
   ```
4. Press **F5** or click **Execute** (▶)

### Edit Data Directly
1. In the data grid (from "View/Edit Data")
2. Double-click a cell to edit
3. Click **Save** (💾) to commit changes

---

## Common pgAdmin Tasks

### Check Database Connection
```sql
SELECT version();
```

### View All Tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Count Records in a Table
```sql
SELECT COUNT(*) FROM "Drivers";
```

### View Table Structure
1. Right-click a table → **"Properties"**
2. Click the **"Columns"** tab

### Backup Database
1. Right-click **"dispatchstack"** database
2. Select **"Backup..."**
3. Choose filename and location
4. Click **"Backup"**

### Restore Database
1. Right-click **"Databases"**
2. Select **"Restore..."**
3. Choose backup file
4. Click **"Restore"**

---
