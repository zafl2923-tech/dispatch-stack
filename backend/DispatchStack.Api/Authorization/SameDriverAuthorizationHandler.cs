using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace DispatchStack.Api.Authorization
{
    // Requirement: User must be accessing their own driver data
    public class SameDriverRequirement : IAuthorizationRequirement
    {
    }

    // Handler: Check if the user is accessing their own driver data
    public class SameDriverHandler : AuthorizationHandler<SameDriverRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SameDriverHandler(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            SameDriverRequirement requirement)
        {
            var user = context.User;

            // Admin and Dispatcher can access any driver data
            var role = user.FindFirst(ClaimTypes.Role)?.Value;
            if (role == "Admin" || role == "Dispatcher")
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            // For truckers, check if they're accessing their own data
            if (role == "Trucker")
            {
                var driverIdClaim = user.FindFirst("DriverId")?.Value;
                
                // Get the requested driver ID from route
                var httpContext = _httpContextAccessor.HttpContext;
                if (httpContext != null)
                {
                    var routeDriverId = httpContext.Request.RouteValues["id"]?.ToString();
                    
                    // If no specific driver is requested (e.g., listing drivers), deny
                    if (string.IsNullOrEmpty(routeDriverId))
                    {
                        context.Fail();
                        return Task.CompletedTask;
                    }

                    // Check if the trucker is accessing their own data
                    if (!string.IsNullOrEmpty(driverIdClaim) && driverIdClaim == routeDriverId)
                    {
                        context.Succeed(requirement);
                        return Task.CompletedTask;
                    }
                }
            }

            context.Fail();
            return Task.CompletedTask;
        }
    }
}
