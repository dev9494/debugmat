# 🚀 Deploy DebugMate to Vercel - Updated Guide

## Current Vercel Interface (2024)

Vercel now primarily uses Git integration. Here's how to deploy:

---

## ✅ Step-by-Step Deployment

### Step 1: Import Your GitHub Repository

You're already on the right page! Here's what to do:

1. **Look for "Import Git Repository" section** (left side of the page)

2. **Click "Install"** button under GitHub
   - This connects Vercel to your GitHub account
   - You'll be redirected to GitHub to authorize Vercel

3. **Authorize Vercel:**
   - GitHub will ask for permissions
   - Click "Install & Authorize"
   - Select "All repositories" or just "debugmate"

4. **Return to Vercel:**
   - You'll be redirected back to Vercel
   - Your repository should now appear

5. **Select your repository:**
   - Look for "dev9494/debugmate"
   - Click "Import"

---

### Step 2: Configure Project

After clicking Import:

1. **Project Name:** `debugmate` (or leave default)

2. **Framework Preset:** Vercel should auto-detect "Vite"

3. **Root Directory:** `./` (leave as is)

4. **Build Command:** `npm run build` (should be auto-filled)

5. **Output Directory:** `dist` (should be auto-filled)

6. **Install Command:** `npm install` (should be auto-filled)

7. **Click "Deploy"** (big button at the bottom)

---

### Step 3: Add Environment Variables (IMPORTANT!)

**BEFORE clicking Deploy**, scroll down to find:

**Environment Variables** section:

1. Click "Add" or expand the section

2. Add your API key:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: `AIzaSyDlcBOiVYBMjKOiZjNlBqPBrAGGPQdWDlU`
   - **Environment**: Select all (Production, Preview, Development)

3. Click "Add"

4. **NOW click "Deploy"**

---

### Step 4: Wait for Deployment

- Vercel will build your app (~1-2 minutes)
- You'll see a progress screen
- When done, you'll see: "Congratulations! 🎉"

---

### Step 5: Visit Your Live App!

Vercel will give you a URL like:
```
https://debugmate-abc123.vercel.app
```

Click it and test your app!

---

## 🐛 Troubleshooting

### If you don't see your repository:

1. Make sure you clicked "Install" under GitHub
2. Authorize Vercel on GitHub
3. Refresh the Vercel page

### If build fails:

1. Check that environment variable was added
2. Look at build logs for errors
3. Make sure `dist` folder is set as output directory

### If features don't work:

1. Make sure `VITE_GEMINI_API_KEY` was added
2. Check browser console (F12) for errors
3. Redeploy from Vercel dashboard

---

## 🎯 Quick Checklist

Before deploying:
- [ ] GitHub repository exists: https://github.com/dev9494/debugmate
- [ ] Vercel is connected to GitHub
- [ ] Environment variable `VITE_GEMINI_API_KEY` is added
- [ ] Build settings are correct (Vite, dist folder)

---

## 🚀 Alternative: Use Vercel CLI

If the web interface doesn't work, you can use the CLI:

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variable
vercel env add VITE_GEMINI_API_KEY

# Deploy to production
vercel --prod
```

---

**You're almost there!** Just follow Step 1 to connect GitHub, then deploy! 🎉
