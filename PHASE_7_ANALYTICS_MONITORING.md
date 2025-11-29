# Phase 7: Analytics & Monitoring - Complete Guide

## ✅ Implemented Features

### 1. **Google Analytics 4 Integration**

#### Setup Instructions:
1. **Create GA4 Property**:
   - Go to [Google Analytics](https://analytics.google.com/)
   - Click "Admin" → "Create Property"
   - Name: "DebugMate"
   - Select timezone and currency
   - Click "Create"

2. **Get Tracking ID**:
   - In your new property, go to "Data Streams"
   - Click "Add stream" → "Web"
   - Enter your website URL: `https://debugmate-pi.vercel.app`
   - Copy the **Measurement ID** (starts with `G-`)

3. **Add to Environment Variables**:
   ```bash
   # In your .env file
   VITE_GA_TRACKING_ID=G-XXXXXXXXXX
   ```

4. **Add to Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `VITE_GA_TRACKING_ID` = `G-XXXXXXXXXX`
   - Redeploy

#### What's Being Tracked:
- ✅ Page views (automatic)
- ✅ Error analyses (type + severity)
- ✅ User signups (method)
- ✅ Subscription upgrades (tier)
- ✅ Feature usage (feature name)

### 2. **Built-in Analytics Dashboard**

Your app already has a comprehensive analytics system in `src/lib/analytics.ts`:

**Metrics Tracked:**
- Total errors analyzed
- Errors by day (last 30 days)
- Errors by severity (critical, high, medium, low)
- Errors by type (top 10)
- Errors by programming language
- MTTR (Mean Time To Resolution)
- Error rate (errors per day)
- Top error-producing files
- Resolution rate (% of resolved errors)
- Trends (7-day and 30-day comparisons)

**View Analytics:**
- Navigate to the "Analytics" tab in your dashboard
- Real-time charts and insights
- All data stored in Firestore

### 3. **Error Monitoring (Optional - Sentry)**

For production error monitoring, consider adding Sentry:

#### Setup Sentry:
```bash
npm install @sentry/react @sentry/vite-plugin
```

#### Configure (in `src/main.tsx`):
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### 4. **Uptime Monitoring (Recommended)**

#### Option A: UptimeRobot (Free)
1. Go to [UptimeRobot.com](https://uptimerobot.com/)
2. Sign up for free account
3. Add New Monitor:
   - Monitor Type: HTTP(s)
   - Friendly Name: DebugMate Production
   - URL: `https://debugmate-pi.vercel.app`
   - Monitoring Interval: 5 minutes
4. Set up alerts (email/SMS when site is down)

#### Option B: Vercel Analytics (Built-in)
- Already included with your Vercel deployment
- View in Vercel Dashboard → Analytics
- Shows:
  - Page views
  - Unique visitors
  - Top pages
  - Top referrers
  - Performance metrics

### 5. **Performance Monitoring**

#### Web Vitals Tracking:
Your app can track Core Web Vitals automatically:

```typescript
// Add to src/main.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to Google Analytics
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      non_interaction: true,
    });
  }
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 📊 Analytics Events Reference

### Tracked Events:

1. **error_analyzed**
   - Category: Analysis
   - Label: `{errorType} - {severity}`
   - When: User successfully analyzes an error

2. **sign_up**
   - Category: User
   - Label: `google` (or other method)
   - When: User completes signup

3. **upgrade**
   - Category: Subscription
   - Label: `pro` or `team`
   - When: User upgrades subscription

4. **feature_used**
   - Category: Features
   - Label: Feature name
   - When: User uses a specific feature

## 🎯 Key Metrics to Monitor

### Daily:
- Active users
- Error analyses performed
- Signup conversions
- Error rate

### Weekly:
- User retention
- Feature adoption
- Subscription upgrades
- Average session duration

### Monthly:
- Monthly Recurring Revenue (MRR)
- Churn rate
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)

## 🔔 Recommended Alerts

Set up alerts for:
- ❌ Site downtime (> 1 minute)
- ⚠️ Error rate spike (> 50% increase)
- 📉 Conversion drop (> 30% decrease)
- 🐌 Slow page load (> 3 seconds)

## 📈 Viewing Your Analytics

### Google Analytics:
1. Go to [analytics.google.com](https://analytics.google.com/)
2. Select "DebugMate" property
3. View real-time data, reports, and insights

### In-App Analytics:
1. Sign in to your app
2. Click "Analytics" tab
3. View comprehensive error analytics

### Vercel Analytics:
1. Go to Vercel Dashboard
2. Select your project
3. Click "Analytics" tab

## ✅ Checklist

- [ ] Created Google Analytics 4 property
- [ ] Added GA tracking ID to Vercel environment variables
- [ ] Verified GA tracking in real-time reports
- [ ] Set up UptimeRobot monitoring
- [ ] Configured email alerts for downtime
- [ ] Reviewed in-app analytics dashboard
- [ ] (Optional) Set up Sentry for error tracking
- [ ] (Optional) Enabled Vercel Analytics

## 🚀 Next Steps

Your analytics infrastructure is now complete! You can:
1. Monitor user behavior and engagement
2. Track conversion funnels
3. Identify popular features
4. Detect and fix issues quickly
5. Make data-driven product decisions

**Ready for Phase 8: Marketing & Growth!**
