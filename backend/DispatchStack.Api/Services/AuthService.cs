using DispatchStack.Api.Data;
using DispatchStack.Api.Models;
using DispatchStack.Api.Models.DTOs;
using DispatchStack.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DispatchStack.Api.Services
{
    public interface IAuthService
    {
        Task<AuthResponse?> RegisterAsync(RegisterRequest request);
        Task<AuthResponse?> LoginAsync(LoginRequest request);
        Task<UserDto?> GetUserByIdAsync(Guid userId);
        Task<UserDto?> GetUserByUsernameAsync(string username);
        Task<bool> IsFirstUserAsync();
    }

    public class AuthService : IAuthService
    {
        private readonly DispatchStackDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(DispatchStackDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
        {
            // Validate role
            if (!IsValidRole(request.Role))
            {
                return null;
            }

            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return null;
            }

            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return null;
            }

            // If registering a trucker, verify driver exists
            if (request.Role == UserRoles.Trucker && request.DriverId.HasValue)
            {
                var driver = await _context.Drivers.FindAsync(request.DriverId.Value);
                if (driver == null)
                {
                    return null;
                }

                // Check if driver already has a user account
                if (await _context.Users.AnyAsync(u => u.DriverId == request.DriverId.Value))
                {
                    return null;
                }
            }

            // If registering a company, verify company exists
            if (request.Role == UserRoles.Company && request.CompanyId.HasValue)
            {
                var company = await _context.Companies.FindAsync(request.CompanyId.Value);
                if (company == null)
                {
                    return null;
                }

                // Check if company already has a user account
                if (await _context.Users.AnyAsync(u => u.CompanyId == request.CompanyId.Value))
                {
                    return null;
                }
            }

            // Create user
            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = request.Username,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = request.Role,
                DriverId = request.DriverId,
                CompanyId = request.CompanyId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generate token
            var token = GenerateJwtToken(user);

            return new AuthResponse
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                DriverId = user.DriverId,
                CompanyId = user.CompanyId
            };
        }

        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null || !user.IsActive)
            {
                return null;
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return null;
            }

            // Generate token
            var token = GenerateJwtToken(user);

            return new AuthResponse
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                DriverId = user.DriverId,
                CompanyId = user.CompanyId
            };
        }

        public async Task<UserDto?> GetUserByIdAsync(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                IsActive = user.IsActive,
                DriverId = user.DriverId,
                CompanyId = user.CompanyId,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserDto?> GetUserByUsernameAsync(string username)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username);
            
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                IsActive = user.IsActive,
                DriverId = user.DriverId,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<bool> IsFirstUserAsync()
        {
            return !await _context.Users.AnyAsync();
        }

        private string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!";
            var jwtIssuer = _configuration["Jwt:Issuer"] ?? "DispatchStack";
            var jwtAudience = _configuration["Jwt:Audience"] ?? "DispatchStack";

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("DriverId", user.DriverId?.ToString() ?? string.Empty),
                new Claim("CompanyId", user.CompanyId?.ToString() ?? string.Empty)
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7), // Token valid for 7 days
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static bool IsValidRole(string role)
        {
            return role == UserRoles.Admin 
                || role == UserRoles.Dispatcher 
                || role == UserRoles.Trucker
                || role == UserRoles.Company;
        }
    }
}
