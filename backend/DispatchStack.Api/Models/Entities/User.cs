namespace DispatchStack.Api.Models.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty; // "Trucker", "Dispatcher", "Admin", "Company"
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation property - if user is a trucker, link to their driver profile
        public Guid? DriverId { get; set; }
        public Driver? Driver { get; set; }

        // Navigation property - if user is a company, link to their company profile
        public Guid? CompanyId { get; set; }
        public Company? Company { get; set; }
    }
}
