# 🚀 Database Setup - EF Core Workflow

**The recommended way to set up DispatchStack database using Entity Framework Core.**

---

## ⚡ Quick Setup (Copy & Paste)

```bash
# 1. Install EF Core tools (one-time)
dotnet tool install --global dotnet-ef

# 2. Navigate to API project
cd backend/DispatchStack.Api

# 3. Restore packages
dotnet restore

# 4. Create migration
dotnet ef migrations add InitialCreate

# 5. Create database and apply migration
dotnet ef database update

# 6. Run the API
dotnet run

# 7. Test (in another terminal)
curl http://localhost:5000/api/drivers
```

**Before step 4:** Edit `backend/DispatchStack.Api/appsettings.Development.json` and update the PostgreSQL password.

---

## 📋 Prerequisites

- ✅ PostgreSQL 14+ installed and running
- ✅ .NET 10 SDK installed
- ✅ Default PostgreSQL password known (set during installation)

**Check PostgreSQL is running:**
- Windows: Services → "postgresql-x64-16" service should be running
- Docker: Run `docker-compose up -d` to start PostgreSQL container

---

## 🔧 Configuration

### Update Connection String

Edit `backend/DispatchStack.Api/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=dispatchstack;Username=postgres;Password=YOUR_PASSWORD_HERE"
  }
}
```

**Replace `YOUR_PASSWORD_HERE`** with your actual PostgreSQL password.

**Common passwords:**
- Default during install: What you set in PostgreSQL installer
- Docker: `postgres` (from docker-compose.yml)

---

## 🎯 What EF Core Does Automatically

When you run `dotnet ef database update`:

1. ✅ Creates `dispatchstack` database (if it doesn't exist)
2. ✅ Creates 4 tables:
   - `Drivers` - with unique license number constraint
   - `Trucks` - with unique unit number and VIN constraints
   - `ExportingCompanies`
   - `ImportingCompanies`
3. ✅ Applies all indexes for performance
4. ✅ Creates `__EFMigrationsHistory` table to track schema versions

**No SQL scripts needed!** Everything is defined in your C# entity classes.

---

## 📊 Using pgAdmin 4 (Optional)

After running migrations, you can view your database in pgAdmin 4:

1. Open pgAdmin 4
2. Connect to your PostgreSQL server
3. Expand **Databases** → **dispatchstack**
4. Expand **Schemas** → **public** → **Tables**
5. You'll see: Drivers, Trucks, ExportingCompanies, ImportingCompanies

To view data:
- Right-click a table → **View/Edit Data** → **All Rows**

---

## 🔧 EF Core Migration Commands

### Create a new migration
```bash
dotnet ef migrations add <MigrationName>
```
Example: `dotnet ef migrations add AddDriverStatus`

### Apply all pending migrations
```bash
dotnet ef database update
```

### Rollback to specific migration
```bash
dotnet ef database update <MigrationName>
```

### Remove last migration (before applying)
```bash
dotnet ef migrations remove
```

### Generate SQL script
```bash
dotnet ef migrations script
```

### List all migrations
```bash
dotnet ef migrations list
```

---

## 🗄️ Database Structure

After setup, you'll have these tables:

1. **Drivers** - Driver information, licenses, employment
2. **Trucks** - Fleet management, maintenance tracking
3. **ExportingCompanies** - USMCA export compliance
4. **ImportingCompanies** - USMCA import compliance

---
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=dispatchstack;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

## 🧪 Test the API

Once the backend is running, test the endpoints:

```bash
# Get all drivers (should return empty array)
curl http://localhost:5000/api/drivers

# Create a driver
curl -X POST http://localhost:5000/api/drivers \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "licenseNumber": "D1234567",
    "licenseClass": "A",
    "licenseCountry": "United States",
    "licenseExpiryDate": "2025-12-31T00:00:00Z",
    "email": "john.doe@example.com",
    "phone": "555-0100",
    "dateOfBirth": "1985-01-15T00:00:00Z",
    "address": "123 Main St",
    "city": "Seattle",
    "region": "Washington",
    "country": "United States",
    "postalCode": "98101",
    "employmentStatus": "Active",
    "hireDate": "2020-01-01T00:00:00Z"
  }'

# Verify driver was created
curl http://localhost:5000/api/drivers
```

---

## ⚠️ Troubleshooting

### "Build failed" or "Cannot find dotnet ef"
```bash
# Install EF Core tools
dotnet tool install --global dotnet-ef

# Verify installation
dotnet ef --version
```

### "Unable to connect to database" or "Connection refused"
- **Check PostgreSQL is running**:
  - Windows: Open Services (Win+R → `services.msc`) → Find "postgresql-x64-16" service
  - Docker: Run `docker ps` to see if container is running
  - Or in pgAdmin: Server should show green icon

- **Check port 5432**:
  ```bash
  netstat -an | findstr 5432
  ```

### "Password authentication failed"
- Update `appsettings.Development.json` with correct password
- Default PostgreSQL password is set during installation
- For Docker, default is "postgres"

### "Database does not exist" (shouldn't happen with EF Core)
- Run: `dotnet ef database update` again
- EF Core creates the database automatically

### Migration already exists
```bash
# Remove the last migration
dotnet ef migrations remove

# Create it again
dotnet ef migrations add InitialCreate
```

---

## 🗄️ Database Management Tools

After setup, you can manage your database with:

- **pgAdmin 4**: Included with PostgreSQL installer
- **DBeaver**: https://dbeaver.io/
- **DataGrip**: https://www.jetbrains.com/datagrip/
- **Azure Data Studio**: With PostgreSQL extension

Connection details:
- Host: localhost
- Port: 5432
- Database: dispatchstack
- Username: postgres
- Password: [your password]

---

## 📝 Adding New Tables (Future)

When you need to add new entities:

1. Create entity class in `Models/Entities/`
2. Add DbSet to `DispatchStackDbContext.cs`
3. Create migration:
   ```bash
   dotnet ef migrations add AddNewEntity
   ```
4. Apply migration:
   ```bash
   dotnet ef database update
   ```

---

## 🔄 Resetting the Database

If you need to start fresh:

```bash
# Drop and recreate database
dotnet ef database drop
dotnet ef database update

# Or keep database and remove all data
dotnet ef database update 0
dotnet ef database update
```

---

## 📚 Additional Resources

- [EF Core Migrations](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/)
- [Npgsql EF Core Provider](https://www.npgsql.org/efcore/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## ❌ Legacy: Manual SQL Scripts (Not Recommended)

SQL scripts are available in `backend/DispatchStack.Api/Data/` for reference:
- `create-db-simple.sql` - Manual database creation
- `init-database.sql` - Manual table creation

**Note:** These are not needed when using EF Core migrations, which is the recommended approach.
