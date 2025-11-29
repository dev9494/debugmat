# 🔥 Firebase Google Sign-In Setup

## Error: auth/configuration-not-found

This error means Google Sign-In is not enabled in your Firebase project. Follow these steps:

## Step 1: Enable Google Authentication

1. Go to your [Firebase Console](https://console.firebase.google.com/project/debugmate-dee76/authentication/providers)
2. Click on **"Authentication"** in the left sidebar
3. Click on the **"Sign-in method"** tab
4. Find **"Google"** in the list of providers
5. Click on **"Google"**
6. Toggle the **"Enable"** switch to ON
7. Select a **Project support email** from the dropdown (use your email)
8. Click **"Save"**

## Step 2: Add Authorized Domain

1. Still in the **Authentication** section
2. Go to the **"Settings"** tab
3. Scroll to **"Authorized domains"**
4. Make sure `localhost` is in the list (it should be by default)
5. If deploying, add your production domain later

## Step 3: Verify Configuration

After enabling Google Sign-In, refresh your app and try signing in again!

## Alternative: Use Email/Password (If Google doesn't work)

If you prefer email/password authentication instead:

1. In Firebase Console > Authentication > Sign-in method
2. Enable **"Email/Password"**
3. I can update the code to use email/password instead of Google

---

**Once you've enabled Google Sign-In in the Firebase Console, the error will be fixed!** 🎉
