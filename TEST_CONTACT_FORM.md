# Contact Form Testing Guide

## Prerequisites

Before testing, ensure:
- ✅ `.env.local` exists and contains valid SMTP credentials
- ✅ `npm install` has been run (nodemailer installed)
- ✅ Dev server is running: `npm run dev`

## Quick Test Command

Open your browser and navigate to:
```
http://localhost:3000/contact
```

---

## Test Cases

### ✅ Test 1: Valid Submission

**Steps:**
1. Navigate to http://localhost:3000/contact
2. Fill in:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Message: `This is a test message from the contact form.`
3. Click "Send Message"

**Expected Result:**
- ✅ Button shows "Sending..." (disabled)
- ✅ Green success message appears: "Thank you! Your message has been sent successfully..."
- ✅ Form fields are cleared
- ✅ Email arrives at CONTACT_RECEIVE_EMAIL address

**Email Format:**
```
From: VR NextGen Solutions <your-mail-user>
Reply-To: john@example.com
Subject: New Contact: John Doe

Body:
Name: John Doe
Email: john@example.com

This is a test message from the contact form.
```

---

### ❌ Test 2: Validation Errors

#### 2a. Short Name
- Name: `J` (too short)
- Expected: "Name must be at least 2 characters"

#### 2b. Invalid Email
- Email: `invalid-email`
- Expected: "Valid email required"

#### 2c. Short Message
- Message: `Hi` (< 10 chars)
- Expected: "Message must be at least 10 characters"

#### 2d. Long Message
- Message: 5001+ characters
- Expected: "Message is too long"

#### 2e. Empty Fields
- Leave any field empty
- Expected: Form validation errors for required fields

---

### 🛡️ Test 3: Honeypot Protection

**Steps:**
1. Open browser DevTools (F12)
2. In Console, run:
   ```javascript
   document.querySelector('input[name="company"]').value = "spam bot";
   ```
3. Fill in other fields normally
4. Submit form

**Expected Result:**
- ✅ Form appears to submit successfully
- ✅ NO email is actually sent
- ✅ Server returns 204 No Content (silent block)

---

### ⏱️ Test 4: Rate Limiting

**Steps:**
1. Submit the form 5 times quickly (valid data each time)
2. On the 6th submission, observe the response

**Expected Result:**
- ✅ First 5 submissions succeed (emails sent)
- ✅ 6th submission fails with error:
  ```
  "Too many messages. Please wait a few minutes and try again."
  ```
- ✅ After 10 minutes, submissions work again

**Note:** Default rate limit is 5 submissions per 10 minutes per IP

---

### 🔒 Test 5: reCAPTCHA (Optional)

**Only if RECAPTCHA_SECRET is configured**

**Steps:**
1. Ensure these env vars are set in `.env.local`:
   ```
   RECAPTCHA_SECRET=your-secret-key
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
   ```
2. Restart dev server
3. Submit form normally

**Expected Result:**
- ✅ reCAPTCHA badge appears in bottom-right corner
- ✅ Token is automatically generated and sent with form
- ✅ Submission succeeds if score > 0.5

**Test reCAPTCHA Failure:**
- Remove NEXT_PUBLIC_RECAPTCHA_SITE_KEY from client
- Keep RECAPTCHA_SECRET on server
- Submit form
- Expected: "reCAPTCHA validation failed. Please try again."

---

### 🚨 Test 6: SMTP Configuration Errors

**Steps:**
1. Edit `.env.local` and break MAIL_PASS (wrong password)
2. Restart dev server
3. Submit form

**Expected Result:**
- ✅ Form shows generic error: "Unable to send your message right now..."
- ✅ Server console logs detailed error:
  ```
  Contact form submission failed
  { ip: '::1', error: 'Invalid login: ...' }
  ```

**Fix:**
1. Restore correct MAIL_PASS
2. Restart server
3. Test again

---

## Testing Checklist

Use this checklist to verify all functionality:

- [ ] **Valid submission** → email received
- [ ] **Short name** → client validation error
- [ ] **Invalid email** → client validation error
- [ ] **Short message** → client validation error
- [ ] **Long message (5000+ chars)** → client validation error
- [ ] **Empty fields** → required field errors
- [ ] **Honeypot filled** → silently blocked (no email)
- [ ] **6 rapid submissions** → rate limit error on 6th
- [ ] **Wrong SMTP credentials** → generic error + server logs
- [ ] **Success clears form** → all fields empty after submit
- [ ] **Loading state** → button disabled during submit
- [ ] **Accessible** → screen reader announces status changes

---

## Debugging Tips

### Check Server Logs

The dev server console will show:
```bash
# Success
Contact form submitted { ip: '::1' }

# Honeypot triggered
Honeypot triggered { ip: '::1' }

# Email send failure
Contact form submission failed { ip: '::1', error: 'Authentication failed' }

# Transporter verification failure
Nodemailer transporter verification failed { error: '...' }
```

### Test Email Sending Directly

Create a test file `test-email.js`:
```javascript
const nodemailer = require('nodemailer');

async function test() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-app-password',
    },
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    
    const info = await transporter.sendMail({
      from: '"Test" <your-email@gmail.com>',
      to: 'destination@example.com',
      subject: 'Test Email',
      text: 'This is a test email from Nodemailer',
    });
    
    console.log('✅ Email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
```

Run: `node test-email.js`

---

## Common Issues & Solutions

### Issue: "Email transport is not configured properly"

**Check:**
```bash
# Verify environment variables are loaded
grep MAIL .env.local
```

**Solution:**
- Ensure all MAIL_* variables are set
- Restart dev server after changing `.env.local`

---

### Issue: Gmail authentication failed

**Solutions:**
1. Enable 2FA on Google account
2. Generate App Password at: https://myaccount.google.com/apppasswords
3. Use App Password (16 chars, no spaces) as MAIL_PASS
4. Verify MAIL_USER matches the account that generated App Password

---

### Issue: Port 465 blocked

**Try alternative SMTP settings:**
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false  # Use STARTTLS instead
```

---

### Issue: Rate limit not resetting

**Current implementation uses in-memory storage:**
- Restarting the dev server clears rate limit counters
- In production with multiple servers, use Redis for shared state

---

### Issue: Form submits but no email arrives

**Check:**
1. Server logs for errors
2. Spam folder in receiving email
3. CONTACT_RECEIVE_EMAIL is correct
4. SMTP credentials are valid
5. Try sending test email directly (see debugging section)

---

## Next Steps After Testing

Once all tests pass:

1. ✅ Commit changes (excluding `.env.local`)
2. ✅ Add environment variables to production hosting platform
3. ✅ Enable reCAPTCHA for production
4. ✅ Consider using transactional email service (SendGrid/AWS SES)
5. ✅ Monitor email delivery and form submissions
6. ✅ Set up error tracking (Sentry, LogRocket, etc)

---

## Production Considerations

Before deploying to production:

- [ ] **SSL/TLS enabled** on domain (HTTPS)
- [ ] **reCAPTCHA configured** and tested
- [ ] **Rate limiting adjusted** based on expected traffic
- [ ] **Transactional email service** (SendGrid, AWS SES) for better deliverability
- [ ] **Error monitoring** (Sentry, etc) configured
- [ ] **Email notifications** for failed submissions
- [ ] **Database logging** (optional) for audit trail
- [ ] **Redis rate limiter** for multi-server deployments

---

## Support

If you encounter issues:
1. Check `SETUP_INSTRUCTIONS.md` for detailed setup
2. Review `docs/CONTACT_EMAIL_SETUP.md` for email configuration
3. Check server console logs for detailed error messages
4. Test SMTP connection directly (see debugging section)

---

**Happy Testing! 🚀**

