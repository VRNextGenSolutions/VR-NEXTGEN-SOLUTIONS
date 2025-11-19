# Contact Email Setup

Configure SMTP credentials and optional reCAPTCHA to enable the contact form.

## Required Environment Variables

Create `.env.local` (never commit this file) and add:

```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_SECURE=true
MAIL_USER=youremail@example.com
MAIL_PASS=your-app-password
CONTACT_RECEIVE_EMAIL=contact@vrnextgensolutions.com
```

### Gmail Notes

- Enable 2‑step verification on the Gmail account.
- Generate an **App Password** (Google Account → Security → App passwords) and use it as `MAIL_PASS`.
- Keep `MAIL_HOST=smtp.gmail.com`, `MAIL_PORT=465`, `MAIL_SECURE=true`.

## Optional reCAPTCHA

Add the following if you want an extra spam protection layer:

```
RECAPTCHA_SECRET=your-secret-key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
```

Use reCAPTCHA v3 (recommended) or v2 invisible keys. The client automatically loads the script when the site key is provided.

## Testing Locally

1. Ensure `.env.local` contains the variables above.
2. Run `npm run dev` and open `http://localhost:3000/contact`.
3. Submit the form with valid data — you should receive an email at `CONTACT_RECEIVE_EMAIL`.
4. Submit invalid input (short message, bad email) to see validation errors.
5. Trigger spam protections:
   - Fill the hidden “Company” field (honeypot) via devtools — the server will skip sending the email.
   - Submit more than 5 requests within 10 minutes to receive a 429 response.
6. Break SMTP credentials to confirm the UI shows a friendly error and logs contain the failure reason.

## Deployment

- Set the same variables in your hosting provider’s environment settings (e.g., Vercel Project → Settings → Environment Variables).
- For production scale, replace the in-memory rate limiter with a shared store (Redis) to coordinate across instances.
- Consider using a dedicated transactional email provider (SendGrid, Mailgun, Resend) if SMTP delivery becomes unreliable. The `sendContactEmail` utility can be adapted to those services.

