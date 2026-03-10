# 🚀 Database Setup - EF Core Workflow

**The recommended and simplest way to set up the DispatchStack database.**

---

## 📋 Prerequisites

✅ PostgreSQL 14+ installed and running  
✅ .NET 10 SDK installed  
✅ EF Core CLI tools: `dotnet tool install --global dotnet-ef`

---

## ⚡ Quick Setup (3 Steps)

### 1️⃣ Configure Connection

Edit `backend/DispatchStack.Api/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=dispatchstack;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

### 2️⃣ Create and Apply Migration

```bash
cd backend/DispatchStack.Api
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
```

**What happens:**
- ✅ Creates `dispatchstack` database (if it doesn't exist)
- ✅ Creates all tables: Drivers, Trucks, ExportingCompanies, ImportingCompanies
- ✅ Applies constraints, indexes, and relationships
- ✅ Creates migration history tracking

### 3️⃣ Run the API

```bash
dotnet run
```

**Test it:**
```bash
curl http://localhost:5000/api/drivers
# Should return: []
```

✅ **You're done!**

---

## 🔄 Common Migration Commands

### When you change entity models

```bash
# Create migration for your changes
dotnet ef migrations add DescribeYourChange

# Apply to database
dotnet ef database update
```

### View migration SQL before applying
```bash
dotnet ef migrations script
```

### Rollback a migration
```bash
dotnet ef database update PreviousMigrationName
```

### Remove last migration (if not applied yet)
```bash
dotnet ef migrations remove
```

### List all migrations
```bash
dotnet ef migrations list
```

### Reset database (drop and recreate)
```bash
dotnet ef database drop --force
dotnet ef database update
```

---

## 🐳 Using Docker for PostgreSQL

If you don't have PostgreSQL installed:

```bash
# Start PostgreSQL container
docker-compose up -d

# Wait 10 seconds for PostgreSQL to initialize
# Then run migrations
cd backend/DispatchStack.Api
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 👀 View Database in pgAdmin 4

After running migrations:

1. Open **pgAdmin 4**
2. Right-click **Databases** → **Refresh**
3. Expand: **dispatchstack** → **Schemas** → **public** → **Tables**
4. Right-click any table → **View/Edit Data** → **All Rows**

---

## ⚠️ Troubleshooting

### "dotnet ef command not found"
```bash
dotnet tool install --global dotnet-ef
dotnet ef --version
```

### "Unable to connect to database"
- Check PostgreSQL is running
- Verify connection string in `appsettings.Development.json`
- Test with: `psql -U postgres -h localhost` or check pgAdmin

### "Build failed"
```bash
dotnet restore
dotnet build
```

### "Migration already exists"
```bash
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
```

---

## 📚 Learn More

- [EF Core Migrations](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/)
- [Npgsql Provider](https://www.npgsql.org/efcore/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)

---

## 📁 SQL Scripts (Reference Only)

The `Data/` folder contains SQL scripts for reference:
- `create-db-simple.sql` - Manual database creation
- `init-database.sql` - Manual table creation

**These are NOT needed when using EF Core migrations (recommended approach).**
