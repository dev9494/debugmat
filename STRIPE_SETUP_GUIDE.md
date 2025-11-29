# Stripe Payment Setup Guide

## 1. Create a Stripe Account
1. Go to [stripe.com](https://stripe.com) and sign up.
2. Activate your account (you can skip this for testing).

## 2. Get API Keys
1. Go to **Developers** -> **API keys**.
2. Copy the **Publishable key** (starts with `pk_test_...`).
3. Copy the **Secret key** (starts with `sk_test_...`).

## 3. Configure Environment Variables
1. Open your `.env` file.
2. Add your publishable key:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

## 4. Create a Product
1. Go to **Products** -> **Add Product**.
2. Name: "DebugMate Pro".
3. Price: $19.00 / Month.
4. Copy the **Price ID** (starts with `price_...`).

## 5. Backend Integration (Required)
Since this is a client-side app (Vite), you need a secure backend to create Stripe Checkout Sessions. You cannot do this securely from the frontend alone.

### Option A: Firebase Functions (Recommended)
If you are using Firebase, set up a Cloud Function:

```javascript
const functions = require('firebase-functions');
const stripe = require('stripe')(functions.config().stripe.secret);

exports.createStripeCheckoutSession = functions.https.onCall(async (data, context) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: data.priceId,
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: 'https://your-app.com/success',
    cancel_url: 'https://your-app.com/cancel',
  });
  return { id: session.id };
});
```

### Option B: Vercel Functions
If deploying to Vercel, create `api/checkout.js`:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Create session...
  }
}
```

## 6. Webhooks
To automatically update the user's subscription status in your database when they pay, you need to set up Stripe Webhooks.
1. Go to **Developers** -> **Webhooks**.
2. Add an endpoint that points to your backend (e.g., `https://your-api.com/webhook`).
3. Listen for `checkout.session.completed` events.
