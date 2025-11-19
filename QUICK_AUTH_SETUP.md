# Quick Authentication Setup - Step by Step

## Step 1: Create Personal Access Token (Do this in your browser)

1. **In your open GitHub tab, go to:**
   - Click your profile picture (top right)
   - Click "Settings"
   - OR go directly to: https://github.com/settings/tokens

2. **Scroll down to "Developer settings"** (left sidebar, bottom)
   - Click "Developer settings"

3. **Click "Personal access tokens"**
   - Then click "Tokens (classic)"

4. **Click "Generate new token"**
   - Select "Generate new token (classic)"

5. **Fill in the form:**
   - **Note:** `VR-NEXTGEN-SOLUTIONS`
   - **Expiration:** Choose 90 days (or your preference)
   - **Select scopes:** Check ✅ **repo** (Full control of private repositories)
     - This will automatically check all repo sub-options

6. **Click "Generate token"** (scroll to bottom)

7. **IMPORTANT: Copy the token immediately!**
   - It starts with `ghp_`
   - You won't be able to see it again
   - Example: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Step 2: Update Git Remote (Run these commands)

After you copy the token, come back here and I'll help you update the remote URL.

**The command will be:**
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/VRNextGenSolutions/VR-NEXTGEN-SOLUTIONS.git
```

Replace `YOUR_TOKEN` with the token you copied.

---

## Step 3: Push Your Commit

After updating the remote, we'll push:
```bash
git push origin main
git push origin contact-form-v1.0
```

---

**Ready?** Once you have the token copied, let me know and I'll help you run the commands!

