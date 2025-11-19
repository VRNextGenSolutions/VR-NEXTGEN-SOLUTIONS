# Contact Form Setup Instructions

## ✅ Completed Steps

The following has been implemented and configured:

### 1. Backend Implementation ✓
- ✅ API route: `/api/contact` with security headers, rate limiting, honeypot protection
- ✅ Nodemailer integration for email sending
- ✅ Server-side validation and sanitization
- ✅ Optional reCAPTCHA v3 support
- ✅ Safe error handling and logging

### 2. Frontend Implementation ✓
- ✅ Contact form with client-side validation
- ✅ Accessible success/error messaging (ARIA live regions)
- ✅ Hidden honeypot field for spam prevention
- ✅ Loading states and disabled submit during processing
- ✅ Optional reCAPTCHA integration

### 3. Dependencies Installed ✓
- ✅ `nodemailer` v6.10.1 added to package.json
- ✅ `@types/nodemailer` v6.4.21 added as dev dependency
- ✅ Dependencies installed via `npm install`

### 4. Environment Template Created ✓
- ✅ `env.template` created with all required variables
- ✅ `.env.local` generated from template

---

## 🚀 Next Steps for You

### Step 0: Supabase Connection (New)

1. **Copy the template:** `cp env.template .env.local` (already done for you if you ran `update-env`).
2. **Update `.env.local` with your Supabase project values:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=<project-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-or-publishable-key>
   EXPO_PUBLIC_SUPABASE_URL=<project-url>
   EXPO_PUBLIC_SUPABASE_KEY=<publishable-key preferred>
   SUPABASE_PROJECT_ID=<project-ref>
   SUPABASE_DB_PASSWORD=<database-password>
   SUPABASE_ACCESS_TOKEN=<personal-access-token>
   ```
3. **Expo-specific note:** Expo reads `EXPO_PUBLIC_*` variables when bundling native apps. Use a [publishable key](https://supabase.com/docs/guides/platform/anon-publishable-keys) when you rotate credentials.
4. **Security reminder:** `.env.local` stays git-ignored; add the same values inside your hosting provider (Vercel/Netlify) and Expo EAS dashboard before deploying.

### Step 1: Configure Email Credentials

Edit `.env.local` and replace the placeholder values:

```bash
# Open .env.local in your editor
code .env.local  # or use your preferred editor
```

**For Gmail (Recommended for development):**

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Copy the 16-character password
3. **Update .env.local:**
   ```env
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=465
   MAIL_SECURE=true
   MAIL_USER=your-actual-email@gmail.com
   MAIL_PASS=your-16-char-app-password
   CONTACT_RECEIVE_EMAIL=your-actual-email@gmail.com
   ```

**For Other Providers (SendGrid, AWS SES, Mailgun, etc):**

Refer to your provider's SMTP documentation for the correct host, port, and credentials.

---

### Step 2: (Optional) Enable reCAPTCHA Protection

If you want to add reCAPTCHA v3 spam protection:

1. **Get reCAPTCHA Keys:**
   - Go to: https://www.google.com/recaptcha/admin
   - Choose reCAPTCHA v3
   - Add your domain (use `localhost` for development)
   - Copy both the Site Key and Secret Key

2. **Update .env.local:**
   ```env
   RECAPTCHA_SECRET=your-secret-key-here
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key-here
   ```

---

### Step 3: Test the Contact Form

1. **Ensure dev server is running:**
   ```bash
   npm run dev
   ```

2. **Navigate to the contact page:**
   ```
   http://localhost:3000/contact
   ```

3. **Test valid submission:**
   - Fill in all fields with valid data
   - Click "Send Message"
   - ✅ Should see success message
   - ✅ Should receive email at CONTACT_RECEIVE_EMAIL

4. **Test validation:**
   - Try short message (< 10 chars) → should show error
   - Try invalid email → should show error
   - Leave fields empty → should show errors

5. **Test rate limiting:**
   - Submit 5+ messages quickly
   - 6th submission should return error: "Too many messages..."

6. **Test honeypot (spam protection):**
   - Open browser DevTools → Console
   - Run: `document.querySelector('input[name="company"]').value = "test"`
   - Submit form → should silently succeed (no email sent)

---

### Step 4: Verify Email Delivery

Check your inbox at the email address set in `CONTACT_RECEIVE_EMAIL`:

**Expected Email Format:**
```
From: VR NextGen Solutions <your-mail-user>
Reply-To: [user's email from form]
Subject: New Contact: [user's name]

Body:
Name: [user's name]
Email: [user's email]

[user's message]
```

---

## 🔧 Troubleshooting

### Issue: "Email transport is not configured properly"

**Solution:** Verify all MAIL_* environment variables are set in `.env.local`

```bash
# Check if variables are set
grep MAIL .env.local
```

### Issue: "Authentication failed" (Gmail)

**Solutions:**
1. Ensure 2FA is enabled on your Google account
2. Use an App Password, NOT your regular password
3. Verify MAIL_USER matches the account that generated the App Password
4. Check that the App Password has no spaces

### Issue: "Unable to send your message right now"

**Check server logs for detailed error:**
```bash
# Server console will show:
# "Nodemailer transporter verification failed"
# or
# "Contact form submission failed"
```

**Common causes:**
- Incorrect SMTP credentials
- Firewall blocking port 465/587
- ISP blocking SMTP connections
- Gmail "Less secure app access" issues (use App Password instead)

### Issue: Rate limit triggering too frequently

**Solution:** Adjust rate limit settings in `.env.local`:

```env
CONTACT_RATE_LIMIT_MAX=10           # Allow 10 submissions
CONTACT_RATE_LIMIT_WINDOW_MS=600000 # Within 10 minutes
```

---

## 📋 Manual Testing Checklist

- [ ] Valid form submission → receives email
- [ ] Invalid email format → shows client error
- [ ] Message too short (< 10 chars) → shows client error  
- [ ] Message too long (> 5000 chars) → shows client error
- [ ] Honeypot filled → silently blocked (no email)
- [ ] 6 rapid submissions → rate limit error on 6th
- [ ] SMTP misconfiguration → generic error to user, detailed log on server
- [ ] Success message clears form fields
- [ ] Loading state disables submit button
- [ ] Accessible (screen reader announces status)

---

## 🌐 Production Deployment

### Vercel

1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`:
   ```
   MAIL_HOST
   MAIL_PORT
   MAIL_SECURE
   MAIL_USER
   MAIL_PASS
   CONTACT_RECEIVE_EMAIL
   ```
3. Optional: Add reCAPTCHA keys
4. Deploy: `git push origin main`

### Other Platforms (Netlify, Railway, etc)

Add the same environment variables through their dashboard.

### Important Notes:
- ✅ Never commit `.env.local` to Git (already in .gitignore)
- ✅ Use different MAIL_USER/PASS for production
- ✅ Enable reCAPTCHA for production to prevent spam
- ✅ Consider using transactional email service (SendGrid, AWS SES) for better deliverability
- ✅ For multiple server instances, replace in-memory rate limiter with Redis

---

## 📧 Alternative Email Providers

### SendGrid (Recommended for Production)

```env
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_SECURE=true
MAIL_USER=apikey
MAIL_PASS=your-sendgrid-api-key
```

### AWS SES

```env
MAIL_HOST=email-smtp.us-east-1.amazonaws.com
MAIL_PORT=587
MAIL_SECURE=true
MAIL_USER=your-ses-smtp-username
MAIL_PASS=your-ses-smtp-password
```

### Mailgun

```env
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_SECURE=true
MAIL_USER=postmaster@your-domain.mailgun.org
MAIL_PASS=your-mailgun-smtp-password
```

---

## 📚 Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords Guide](https://support.google.com/accounts/answer/185833)
- [reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [Contact Email Setup Guide](./docs/CONTACT_EMAIL_SETUP.md)

---

## ✨ Summary

**What's Working:**
- ✅ Contact form UI (preserves existing design)
- ✅ Client-side validation (react-hook-form + Zod)
- ✅ Server-side validation and sanitization
- ✅ Nodemailer email sending
- ✅ Rate limiting (5 per 10 min)
- ✅ Honeypot spam protection
- ✅ Optional reCAPTCHA support
- ✅ Accessible success/error states
- ✅ Safe error handling

**What You Need to Do:**
1. ✏️ Edit `.env.local` with real email credentials
2. 🧪 Test form submission at http://localhost:3000/contact
3. 📬 Verify email arrives at CONTACT_RECEIVE_EMAIL
4. 🚀 Add same env vars to production hosting platform

**Need Help?**
- Check troubleshooting section above
- Review server console logs for detailed errors
- See `docs/CONTACT_EMAIL_SETUP.md` for more details

