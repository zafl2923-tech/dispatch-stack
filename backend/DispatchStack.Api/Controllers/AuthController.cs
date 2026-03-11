using DispatchStack.Api.Models.DTOs;
using DispatchStack.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DispatchStack.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            // Check if this is the first user (bootstrap scenario)
            var isFirstUser = await _authService.IsFirstUserAsync();

            if (!isFirstUser)
            {
                // After first user, only admins and dispatchers can create accounts
                if (!User.Identity?.IsAuthenticated ?? true)
                {
                    return Unauthorized(new { message = "Authentication required to create accounts." });
                }

                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                if (role != "Admin" && role != "Dispatcher")
                {
                    return Forbid();
                }
            }
            else
            {
                // First user must be an admin
                if (request.Role != "Admin")
                {
                    return BadRequest(new { message = "First user must be an Admin." });
                }
            }

            var response = await _authService.RegisterAsync(request);

            if (response == null)
            {
                return BadRequest(new { message = "Registration failed. Username or email may already exist, or invalid driver ID." });
            }

            return Ok(response);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            var response = await _authService.LoginAsync(request);

            if (response == null)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            return Ok(response);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized();
            }

            var user = await _authService.GetUserByIdAsync(userGuid);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
    }
}
