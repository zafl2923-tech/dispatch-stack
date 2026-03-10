# 📂 Database Setup Documentation

**Quick Navigation:** Pick what you need!

---

## 🎯 I Want To...

### "Just set up the database quickly"
👉 Read [**SETUP.md**](SETUP.md) - 3 commands, done in 2 minutes

### "Understand the full setup process"
👉 Read [**README.md**](README.md) - Complete guide with all details

### "Use pgAdmin 4 to view/manage the database"
👉 Read [**PGADMIN_SETUP.md**](PGADMIN_SETUP.md) - pgAdmin workflow

---

## ⚡ Super Quick Start (Right Here!)

**Prerequisites:** PostgreSQL installed and running

```bash
# 1. Install EF Core tools (one-time)
dotnet tool install --global dotnet-ef

# 2. Edit appsettings.Development.json with your PostgreSQL password

# 3. Create database and tables
cd backend/DispatchStack.Api
dotnet ef migrations add InitialCreate
dotnet ef database update

# 4. Run backend
dotnet run

# 5. Test
curl http://localhost:5000/api/drivers
```

✅ **Done!**

---

## 📜 SQL Scripts (Reference Only - Not Needed)

| File | Purpose |
|------|---------|
| `create-db-simple.sql` | Manual database creation (if you want to do it manually) |
| `init-database.sql` | Manual table creation (for reference) |

**⚠️ You don't need these scripts when using EF Core migrations (recommended).**

---

## 🏗️ Database Structure

After setup, you'll have:

```
dispatchstack (database)
└── Tables:
    ├── Drivers
    ├── Trucks
    ├── ExportingCompanies
    ├── ImportingCompanies
    └── __EFMigrationsHistory
```

---

## 🔑 Key Files

- **`DispatchStackDbContext.cs`** - EF Core database context
- **`appsettings.json`** - Production connection string (in parent folder)
- **`appsettings.Development.json`** - Dev connection string (in parent folder)

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "dotnet ef not found" | Run: `dotnet tool install --global dotnet-ef` |
| "Connection refused" | Start PostgreSQL or run `docker-compose up -d` |
| "Password failed" | Update `appsettings.Development.json` |
| "Build failed" | Run: `dotnet restore && dotnet build` |

---

**🎉 Tip:** EF Core migrations handle everything automatically - no need for manual SQL scripts!
