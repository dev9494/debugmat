# 🔥 Firebase Setup Guide

You're almost there! To enable the Firebase features (Login, Sync, etc.), you need to add your Firebase configuration keys to the `.env` file.

## Step 1: Get Your Firebase Config

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project **debugmate-dee76**.
3. Click the **Gear icon** (Project Settings) > **General**.
4. Scroll down to **Your apps**.
5. If you haven't created a web app yet, click the **</> (Web)** icon.
   - Register app (name it "DebugMate").
   - **Check "Also set up Firebase Hosting"** (optional but recommended).
6. You will see a code snippet with `firebaseConfig`.

## Step 2: Add to .env

Create or edit the `.env` file in the root of your project and add the following keys from your config:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=debugmate-dee76.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=debugmate-dee76
VITE_FIREBASE_STORAGE_BUCKET=debugmate-dee76.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

> **Note:** Replace `your_..._here` with the actual values from the Firebase console.

## Step 3: Enable Authentication

1. In Firebase Console, go to **Build** > **Authentication**.
2. Click **Get Started**.
3. Select **Sign-in method** tab.
4. Enable **Google**:
   - Click **Google**.
   - Toggle **Enable**.
   - Select a support email.
   - Click **Save**.
5. **Add Authorized Domains** (Critical for Deployment):
   - Go to **Authentication** > **Settings** > **Authorized domains**.
   - Click **Add domain**.
   - Enter your Vercel domain (e.g., `debugmate-pi.vercel.app`).
   - Click **Add**.
   - *If you don't do this, Google Sign-In will fail on your deployed site!*

## Step 4: Create Firestore Database

1. Go to **Build** > **Firestore Database**.
2. Click **Create Database**.
3. Select a location (e.g., `nam5 (us-central)`).
4. Start in **Test mode** (for now) or **Production mode**.
   - If Production, make sure to set up security rules (see below).

## Step 5: Security Rules (Recommended)

Go to **Firestore Database** > **Rules** and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own errors
    match /errors/{errorId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## Step 6: Restart Development Server

After updating `.env`, restart your server:

```bash
npm run dev
```

## 🎉 You're Done!

Now you can:
- Click **Sign In** in the top right.
- Login with Google.
- Your error history will automatically sync to the cloud!
