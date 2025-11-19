#!/bin/bash

# Update .env.local with your email credentials
# Run this script: chmod +x update-env.sh && ./update-env.sh

echo "=================================================="
echo "  VR NextGen - Contact Form Email Setup"
echo "=================================================="
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✓ Found .env.local file"
else
    echo "✗ .env.local not found. Copying from env.template..."
    cp env.template .env.local
    echo "✓ Created .env.local"
fi

echo ""
echo "Current configuration:"
echo "----------------------------------------"
grep -E "MAIL_|CONTACT_" .env.local || echo "(No MAIL_/CONTACT_ variables found)"
echo ""

echo "=================================================="
echo "  Email Configuration Required"
echo "=================================================="
echo ""

# Prompt for email settings
echo "Enter your SMTP settings:"
echo ""

read -p "Gmail Address (e.g., yourname@gmail.com): " MAIL_USER
read -sp "Gmail App Password (16 characters, no spaces): " MAIL_PASS
echo ""
read -p "Destination Email (where contact form messages go): " RECEIVE_EMAIL

echo ""
echo "Using these settings:"
echo "  Host: smtp.gmail.com"
echo "  Port: 465"
echo "  Secure: true"
echo "  User: $MAIL_USER"
echo "  Password: ****************"
echo "  Destination: $RECEIVE_EMAIL"
echo ""

read -p "Update .env.local with these settings? (y/n): " CONFIRM

if [[ "$CONFIRM" == "y" || "$CONFIRM" == "Y" ]]; then
    # Update .env.local
    sed -i.bak \
        -e "s|MAIL_USER=.*|MAIL_USER=$MAIL_USER|" \
        -e "s|MAIL_PASS=.*|MAIL_PASS=$MAIL_PASS|" \
        -e "s|CONTACT_RECEIVE_EMAIL=.*|CONTACT_RECEIVE_EMAIL=$RECEIVE_EMAIL|" \
        .env.local
    
    rm -f .env.local.bak
    
    echo ""
    echo "✓ .env.local updated successfully!"
    echo ""
    echo "Next steps:"
    echo "  1. Restart dev server if running"
    echo "  2. Visit: http://localhost:3000/contact"
    echo "  3. Submit a test message"
    echo "  4. Check email arrives at: $RECEIVE_EMAIL"
    echo ""
else
    echo ""
    echo "✗ Update cancelled. Edit .env.local manually."
    echo ""
fi

echo "=================================================="
echo "  Gmail App Password Instructions"
echo "=================================================="
echo ""
echo "If you don't have a Gmail App Password:"
echo "  1. Enable 2FA: https://myaccount.google.com/security"
echo "  2. Generate App Password: https://myaccount.google.com/apppasswords"
echo "  3. Select 'Mail' and your device"
echo "  4. Copy the 16-character password"
echo "  5. Run this script again"
echo ""


