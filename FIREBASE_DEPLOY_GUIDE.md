# 🚀 Deploying DebugMate to Firebase Hosting

You are one step away from sharing your app with the world!

## Prerequisites
- You have the Firebase API keys in `.env` (Done ✅)
- You have configured Security Rules (Done ✅)
- You have enabled Authentication (Done ✅)

## Step 1: Install Firebase Tools
Open your terminal and run:
```bash
npm install -g firebase-tools
```

## Step 2: Login to Firebase
```bash
firebase login
```
This will open a browser window. Log in with the same Google account you used for the Firebase Console.

## Step 3: Initialize Hosting
Run this command in your project root:
```bash
firebase init hosting
```

**Select the following options:**
1. **What do you want to use as your public directory?** `dist`
   *(Vite builds to the `dist` folder)*
2. **Configure as a single-page app (rewrite all urls to /index.html)?** `Yes`
   *(Important for React Router)*
3. **Set up automatic builds and deploys with GitHub?** `No`
   *(You can set this up later if you want)*
4. **File dist/index.html already exists. Overwrite?** `No`
   *(We want to keep our built file)*

## Step 4: Build the App
Create the production build:
```bash
npm run build
```

## Step 5: Deploy!
```bash
firebase deploy
```

## 🎉 Success!
Firebase will give you a URL (e.g., `https://debugmate-dee76.web.app`).
Click it to see your live app!

---

## 🔄 Updating Your App
Whenever you make changes:
1. `npm run build`
2. `firebase deploy`
