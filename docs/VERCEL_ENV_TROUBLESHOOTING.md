# Vercel Environment Variables Troubleshooting

## Issue Found

The health check shows that `MAIL_USER` is still missing, even though you added the variables. This suggests one of the following:

1. **Variable name/value confusion** - In Vercel, you need to enter:
   - **Key:** `MAIL_USER` (just the variable name)
   - **Value:** `your-email@gmail.com` (the actual email address)

2. **Environment scope** - Make sure variables are set for **Production** environment

3. **Deployment not picked up** - Variables may need a fresh redeploy

---

## How to Fix in Vercel

### Step 1: Verify Variable Format

In Vercel Dashboard → Settings → Environment Variables, each variable should be:

**Correct Format:**
- **Key:** `MAIL_HOST` (variable name only, no equals sign)
- **Value:** `smtp.gmail.com` (the actual value)

**Incorrect Format:**
- ❌ Key: `MAIL_HOST=smtp.gmail.com` (don't include the value in the key)
- ❌ Key: `MAIL_HOST` Value: `MAIL_HOST=smtp.gmail.com` (don't include the key in the value)

### Step 2: Check All Variables

Verify you have these exact variable names (keys):

1. `MAIL_HOST` → Value: `smtp.gmail.com`
2. `MAIL_USER` → Value: `your-actual-email@gmail.com` (replace with your real email)
3. `MAIL_PASS` → Value: `your-app-password` (replace with your actual app password)
4. `CONTACT_RECEIVE_EMAIL` → Value: `info@vrnextgensolutions.com`
5. `MAIL_PORT` → Value: `465`
6. `MAIL_SECURE` → Value: `true`

### Step 3: Verify Environment Scope

For each variable:
- ✅ Check that **Production** is selected
- ✅ Optionally select **Preview** and **Development** if you want them there too

### Step 4: Redeploy

After adding/updating variables:
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

---

## Current Status

Health check shows:
- ❌ `MAIL_USER` is missing

This means other variables may be present, but `MAIL_USER` specifically needs to be added.

---

## Quick Fix

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Click **Add New**
3. **Key:** `MAIL_USER`
4. **Value:** Your actual Gmail address (e.g., `youremail@gmail.com`)
5. Select **Production** environment
6. Click **Save**
7. Redeploy the application

---

## Verification

After fixing, check:
```bash
curl https://vrnextgensolutions.com/api/health/contact
```

Should return:
```json
{
  "status": "healthy",
  "email": {
    "configured": true,
    "verified": true
  }
}
```


