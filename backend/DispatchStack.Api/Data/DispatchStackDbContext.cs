using DispatchStack.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace DispatchStack.Api.Data
{
    public class DispatchStackDbContext : DbContext
    {
        public DispatchStackDbContext(DbContextOptions<DispatchStackDbContext> options)
            : base(options)
        {
        }

        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Truck> Trucks { get; set; }
        public DbSet<ExportingCompany> ExportingCompanies { get; set; }
        public DbSet<ImportingCompany> ImportingCompanies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Driver>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LicenseNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.LicenseClass).HasMaxLength(10);
                entity.Property(e => e.LicenseCountry).HasMaxLength(100);
                entity.Property(e => e.Email).HasMaxLength(255);
                entity.Property(e => e.Phone).HasMaxLength(20);
                entity.Property(e => e.Address).HasMaxLength(500);
                entity.Property(e => e.City).HasMaxLength(100);
                entity.Property(e => e.Region).HasMaxLength(100);
                entity.Property(e => e.Country).HasMaxLength(100);
                entity.Property(e => e.PostalCode).HasMaxLength(20);
                entity.Property(e => e.EmploymentStatus).HasMaxLength(50);
                entity.HasIndex(e => e.LicenseNumber).IsUnique();
            });

            modelBuilder.Entity<Truck>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UnitNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Make).HasMaxLength(100);
                entity.Property(e => e.Model).HasMaxLength(100);
                entity.Property(e => e.VIN).HasMaxLength(17);
                entity.Property(e => e.LicensePlate).HasMaxLength(20);
                entity.Property(e => e.LicenseCountry).HasMaxLength(100);
                entity.Property(e => e.LicenseRegion).HasMaxLength(100);
                entity.Property(e => e.FuelType).HasMaxLength(50);
                entity.Property(e => e.Status).HasMaxLength(50);
                entity.HasIndex(e => e.UnitNumber).IsUnique();
                entity.HasIndex(e => e.VIN).IsUnique();
            });

            modelBuilder.Entity<ExportingCompany>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CompanyName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.BusinessNumber).HasMaxLength(50);
                entity.Property(e => e.TaxId).HasMaxLength(50);
                entity.Property(e => e.Address).HasMaxLength(500);
                entity.Property(e => e.City).HasMaxLength(100);
                entity.Property(e => e.Region).HasMaxLength(100);
                entity.Property(e => e.Country).HasMaxLength(100);
                entity.Property(e => e.PostalCode).HasMaxLength(20);
                entity.Property(e => e.ContactName).HasMaxLength(200);
                entity.Property(e => e.ContactEmail).HasMaxLength(255);
                entity.Property(e => e.ContactPhone).HasMaxLength(20);
                entity.Property(e => e.ExportLicenseNumber).HasMaxLength(100);
                entity.Property(e => e.USMCAStatus).HasMaxLength(50);
            });

            modelBuilder.Entity<ImportingCompany>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CompanyName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.BusinessNumber).HasMaxLength(50);
                entity.Property(e => e.TaxId).HasMaxLength(50);
                entity.Property(e => e.Address).HasMaxLength(500);
                entity.Property(e => e.City).HasMaxLength(100);
                entity.Property(e => e.Region).HasMaxLength(100);
                entity.Property(e => e.Country).HasMaxLength(100);
                entity.Property(e => e.PostalCode).HasMaxLength(20);
                entity.Property(e => e.ContactName).HasMaxLength(200);
                entity.Property(e => e.ContactEmail).HasMaxLength(255);
                entity.Property(e => e.ContactPhone).HasMaxLength(20);
                entity.Property(e => e.ImportLicenseNumber).HasMaxLength(100);
                entity.Property(e => e.USMCAStatus).HasMaxLength(50);
            });
        }
    }
}
