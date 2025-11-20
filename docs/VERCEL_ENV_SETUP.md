# Vercel Environment Variables Setup Guide

**Quick Fix for Contact Form 503 Error**

---

## Problem

Contact form returns **503 Service Unavailable** because email environment variables are missing in Vercel.

---

## Solution: Add Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Click on your project: **VR-NEXTGEN-SOLUTIONS**
3. Click **Settings** tab
4. Click **Environment Variables** in left sidebar

### Step 2: Add Required Variables

Click **Add New** and add each variable:

#### 1. MAIL_HOST
- **Key:** `MAIL_HOST`
- **Value:** Your SMTP host (e.g., `smtp.gmail.com`)
- **Environment:** Production (and Preview if needed)

#### 2. MAIL_USER
- **Key:** `MAIL_USER`
- **Value:** Your SMTP email (e.g., `your-email@gmail.com`)
- **Environment:** Production (and Preview if needed)

#### 3. MAIL_PASS
- **Key:** `MAIL_PASS`
- **Value:** Your SMTP password or app password
- **Environment:** Production (and Preview if needed)
- ⚠️ **For Gmail:** Use App Password, not regular password

#### 4. CONTACT_RECEIVE_EMAIL
- **Key:** `CONTACT_RECEIVE_EMAIL`
- **Value:** `info@vrnextgensolutions.com` (or your preferred email)
- **Environment:** Production (and Preview if needed)

#### 5. MAIL_PORT (Optional)
- **Key:** `MAIL_PORT`
- **Value:** `465` (or `587` for TLS)
- **Environment:** Production

#### 6. MAIL_SECURE (Optional)
- **Key:** `MAIL_SECURE`
- **Value:** `true`
- **Environment:** Production

### Step 3: Redeploy

**Important:** Environment variables only take effect after redeployment.

1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

---

## Gmail Setup (If Using Gmail)

### 1. Enable 2-Factor Authentication
- Go to: https://myaccount.google.com/security
- Enable 2-Step Verification

### 2. Generate App Password
- Go to: https://myaccount.google.com/apppasswords
- Select "Mail" and "Other (Custom name)"
- Enter: "VR NextGen Contact Form"
- Copy the 16-character password

### 3. Use in Vercel
- `MAIL_HOST`: `smtp.gmail.com`
- `MAIL_USER`: Your Gmail address
- `MAIL_PASS`: The 16-character app password
- `MAIL_PORT`: `465`
- `MAIL_SECURE`: `true`

---

## Alternative: SendGrid Setup

### 1. Create SendGrid Account
- Sign up at: https://sendgrid.com
- Verify your account

### 2. Create API Key
- Go to Settings → API Keys
- Create new API key with "Mail Send" permissions
- Copy the API key

### 3. Use in Vercel
- `MAIL_HOST`: `smtp.sendgrid.net`
- `MAIL_USER`: `apikey`
- `MAIL_PASS`: Your SendGrid API key
- `MAIL_PORT`: `587`
- `MAIL_SECURE`: `true`

---

## Verification

After redeploying:

1. **Test API:**
   ```bash
   curl -X POST https://vrnextgensolutions.com/api/contact \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","message":"Test"}'
   ```
   Should return: `{"success":true}`

2. **Test Form:**
   - Visit: https://vrnextgensolutions.com/contact
   - Submit form
   - Should see success message

3. **Check Email:**
   - Check inbox for `CONTACT_RECEIVE_EMAIL`
   - Should receive test email

---

## Troubleshooting

### Still Getting 503?

1. **Check variables are set:**
   - Go to Vercel → Settings → Environment Variables
   - Verify all required variables are present

2. **Check deployment:**
   - Make sure you redeployed after adding variables
   - Variables only work in new deployments

3. **Check variable names:**
   - Must be exact: `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS`
   - Case-sensitive

4. **Check email format:**
   - `MAIL_USER` must be valid email
   - `CONTACT_RECEIVE_EMAIL` must be valid email

### Getting 500 Error?

- Check Vercel function logs
- Look for SMTP connection errors
- Verify SMTP credentials are correct

---

## Security Best Practices

✅ **DO:**
- Use App Passwords for Gmail
- Use API keys for email services
- Set variables only in Vercel (never commit to Git)
- Use different credentials for production/staging

❌ **DON'T:**
- Commit `.env` files to Git
- Use your main email password
- Share credentials publicly
- Use same credentials for all environments

---

**Need Help?** See `docs/PRODUCTION_EMAIL_ERROR_ANALYSIS.md` for detailed analysis.


