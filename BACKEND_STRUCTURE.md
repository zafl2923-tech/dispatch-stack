# 🗂️ Backend Project Structure

```
backend/DispatchStack.Api/
│
├── 📁 Controllers/                    # API Endpoints
│   ├── DriversController.cs          # /api/drivers
│   ├── TrucksController.cs           # /api/trucks
│   ├── ExportingCompaniesController.cs # /api/exportingcompanies
│   ├── ImportingCompaniesController.cs # /api/importingcompanies
│   ├── GeoController.cs              # /api/geo (GPS features)
│   └── HosController.cs              # /api/hos (Hours of Service)
│
├── 📁 Data/                           # Database Layer
│   ├── DispatchStackDbContext.cs     # EF Core DbContext
│   ├── Migrations/                   # (Created after running migrations)
│   ├── INDEX.md                      # 📖 Documentation index
│   ├── SETUP.md                      # 📖 Quick setup guide
│   ├── README.md                     # 📖 Detailed reference
│   ├── PGADMIN_SETUP.md              # 📖 pgAdmin guide
│   ├── create-db-simple.sql          # 📜 Reference: manual DB creation
│   └── init-database.sql             # 📜 Reference: manual table creation
│
├── 📁 Models/
│   ├── 📁 Entities/                  # Database Entities
│   │   ├── Driver.cs
│   │   ├── Truck.cs
│   │   ├── ExportingCompany.cs
│   │   └── ImportingCompany.cs
│   │
│   └── 📁 DTOs/                      # Data Transfer Objects
│       ├── DriverDto.cs
│       ├── TruckDto.cs
│       ├── ExportingCompanyDto.cs
│       ├── ImportingCompanyDto.cs
│       ├── ComplianceStatusDto.cs
│       ├── CountryDto.cs
│       ├── EvaluateRequestDto.cs
│       ├── EvaluateResponseDto.cs
│       ├── HosStateDto.cs
│       ├── LatLngDto.cs
│       └── RulesDto.cs
│
├── 📁 Services/                       # Business Logic
│   ├── DriverService.cs              # Driver CRUD operations
│   ├── TruckService.cs               # Truck CRUD operations
│   ├── ExportingCompanyService.cs    # Exporting company CRUD
│   └── ImportingCompanyService.cs    # Importing company CRUD
│
├── 📄 Program.cs                      # App startup & configuration
├── 📄 appsettings.json                # Production config
├── 📄 appsettings.Development.json    # Development config
├── 📄 .env.example                    # Environment variables template
└── 📄 DispatchStack.Api.csproj        # Project file

```

---

## 🔄 Request Flow

```
HTTP Request
    ↓
Controller (validates input, maps DTOs)
    ↓
Service (business logic)
    ↓
DbContext (EF Core)
    ↓
PostgreSQL Database
```

Example: `POST /api/drivers`
```
DriversController.Create()
    → DriverService.CreateAsync()
        → DispatchStackDbContext.Drivers.Add()
            → PostgreSQL INSERT
```

---

## 🗄️ Database Schema

```
dispatchstack (Database)
│
└── public (Schema)
    ├── Drivers
    │   └── PK: Id (UUID)
    │   └── UNIQUE: LicenseNumber
    │
    ├── Trucks
    │   └── PK: Id (UUID)
    │   └── UNIQUE: UnitNumber, VIN
    │
    ├── ExportingCompanies
    │   └── PK: Id (UUID)
    │
    ├── ImportingCompanies
    │   └── PK: Id (UUID)
    │
    └── __EFMigrationsHistory
        └── Tracks applied migrations
```

---

## 🎨 Design Patterns Used

- **Repository Pattern** - Services act as repositories for data access
- **DTO Pattern** - Separate API contracts from database entities
- **Dependency Injection** - Services injected into controllers
- **Code-First Migrations** - Database schema from C# models

---

## 📝 Key Files Explained

### `DispatchStackDbContext.cs`
- Inherits from `DbContext`
- Defines `DbSet<T>` for each entity
- Configures entity mappings (constraints, indexes, max lengths)

### `*Service.cs` Files
- Implement `I*Service` interface
- Handle CRUD operations via DbContext
- Manage timestamps (CreatedAt, UpdatedAt)

### `*Controller.cs` Files
- Handle HTTP requests/responses
- Map between DTOs and entities
- Return appropriate status codes (200, 201, 404, etc.)

### `Program.cs`
- Registers DbContext with PostgreSQL provider
- Registers services with dependency injection
- Configures JSON serialization (camelCase)
- Sets up CORS

---

## 🔑 Important Notes

1. **Services are Scoped** - New instance per request (required for EF Core)
2. **DTOs separate from Entities** - API models don't expose internal database structure
3. **Async/await everywhere** - All database operations are asynchronous
4. **Timestamps automatic** - CreatedAt/UpdatedAt set in services
5. **Guid IDs** - Generated for new records

---

## 🚀 Ready to Start?

Follow [DATABASE_SETUP.md](DATABASE_SETUP.md) to create your database!
