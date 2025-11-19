# Update .env.local with your email credentials
# Run this script: .\update-env.ps1

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  VR NextGen - Contact Form Email Setup" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "✓ Found .env.local file" -ForegroundColor Green
} else {
    Write-Host "✗ .env.local not found. Copying from env.template..." -ForegroundColor Yellow
    Copy-Item "env.template" ".env.local"
    Write-Host "✓ Created .env.local" -ForegroundColor Green
}

Write-Host ""
Write-Host "Current configuration:" -ForegroundColor Yellow
Write-Host "----------------------------------------"
Get-Content ".env.local" | Select-String "MAIL_|CONTACT_" | ForEach-Object { Write-Host $_ }
Write-Host ""

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Email Configuration Required" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Prompt for email settings
Write-Host "Enter your SMTP settings:" -ForegroundColor Yellow
Write-Host ""

$mailUser = Read-Host "Gmail Address (e.g., yourname@gmail.com)"
$mailPass = Read-Host "Gmail App Password (16 characters, no spaces)" -AsSecureString
$mailPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($mailPass))
$receiveEmail = Read-Host "Destination Email (where contact form messages go)"

Write-Host ""
Write-Host "Using these settings:" -ForegroundColor Yellow
Write-Host "  Host: smtp.gmail.com"
Write-Host "  Port: 465"
Write-Host "  Secure: true"
Write-Host "  User: $mailUser"
Write-Host "  Password: ****************"
Write-Host "  Destination: $receiveEmail"
Write-Host ""

$confirm = Read-Host "Update .env.local with these settings? (y/n)"

if ($confirm -eq "y" -or $confirm -eq "Y") {
    # Read current content
    $content = Get-Content ".env.local" -Raw
    
    # Replace values
    $content = $content -replace 'MAIL_USER=.*', "MAIL_USER=$mailUser"
    $content = $content -replace 'MAIL_PASS=.*', "MAIL_PASS=$mailPassPlain"
    $content = $content -replace 'CONTACT_RECEIVE_EMAIL=.*', "CONTACT_RECEIVE_EMAIL=$receiveEmail"
    
    # Write back
    Set-Content ".env.local" $content -NoNewline
    
    Write-Host ""
    Write-Host "✓ .env.local updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Restart dev server if running" -ForegroundColor White
    Write-Host "  2. Visit: http://localhost:3000/contact" -ForegroundColor White
    Write-Host "  3. Submit a test message" -ForegroundColor White
    Write-Host "  4. Check email arrives at: $receiveEmail" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Update cancelled. Edit .env.local manually." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Gmail App Password Instructions" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you don't have a Gmail App Password:" -ForegroundColor Yellow
Write-Host "  1. Enable 2FA: https://myaccount.google.com/security" -ForegroundColor White
Write-Host "  2. Generate App Password: https://myaccount.google.com/apppasswords" -ForegroundColor White
Write-Host "  3. Select 'Mail' and your device" -ForegroundColor White
Write-Host "  4. Copy the 16-character password" -ForegroundColor White
Write-Host "  5. Run this script again" -ForegroundColor White
Write-Host ""


