# Database Setup Guide

## Prerequisites

- PostgreSQL 14 or later installed (includes pgAdmin 4 on Windows)
- .NET 10 SDK installed
- EF Core CLI tools installed: `dotnet tool install --global dotnet-ef`

## Quick Start (EF Core Workflow - Recommended)

### 1. Ensure PostgreSQL is Running

- **Windows**: Check PostgreSQL service is running in Services (services.msc)
- **Docker**: Run `docker-compose up -d` from project root
- **Verify**: PostgreSQL should be accessible on port 5432

### 2. Configure Connection String

Update `backend/DispatchStack.Api/appsettings.Development.json` with your credentials:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=dispatchstack;Username=YOUR_USERNAME;Password=YOUR_PASSWORD"
  }
}
```

**Note:** EF Core will automatically create the database if it doesn't exist when you run `dotnet ef database update`.

### 3. Create and Apply Migrations

```bash
cd backend/DispatchStack.Api

# Install EF Core tools if not already installed
dotnet tool install --global dotnet-ef

# Restore packages
dotnet restore

# Create initial migration
dotnet ef migrations add InitialCreate

# Apply migration to database (creates database and tables automatically)
dotnet ef database update
```

### 4. Run the Backend

```bash
dotnet run
```

The API will be available at `http://localhost:5000`

---

## EF Core Migration Workflow

EF Core migrations automatically track your database schema changes. Here are the common commands:

### Create a new migration
```bash
dotnet ef migrations add <MigrationName>
```
Example: `dotnet ef migrations add AddDriverStatus`

### Apply migrations to database
```bash
dotnet ef database update
```
This applies all pending migrations and creates the database if it doesn't exist.

### View migration SQL without applying
```bash
dotnet ef migrations script
```

### Rollback to a specific migration
```bash
dotnet ef database update <MigrationName>
```
Example: `dotnet ef database update InitialCreate`

### Remove last migration (before applying)
```bash
dotnet ef migrations remove
```

### List all migrations
```bash
dotnet ef migrations list
```

---

## Manual Database Creation (Alternative)

If you prefer to create the database manually first (not required):

### Using pgAdmin 4
1. Open pgAdmin 4 → Right-click "postgres" database → Query Tool
2. Run: `CREATE DATABASE dispatchstack;`
3. Then proceed with EF Core migrations

### Using psql
```bash
psql -U postgres -c "CREATE DATABASE dispatchstack;"
```

### SQL Scripts (Reference Only)
- `create-db-simple.sql` - Simple database creation
- `init-database.sql` - Manual table creation (not needed with EF Core)

---

## Database Tables

The database includes four core tables:

1. **Drivers** - Driver information, licenses, and employment details
2. **Trucks** - Vehicle fleet management and maintenance tracking
3. **ExportingCompanies** - Companies that export goods with USMCA compliance
4. **ImportingCompanies** - Companies that import goods with USMCA compliance

## Connection String Format

```
Host=<hostname>;Port=<port>;Database=<database>;Username=<username>;Password=<password>
```

Default values:
- Host: localhost
- Port: 5432 (default PostgreSQL port)
- Database: dispatchstack
- Username: postgres
- Password: postgres (change this!)

---

## Docker Setup (Optional)

To run PostgreSQL in Docker:

```bash
# From project root
docker-compose up -d
```

Or using docker run:
```bash
docker run --name dispatchstack-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=dispatchstack \
  -p 5432:5432 \
  -d postgres:16
```

Then proceed with EF Core migrations as usual.

---

## Verify Database Connection

### Run the application
```bash
cd backend/DispatchStack.Api
dotnet run
```

The application logs should show:
```
info: Microsoft.EntityFrameworkCore.Database.Command[20101]
      Executed DbCommand...
```

### Test API Endpoints

```bash
# Get all drivers (should return empty array)
curl http://localhost:5000/api/drivers

# Get all trucks
curl http://localhost:5000/api/trucks

# Get all exporting companies
curl http://localhost:5000/api/exportingcompanies

# Get all importing companies
curl http://localhost:5000/api/importingcompanies
```

---

## Troubleshooting

### Connection refused
- Verify PostgreSQL is running: `pg_isready`
- Check if PostgreSQL is listening on port 5432: `netstat -an | grep 5432`

### Authentication failed
- Verify username and password in connection string
- Check PostgreSQL `pg_hba.conf` for authentication settings

### Database does not exist
- Create the database manually or let EF Core create it
- Run `dotnet ef database update`
