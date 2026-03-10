# 🎯 Quick Start: Database Setup

**Follow these 3 commands to set up your database:**

```bash
# 1. Install EF Core tools (one-time)
dotnet tool install --global dotnet-ef

# 2. Configure connection string in appsettings.Development.json
# (Edit backend/DispatchStack.Api/appsettings.Development.json with your PostgreSQL password)

# 3. Create database and tables
cd backend/DispatchStack.Api
dotnet ef migrations add InitialCreate
dotnet ef database update
```

✅ **Done!** Your database is ready.

---

## 📚 Full Documentation

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for:
- Detailed setup instructions
- Docker alternative
- Troubleshooting
- Migration commands
- pgAdmin usage

---

## 🏗️ What You Get

- ✅ PostgreSQL database: `dispatchstack`
- ✅ 4 tables: Drivers, Trucks, ExportingCompanies, ImportingCompanies
- ✅ All constraints, indexes, and relationships
- ✅ Automatic migration tracking

---

## 🚀 Next Steps

1. Run the backend: `cd backend/DispatchStack.Api && dotnet run`
2. Test the API: `curl http://localhost:5000/api/drivers`
3. Start building features!
