# Production Deployment Checklist
**Contact Form - VR NextGen Solutions**

Use this checklist before deploying the contact form to production.

---

## ✅ Pre-Deployment Verification

### 1. Environment Variables
- [ ] `MAIL_HOST` - SMTP server hostname
- [ ] `MAIL_PORT` - SMTP port (465 for SSL, 587 for TLS)
- [ ] `MAIL_SECURE` - `true` for SSL (port 465), `false` for TLS (port 587)
- [ ] `MAIL_USER` - SMTP username/email
- [ ] `MAIL_PASS` - SMTP password/App Password
- [ ] `CONTACT_RECEIVE_EMAIL` - Destination email for form submissions
- [ ] (Optional) `RECAPTCHA_SECRET` - Google reCAPTCHA secret key
- [ ] (Optional) `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - Google reCAPTCHA site key
- [ ] (Optional) `CONTACT_RATE_LIMIT_MAX` - Max submissions per window (default: 5)
- [ ] (Optional) `CONTACT_RATE_LIMIT_WINDOW_MS` - Time window in ms (default: 600000)

### 2. Email Configuration Testing
- [ ] Test email sending locally with production credentials
- [ ] Verify email arrives in inbox (not spam)
- [ ] Test email formatting (HTML + plain text)
- [ ] Verify reply-to address works correctly
- [ ] Test with different email providers (Gmail, Outlook, etc.)

### 3. Security Verification
- [ ] All environment variables set in hosting platform (not in code)
- [ ] `.env.local` in `.gitignore` (never committed)
- [ ] HTTPS enabled on production domain
- [ ] Security headers configured (`SECURE_HEADERS`)
- [ ] Rate limiting tested (5 per 10 min default)
- [ ] Honeypot field tested (spam protection)
- [ ] Input sanitization verified
- [ ] Server-side validation working

### 4. Functionality Testing
- [ ] Valid form submission works
- [ ] Client-side validation shows errors
- [ ] Server-side validation rejects invalid data
- [ ] Success message displays correctly
- [ ] Form resets after submission
- [ ] Error messages are user-friendly
- [ ] Loading states work (button disabled during submit)
- [ ] Accessible (screen reader compatible)

### 5. Monitoring & Observability
- [ ] Health check endpoint accessible: `/api/health/contact`
- [ ] Server logs configured (check for email errors)
- [ ] Error tracking set up (Sentry, LogRocket, etc.)
- [ ] Email delivery monitoring (check inbox regularly)
- [ ] Rate limit monitoring (watch for abuse)

---

## 🚀 Deployment Steps

### Vercel
1. [ ] Go to Project Settings → Environment Variables
2. [ ] Add all required variables (see Pre-Deployment section)
3. [ ] Set environment scope (Production, Preview, Development)
4. [ ] Deploy: `git push origin main`
5. [ ] Verify deployment in Vercel dashboard
6. [ ] Test contact form on production URL

### Netlify
1. [ ] Go to Site Settings → Environment Variables
2. [ ] Add all required variables
3. [ ] Deploy via Git push or manual deploy
4. [ ] Test contact form on production URL

### Other Platforms
- [ ] Add environment variables via platform dashboard
- [ ] Ensure Node.js version is compatible (18+)
- [ ] Verify build completes successfully
- [ ] Test contact form after deployment

---

## 🔧 Post-Deployment Verification

### Immediate Checks (Within 1 Hour)
- [ ] Visit production contact page: `https://yourdomain.com/contact`
- [ ] Submit test form with valid data
- [ ] Verify email arrives at `CONTACT_RECEIVE_EMAIL`
- [ ] Check email formatting (HTML renders correctly)
- [ ] Test reply-to functionality
- [ ] Verify success message displays
- [ ] Check browser console for errors
- [ ] Check server logs for any errors

### Health Check
```bash
# Test health endpoint
curl https://yourdomain.com/api/health/contact

# Expected response:
{
  "status": "healthy",
  "email": {
    "configured": true,
    "verified": true
  }
}
```

### Functional Tests
- [ ] Valid submission → email received
- [ ] Invalid email → client error shown
- [ ] Short message → validation error
- [ ] Rate limit → 429 error after 5 submissions
- [ ] Honeypot filled → silently blocked
- [ ] Network error → friendly error message

---

## 📊 Production Optimizations

### Recommended (Not Required)
- [ ] **Enable reCAPTCHA** - Reduces spam submissions
- [ ] **Use Redis for Rate Limiting** - For multi-instance deployments
- [ ] **Transactional Email Service** - SendGrid, AWS SES, Mailgun for better deliverability
- [ ] **Email Queue System** - For high-volume sites (Bull, BullMQ)
- [ ] **Database Logging** - Store submissions for audit trail
- [ ] **Analytics Integration** - Track form submissions
- [ ] **A/B Testing** - Optimize form conversion

### Performance
- [ ] Form loads quickly (< 1s)
- [ ] No unnecessary JavaScript
- [ ] Images optimized
- [ ] Lazy loading enabled
- [ ] CDN configured (if applicable)

---

## 🛡️ Security Hardening

### Required
- [x] HTTPS enabled
- [x] Input sanitization
- [x] Server-side validation
- [x] Rate limiting
- [x] Honeypot protection
- [x] Safe error handling

### Recommended
- [ ] reCAPTCHA enabled
- [ ] CSRF protection (if not using SameSite cookies)
- [ ] Content Security Policy (CSP) headers
- [ ] Rate limiting per IP + per email
- [ ] Email domain validation
- [ ] Block known spam patterns

---

## 📧 Email Provider Recommendations

### For Production (Better Deliverability)

**SendGrid** (Recommended)
```env
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_SECURE=true
MAIL_USER=apikey
MAIL_PASS=your-sendgrid-api-key
```

**AWS SES**
```env
MAIL_HOST=email-smtp.us-east-1.amazonaws.com
MAIL_PORT=587
MAIL_SECURE=true
MAIL_USER=your-ses-smtp-username
MAIL_PASS=your-ses-smtp-password
```

**Mailgun**
```env
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_SECURE=true
MAIL_USER=postmaster@your-domain.mailgun.org
MAIL_PASS=your-mailgun-smtp-password
```

**Resend** (Modern, Simple)
- Use Resend SDK instead of SMTP
- Better deliverability, simpler setup

---

## 🐛 Troubleshooting Production Issues

### Email Not Arriving
1. Check health endpoint: `/api/health/contact`
2. Verify SMTP credentials in hosting platform
3. Check spam folder
4. Review server logs for Nodemailer errors
5. Test SMTP connection directly
6. Verify firewall allows SMTP ports (465/587)

### Rate Limiting Too Aggressive
- Adjust `CONTACT_RATE_LIMIT_MAX` and `CONTACT_RATE_LIMIT_WINDOW_MS`
- Consider per-email rate limiting instead of per-IP

### Form Not Submitting
- Check browser console for errors
- Verify API route is accessible
- Check CORS settings (if applicable)
- Verify environment variables are set correctly

### High Spam Volume
- Enable reCAPTCHA
- Tighten rate limiting
- Add additional honeypot fields
- Consider email domain validation

---

## 📈 Monitoring Checklist

### Daily
- [ ] Check email inbox for submissions
- [ ] Review server logs for errors
- [ ] Monitor rate limit triggers

### Weekly
- [ ] Review form submission patterns
- [ ] Check for spam submissions
- [ ] Verify email deliverability
- [ ] Review error logs

### Monthly
- [ ] Analyze form conversion rates
- [ ] Review security logs
- [ ] Update dependencies
- [ ] Review and optimize rate limits

---

## 📚 Documentation

- [ ] README.md updated with contact form info
- [ ] API documentation updated
- [ ] Deployment guide reviewed
- [ ] Troubleshooting guide accessible
- [ ] Environment variables documented

---

## ✅ Sign-Off

**Deployed by:** _________________  
**Date:** _________________  
**Production URL:** _________________  
**Health Check Status:** _________________  
**Test Submission:** ✅ Pass / ❌ Fail  

**Notes:**
_________________________________________________
_________________________________________________
_________________________________________________

---

**Last Updated:** 2025-01-18  
**Version:** 1.0.0

