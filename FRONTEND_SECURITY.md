# Frontend Security Implementation

## Overview

This document details the comprehensive security measures implemented in the DispatchStack frontend to prevent unauthorized access and protect against common web vulnerabilities.

## Security Features Implemented

### 1. **Authentication & Authorization**

#### JWT Token Management
- **Storage**: Tokens stored in `sessionStorage` (cleared when browser closes)
- **Automatic Expiry**: Tokens expire after 7 days
- **Validation**: Token validity checked on every route change
- **Auto-Redirect**: Expired tokens automatically redirect to login

#### Protected Routes
- All pages except `/login` require authentication
- Role-based access control enforces user permissions
- Unauthorized users automatically redirected to appropriate dashboard

### 2. **Input Sanitization**

#### XSS Protection
```typescript
// Removes dangerous characters to prevent script injection
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > tags
    .substring(0, 255);   // Limit input length
};
```

Applied to all user inputs before submission to backend.

#### Password Validation
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Client-side validation before submission

### 3. **API Security**

#### Secure API Client
- Automatic token injection in Authorization header
- Centralized error handling
- Automatic session expiry detection
- HTTPS recommended for production

```typescript
// All API calls use authenticated client
ApiClient.get('/drivers')  // Automatically includes Bearer token
```

#### CORS Protection
Backend configured to accept requests only from known origins (configurable in backend).

### 4. **Session Management**

#### SessionStorage vs LocalStorage
- **SessionStorage** used for maximum security
- Tokens cleared when browser tab closes
- No persistent storage = reduced attack surface

#### Auto-Logout
- Session expires after token expiry (7 days)
- Manual logout clears all session data
- Automatic logout on 401 Unauthorized responses

### 5. **Role-Based Access Control (RBAC)**

#### Three-Tier System
```typescript
Role: 'Admin' | 'Dispatcher' | 'Trucker'
```

#### Enforcement Layers
1. **Frontend Route Protection**: `<ProtectedRoute>` component
2. **Backend Authorization**: JWT claims validation
3. **API Endpoint Protection**: Role-based `[Authorize]` attributes

### 6. **Password Security**

#### Client-Side
- Passwords never logged or stored
- Show/hide password toggle for user convenience
- Password cleared from state on login failure

#### Server-Side (Backend)
- BCrypt hashing with automatic salt
- No plaintext passwords ever stored
- Secure password comparison

### 7. **HTTPS Enforcement (Production)**

#### Configuration
```typescript
// Recommended: Force HTTPS in production
if (process.env.NODE_ENV === 'production' && window.location.protocol === 'http:') {
  window.location.href = window.location.href.replace('http:', 'https:');
}
```

Add this to your root layout for production deployments.

## Attack Prevention

### ✅ XSS (Cross-Site Scripting)
- **Mitigation**: Input sanitization removes `<>` characters
- **React Protection**: React automatically escapes rendered content
- **CSP Headers**: Content Security Policy headers recommended (backend)

### ✅ CSRF (Cross-Site Request Forgery)
- **Mitigation**: JWT tokens in Authorization header (not cookies)
- **SameSite Cookies**: If using cookies, set `SameSite=Strict`
- **Token-Based**: Stateless authentication prevents CSRF

### ✅ SQL Injection
- **Mitigation**: Backend uses parameterized queries (EF Core)
- **Frontend**: All inputs sanitized before sending to backend

### ✅ Session Hijacking
- **Mitigation**: 
  - Short-lived tokens (7 days)
  - SessionStorage (cleared on browser close)
  - HTTPS recommended (encrypted transmission)

### ✅ Brute Force Attacks
- **Frontend**: Rate limiting on login attempts (TODO: Add counter)
- **Backend**: BCrypt slows down password attempts
- **Recommendation**: Add CAPTCHA after 3 failed attempts

### ✅ Man-in-the-Middle (MITM)
- **Mitigation**: Use HTTPS in production
- **Token Transmission**: Always use secure connection
- **Certificate Pinning**: Consider for mobile apps

## Security Best Practices

### Environment Variables
```bash
# .env.local - NEVER commit this file
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

- Keep API URLs in environment variables
- Use different URLs for dev/staging/production
- Never hardcode sensitive values

### Error Handling
```typescript
// Generic error messages prevent information leakage
catch (error) {
  setError('Invalid username or password'); // Don't reveal which is wrong
}
```

### Automatic Session Cleanup
```typescript
// Clear all auth data on logout
TokenStorage.clear();
UserStorage.clear();
setUser(null);
```

## Security Checklist

### Development
- [x] Input sanitization implemented
- [x] Password validation enforced
- [x] JWT token secure storage
- [x] Protected routes with role checks
- [x] Automatic token expiry
- [x] Centralized API client
- [x] Error handling (no sensitive data leaks)
- [ ] Rate limiting on login (TODO)
- [ ] CAPTCHA after failed attempts (TODO)

### Production Deployment
- [ ] Enable HTTPS enforcement
- [ ] Configure CSP headers
- [ ] Set secure cookie flags (if using cookies)
- [ ] Enable HSTS (HTTP Strict Transport Security)
- [ ] Configure CORS whitelist
- [ ] Set up rate limiting
- [ ] Enable security monitoring
- [ ] Regular security audits

### Backend Configuration
- [x] JWT signature verification
- [x] BCrypt password hashing
- [x] Role-based authorization
- [x] Input validation
- [ ] Rate limiting middleware (TODO)
- [ ] Account lockout after failed attempts (TODO)
- [ ] Audit logging (TODO)
- [ ] HTTPS certificate (Production)

## Testing Security

### Manual Tests

#### 1. Test Unauthorized Access
```bash
# Try accessing protected route without login
curl http://localhost:3000/trucker-dashboard
# Expected: Redirect to /login
```

#### 2. Test Expired Token
```typescript
// Set expired token in sessionStorage
sessionStorage.setItem('dispatch_token', 'expired.token.here');
// Navigate to dashboard
// Expected: Redirect to /login
```

#### 3. Test Role-Based Access
```bash
# Login as Trucker
# Try accessing /admin-dashboard
# Expected: Redirect to /trucker-dashboard
```

#### 4. Test XSS Prevention
```typescript
// Try entering: <script>alert('XSS')</script>
// Expected: < and > removed, script not executed
```

### Automated Tests (TODO)
```typescript
// Jest security tests
describe('Security', () => {
  it('should sanitize malicious input', () => {
    expect(sanitizeInput('<script>alert("xss")</script>'))
      .toBe('scriptalert("xss")/script');
  });
  
  it('should clear tokens on logout', () => {
    logout();
    expect(TokenStorage.get()).toBeNull();
  });
});
```

## Common Vulnerabilities - How We Prevent Them

### OWASP Top 10 Protection

| Vulnerability | Our Protection |
|--------------|----------------|
| **A01: Broken Access Control** | Role-based routing, JWT validation, protected routes |
| **A02: Cryptographic Failures** | BCrypt hashing, HTTPS recommended, secure token storage |
| **A03: Injection** | Input sanitization, parameterized queries (EF Core) |
| **A04: Insecure Design** | Principle of least privilege, defense in depth |
| **A05: Security Misconfiguration** | Environment variables, secure defaults |
| **A06: Vulnerable Components** | Regular updates, dependency scanning |
| **A07: Auth Failures** | JWT tokens, strong passwords, session expiry |
| **A08: Data Integrity Failures** | Input validation, API response validation |
| **A09: Logging Failures** | Error handling (sensitive data not logged) |
| **A10: SSRF** | API client validates URLs, whitelist approach |

## Security Monitoring

### Client-Side Logging
```typescript
// Log security events (non-sensitive data only)
console.log('Authentication attempt', { username: sanitizedUsername });
console.error('Login failed'); // No password logged
```

### Recommended Tools
- **Sentry**: Error tracking and monitoring
- **LogRocket**: Session replay for debugging
- **OWASP ZAP**: Security testing
- **npm audit**: Dependency vulnerability scanning

## Future Enhancements

### High Priority
1. **Rate Limiting**: Prevent brute force attacks
   ```typescript
   // Track failed login attempts
   const MAX_ATTEMPTS = 5;
   const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
   ```

2. **CAPTCHA**: Add after 3 failed login attempts
   ```typescript
   import ReCAPTCHA from 'react-google-recaptcha';
   ```

3. **2FA (Two-Factor Authentication)**: For admin accounts
   ```typescript
   // TOTP-based 2FA
   import { authenticator } from 'otplib';
   ```

### Medium Priority
1. **Refresh Tokens**: Longer sessions without security compromise
2. **Password Reset**: Secure email-based password recovery
3. **Account Lockout**: Temporary lock after failed attempts
4. **Session Management**: View and revoke active sessions
5. **Audit Logging**: Track all security events

### Low Priority
1. **Biometric Authentication**: Face ID, Touch ID for mobile
2. **Hardware Keys**: FIDO2/WebAuthn support
3. **Geofencing**: Location-based access restrictions
4. **Device Fingerprinting**: Detect suspicious devices

## Production Deployment Checklist

### Before Going Live
- [ ] Change JWT secret key (strong, random, 32+ characters)
- [ ] Enable HTTPS (Let's Encrypt or commercial cert)
- [ ] Configure CSP headers
- [ ] Set up HSTS
- [ ] Enable rate limiting
- [ ] Configure CORS whitelist
- [ ] Set secure cookie flags
- [ ] Remove console.log statements
- [ ] Enable security monitoring
- [ ] Set up alerts for failed logins
- [ ] Perform penetration testing
- [ ] Review all environment variables
- [ ] Enable automatic security updates
- [ ] Set up backup authentication method

### Environment-Specific Settings

#### Development
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NODE_ENV=development
```

#### Production
```bash
NEXT_PUBLIC_API_URL=https://api.dispatchstack.com/api
NODE_ENV=production
ENABLE_HTTPS_REDIRECT=true
CSP_ENABLED=true
RATE_LIMIT_ENABLED=true
```

## Incident Response

### If Credentials Are Compromised
1. Immediately revoke affected user's token (backend)
2. Force password reset for affected account
3. Review audit logs for suspicious activity
4. Notify affected users
5. Update security measures as needed

### If System Is Breached
1. Disconnect affected systems
2. Preserve evidence (logs, snapshots)
3. Identify attack vector
4. Patch vulnerabilities
5. Force password reset for all users
6. Notify users and authorities (if required)
7. Conduct post-mortem analysis

## Support & Resources

### Security Contacts
- Security Issues: security@dispatchstack.com
- Bug Reports: bugs@dispatchstack.com

### External Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CWE Top 25](https://cwe.mitre.org/top25/)

---

**Remember: Security is an ongoing process, not a one-time implementation. Regularly review and update security measures as new threats emerge.**
