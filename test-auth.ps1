# Authentication Test
$baseUrl = "http://localhost:5000/api"
Write-Host "Testing Auth..." -ForegroundColor Cyan

# Create admin
$admin = @{username="admin";email="admin@dispatchstack.com";password="Admin123!";role="Admin"} | ConvertTo-Json
$resp = Invoke-WebRequest -Uri "$baseUrl/auth/register" -Method POST -ContentType "application/json" -Body $admin -UseBasicParsing
$token = ($resp.Content | ConvertFrom-Json).token
Write-Host "Admin created. Token: $($token.Substring(0,20))..." -ForegroundColor Green

# Test login
$login = @{username="admin";password="Admin123!"} | ConvertTo-Json
$resp = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $login -UseBasicParsing
Write-Host "Login successful!" -ForegroundColor Green
Write-Host "Done!" -ForegroundColor Cyan