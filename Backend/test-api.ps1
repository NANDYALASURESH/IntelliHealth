# IntelliHealth API Testing Script
# This script tests all features systematically

$baseUrl = "http://localhost:5000"
$results = @()

# Helper function to make API calls
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [string]$Token = "",
        [object]$Body = $null
    )
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($Token) {
            $headers["Authorization"] = "Bearer $Token"
        }
        
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $headers
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-WebRequest @params
        $content = $response.Content | ConvertFrom-Json
        
        Write-Host "✅ SUCCESS" -ForegroundColor Green
        Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "Response:" -ForegroundColor White
        Write-Host ($content | ConvertTo-Json -Depth 5) -ForegroundColor White
        
        return @{
            Name = $Name
            Status = "PASS"
            StatusCode = $response.StatusCode
            Response = $content
        }
    }
    catch {
        Write-Host "❌ FAILED" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            Write-Host "Response Body: $errorBody" -ForegroundColor Red
        }
        
        return @{
            Name = $Name
            Status = "FAIL"
            Error = $_.Exception.Message
        }
    }
}

# Store tokens
$patientToken = ""
$doctorToken = ""
$adminToken = ""
$patientId = ""
$doctorId = ""
$appointmentId = ""

Write-Host "========================================" -ForegroundColor Magenta
Write-Host "INTELLIHEALTH API TESTING" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

# 1. HEALTH CHECK
$results += Test-Endpoint -Name "Health Check" -Method "GET" -Url "$baseUrl/health"

# 2. REGISTER PATIENT
$patientData = @{
    name = "Test Patient"
    email = "testpatient$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
    password = "Patient@123"
    role = "patient"
    gender = "male"
    dateOfBirth = "1990-01-01"
    phone = "+12025550100"
    emergencyContact = @{
        name = "Emergency Contact"
        phone = "+12025550111"
        relationship = "Spouse"
    }
}

$result = Test-Endpoint -Name "Register Patient" -Method "POST" -Url "$baseUrl/api/auth/register" -Body $patientData
$results += $result
if ($result.Response.data.token) {
    $patientToken = $result.Response.data.token
    $patientId = $result.Response.data.user._id
    Write-Host "Patient Token Saved: $patientToken" -ForegroundColor Green
}

# 3. REGISTER DOCTOR
$doctorData = @{
    name = "Dr. Test Doctor"
    email = "testdoctor$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
    password = "Doctor@123"
    role = "doctor"
    gender = "female"
    dateOfBirth = "1985-05-15"
    phone = "+12025550200"
    emergencyContact = @{
        name = "Emergency Contact"
        phone = "+12025550211"
        relationship = "Spouse"
    }
    specialization = "Cardiology"
    licenseNumber = "DOC-TEST-$(Get-Date -Format 'yyyyMMddHHmmss')"
    experience = 10
    consultationFee = 1500
    department = "Cardiology"
}

$result = Test-Endpoint -Name "Register Doctor" -Method "POST" -Url "$baseUrl/api/auth/register" -Body $doctorData
$results += $result
if ($result.Response.data.token) {
    $doctorToken = $result.Response.data.token
    $doctorId = $result.Response.data.user._id
    Write-Host "Doctor Token Saved: $doctorToken" -ForegroundColor Green
}

# 4. LOGIN ADMIN
$adminData = @{
    email = "admin@gmail.com"
    password = "Suresh@123"
}

$result = Test-Endpoint -Name "Login Admin" -Method "POST" -Url "$baseUrl/api/auth/login" -Body $adminData
$results += $result
if ($result.Response.data.token) {
    $adminToken = $result.Response.data.token
    Write-Host "Admin Token Saved: $adminToken" -ForegroundColor Green
}

# 5. GET CURRENT USER (Patient)
$results += Test-Endpoint -Name "Get Current User (Patient)" -Method "GET" -Url "$baseUrl/api/auth/me" -Token $patientToken

# 6. PATIENT DASHBOARD STATS
$results += Test-Endpoint -Name "Patient Dashboard Stats" -Method "GET" -Url "$baseUrl/api/patient/dashboard-stats" -Token $patientToken

# 7. PATIENT GET APPOINTMENTS
$results += Test-Endpoint -Name "Patient Get Appointments" -Method "GET" -Url "$baseUrl/api/patient/appointments" -Token $patientToken

# 8. BOOK APPOINTMENT (if we have a doctor)
if ($doctorId) {
    $appointmentData = @{
        doctor = $doctorId
        scheduledDate = "2026-02-15"
        scheduledTime = "10:30"
        type = "consultation"
        reasonForVisit = "Regular health checkup and consultation"
    }
    
    $result = Test-Endpoint -Name "Book Appointment" -Method "POST" -Url "$baseUrl/api/patient/appointments" -Token $patientToken -Body $appointmentData
    $results += $result
    if ($result.Response.data._id) {
        $appointmentId = $result.Response.data._id
        Write-Host "Appointment ID Saved: $appointmentId" -ForegroundColor Green
    }
}

# 9. DOCTOR DASHBOARD STATS
$results += Test-Endpoint -Name "Doctor Dashboard Stats" -Method "GET" -Url "$baseUrl/api/doctor/dashboard-stats" -Token $doctorToken

# 10. DOCTOR GET APPOINTMENTS
$results += Test-Endpoint -Name "Doctor Get Appointments" -Method "GET" -Url "$baseUrl/api/doctor/appointments" -Token $doctorToken

# 11. DOCTOR GET PATIENTS
$results += Test-Endpoint -Name "Doctor Get Patients" -Method "GET" -Url "$baseUrl/api/doctor/patients" -Token $doctorToken

# 12. UPDATE APPOINTMENT STATUS (if we have an appointment)
if ($appointmentId) {
    $statusData = @{
        status = "confirmed"
    }
    
    $results += Test-Endpoint -Name "Update Appointment Status" -Method "PATCH" -Url "$baseUrl/api/doctor/appointments/$appointmentId/status" -Token $doctorToken -Body $statusData
}

# 13. ADMIN DASHBOARD STATS
$results += Test-Endpoint -Name "Admin Dashboard Stats" -Method "GET" -Url "$baseUrl/api/admin/dashboard-stats" -Token $adminToken

# 14. ADMIN GET ALL USERS
$results += Test-Endpoint -Name "Admin Get All Users" -Method "GET" -Url "$baseUrl/api/admin/users" -Token $adminToken

# 15. ADMIN GET DOCTORS
$results += Test-Endpoint -Name "Admin Get Doctors" -Method "GET" -Url "$baseUrl/api/admin/users?role=doctor" -Token $adminToken

# 16. GET ALL DOCTORS (Public)
$results += Test-Endpoint -Name "Get All Doctors (Public)" -Method "GET" -Url "$baseUrl/api/doctors"

# 17. PATIENT UPDATE PROFILE
$profileData = @{
    phone = "+12025550150"
}

$results += Test-Endpoint -Name "Patient Update Profile" -Method "PUT" -Url "$baseUrl/api/patient/profile" -Token $patientToken -Body $profileData

# SUMMARY
Write-Host "`n`n========================================" -ForegroundColor Magenta
Write-Host "TEST SUMMARY" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

$passed = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($results | Where-Object { $_.Status -eq "FAIL" }).Count
$total = $results.Count

Write-Host "`nTotal Tests: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host "Success Rate: $([math]::Round(($passed/$total)*100, 2))%" -ForegroundColor Cyan

Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "DETAILED RESULTS" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta

foreach ($result in $results) {
    $status = if ($result.Status -eq "PASS") { "✅" } else { "❌" }
    $color = if ($result.Status -eq "PASS") { "Green" } else { "Red" }
    Write-Host "$status $($result.Name)" -ForegroundColor $color
}

Write-Host "`n"
