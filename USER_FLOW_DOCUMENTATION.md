# Customer Journey Mapper — Complete User Flow Documentation

**Version:** 1.0.0  
**Last Updated:** 2026-08-13  
**API Base URL:** `https://customer-journey-backend-zo4y.onrender.com`

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Initial Setup](#initial-setup)
4. [User Roles & Authentication](#user-roles--authentication)
5. [Customer Journey Lifecycle](#customer-journey-lifecycle)
6. [Event Tracking](#event-tracking)
7. [Admin Dashboard Features](#admin-dashboard-features)
8. [API Reference](#api-reference)
9. [Integration Examples](#integration-examples)
10. [Common Use Cases](#common-use-cases)
11. [Testing & Debugging](#testing--debugging)
12. [Best Practices](#best-practices)
13. [Known Issues](#known-issues)

---

## System Overview

Customer Journey Mapper is a full-stack analytics platform that tracks customer interactions across multiple touchpoints and visualizes their progression through lifecycle stages.

### Key Features

- **Automatic Journey Creation** — Journeys are created automatically when events are ingested
- **Lifecycle Stage Tracking** — 5 default stages: Awareness → Consideration → Decision → Purchase → Retention
- **Multi-Channel Attribution** — Track customers across 6+ channels (Direct, Organic Search, Email, Paid, Social, Display)
- **Noise Filtering** — Intelligent filtering of duplicate/low-value touchpoints
- **Conversion Tracking** — Automatic detection of conversion events (PURCHASE, SIGNUP, etc.)
- **Identity Resolution** — Anonymous → Authenticated customer tracking
- **Real-time Analytics** — Funnel analysis, conversion rates, channel breakdown

### Components

1. **Event Ingestion API** — Captures raw customer events from any source
2. **Journey Engine** — Processes events and maintains journey state
3. **Admin Dashboard** — Web UI for viewing journeys, analytics, and system management
4. **E-commerce Demo** — Reference implementation showing tracking in action

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Your Application (Website, App, etc.)                      │
│  - Tracks customer events (PAGE_VIEW, CLICK, PURCHASE, etc.)│
└──────────────────────┬──────────────────────────────────────┘
                       │ POST /api/raw-events
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Journey Engine (Backend API)                               │
│  1. Receives raw event                                      │
│  2. Resolves/creates customer (by email or anonymousId)     │
│  3. Determines journey stage (based on event type)          │
│  4. Resolves channel (from source/medium)                   │
│  5. Resolves/creates campaign (from campaignName)           │
│  6. Finds/creates journey                                   │
│  7. Creates touchpoint                                      │
│  8. Detects conversion (if PURCHASE/SIGNUP)                 │
│  9. Returns EventProcessingResult                           │
└──────────────────────┬──────────────────────────────────────┘
                       │ Stores in PostgreSQL
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Admin Dashboard                                            │
│  - View all journeys                                        │
│  - Journey detail with touchpoint timeline                  │
│  - Funnel analysis                                          │
│  - Cross-journey analytics                                  │
└─────────────────────────────────────────────────────────────┘
```

### Data Model

```
Customer
  └─ Journey (1:many)
      ├─ Touchpoints (1:many)
      │   └─ RawEvent (1:1)
      └─ Conversions (1:many)
```

---

## Initial Setup

### Prerequisites

- Backend deployed at `https://customer-journey-backend-zo4y.onrender.com`
- Admin credentials for dashboard access

### Step 1: Register Admin User

```bash
curl -c cookies.txt -X POST https://customer-journey-backend-zo4y.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Admin",
    "email": "admin@yourcompany.com",
    "password": "your-secure-password",
    "role": "ADMIN"
  }'
```

### Step 2: Login

```bash
curl -b cookies.txt -c cookies.txt -X POST https://customer-journey-backend-zo4y.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourcompany.com",
    "password": "your-secure-password"
  }'
```

### Step 3: Initialize System

**⚠️ IMPORTANT:** Before this works, ensure backend has campaigns configured (see Known Issues below).

```bash
curl -b cookies.txt -X POST https://customer-journey-backend-zo4y.onrender.com/api/admin/init
```

**Expected Response:**
```json
{
  "stagesCreated": 5,
  "channelsCreated": 6,
  "campaignsCreated": 1,
  "alreadyInitialized": false,
  "message": "System initialized successfully"
}
```

### Step 4: Verify Setup

```bash
curl -b cookies.txt https://customer-journey-backend-zo4y.onrender.com/api/admin/setup-status
```

**Expected Response:**
```json
{
  "isReady": true,
  "hasStages": true,
  "stageCount": 5,
  "hasChannels": true,
  "channelCount": 6,
  "hasCampaigns": true,
  "campaignCount": 1,
  "issues": []
}
```

---

## User Roles & Authentication

### Roles

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full access - manage users, campaigns, view all journeys |
| **ANALYST** | View journeys, export data, read-only analytics |
| **VIEWER** | View-only access to dashboards |
| **SYSTEM** | Internal role for automated operations |

### Authentication Flow

#### Admin/Analyst/Viewer Login (Dashboard)

```javascript
// POST /api/v1/auth/login
const response = await fetch('https://your-backend.com/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
// Returns: { username, email, role }
// HttpOnly JWT cookie is set automatically
```

#### Customer Authentication (E-commerce/Public Sites)

**⚠️ KNOWN ISSUE:** This endpoint currently returns 403. See Known Issues section.

```javascript
// POST /api/auth/login (passwordless)
const response = await fetch('https://your-backend.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jane Doe',
    email: 'jane@example.com'
  })
});

const data = await response.json();
// Returns: { customerId, name, email, newCustomer: true/false }
```

---

## Customer Journey Lifecycle

### Journey Stages

1. **Awareness** — First interaction (PAGE_VIEW, AD_IMPRESSION)
2. **Consideration** — Active browsing (multiple PAGE_VIEWs, product views)
3. **Decision** — Intent signals (CLICK add-to-cart, FORM_SUBMIT)
4. **Purchase** — Conversion (PURCHASE, SIGNUP)
5. **Retention** — Post-purchase (EMAIL_OPEN, SUPPORT_CHAT)

### Journey States

- **ACTIVE** — Ongoing journey, customer still engaging
- **COMPLETED** — Converted (reached Purchase stage)
- **ABANDONED** — No activity for X days (configurable)

### Automatic Journey Creation

Journeys are created automatically when:
1. A raw event is received
2. Customer doesn't have an active journey
3. System creates new journey in "Awareness" stage

### Stage Progression

Stage advances based on:
- **Event Type** — PURCHASE event → moves to Purchase stage
- **Touchpoint Count** — Multiple PAGE_VIEWs → moves to Consideration
- **Intent Signals** — FORM_SUBMIT, CLICK on high-value items → moves to Decision

---

## Event Tracking

### Event Structure

```typescript
interface RawEventCreateRequest {
  // Customer Identification (at least one required)
  customerId?: number;          // If known (authenticated)
  anonymousId?: string;         // If anonymous (session-based)
  email?: string;               // Enables customer resolution
  
  // Event Details (required)
  eventType: string;            // Required: PAGE_VIEW, CLICK, PURCHASE, etc.
  occurredAt: string;           // ISO 8601 timestamp
  
  // Attribution (recommended)
  source: string;               // e.g., "google", "direct", "facebook"
  medium: string;               // e.g., "organic", "cpc", "email"
  campaignName?: string;        // Auto-creates campaign if missing
  
  // Context (optional but useful)
  sessionId?: string;           // Groups events by session
  pageUrl?: string;             // URL where event occurred
  device?: string;              // "desktop", "mobile", "tablet"
  browser?: string;             // "Chrome", "Safari", etc.
  
  // Technical (optional)
  sourceSystem?: string;        // e.g., "web-storefront", "mobile-app"
  eventKey?: string;            // Unique key for deduplication
  durationSeconds?: number;     // Time spent on page/action
  rawPayload?: object;          // Any additional data
}
```

### Event Types

| Event Type | Description | Stage |
|------------|-------------|-------|
| `PAGE_VIEW` | Page load | Awareness → Consideration |
| `CLICK` | Button/link click | Consideration → Decision |
| `FORM_SUBMIT` | Form submission | Decision |
| `PURCHASE` | Completed purchase | Purchase (conversion) |
| `SIGNUP` | Account creation | Purchase (conversion) |
| `EMAIL_OPEN` | Email opened | Retention |
| `AD_IMPRESSION` | Ad viewed | Awareness |
| `SUPPORT_CHAT` | Support interaction | Retention |
| `BOUNCE` | Quick exit (< 5s) | Awareness (noise) |
| `UNKNOWN` | Unclassified event | Current stage |

### Tracking Examples

#### Basic Page View

```javascript
await fetch('https://your-backend.com/api/raw-events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    anonymousId: getAnonymousId(), // Generate once per browser
    eventType: 'PAGE_VIEW',
    occurredAt: new Date().toISOString(),
    source: 'direct',
    medium: 'none',
    pageUrl: window.location.href,
    device: getDeviceType(),
    browser: getBrowserName(),
    sourceSystem: 'web-storefront'
  })
});
```

#### Purchase Event (with customer)

```javascript
await fetch('https://your-backend.com/api/raw-events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerId: 123,
    email: 'customer@example.com',
    sessionId: getSessionId(),
    eventType: 'PURCHASE',
    occurredAt: new Date().toISOString(),
    source: 'google',
    medium: 'cpc',
    campaignName: 'Summer Sale 2026',
    pageUrl: '/checkout/confirmation',
    device: 'mobile',
    browser: 'Chrome',
    sourceSystem: 'web-storefront',
    rawPayload: {
      orderId: 'ORD-12345',
      total: 99.99,
      currency: 'USD',
      items: ['PROD-1', 'PROD-2']
    }
  })
});
```

#### UTM Parameter Tracking

```javascript
// Parse URL parameters
const params = new URLSearchParams(window.location.search);

await fetch('https://your-backend.com/api/raw-events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    anonymousId: getAnonymousId(),
    eventType: 'PAGE_VIEW',
    occurredAt: new Date().toISOString(),
    source: params.get('utm_source') || 'direct',
    medium: params.get('utm_medium') || 'none',
    campaignName: params.get('utm_campaign') || 'Default Campaign',
    pageUrl: window.location.href,
    device: getDeviceType(),
    browser: getBrowserName(),
    sourceSystem: 'web-storefront'
  })
});
```

---

## Admin Dashboard Features

### Dashboard URL (Development)
- Admin Dashboard: `http://localhost:5173`
- E-commerce Demo: `http://localhost:5174`

### 1. Overview Page

**What it shows:**
- Total journeys (active/completed/abandoned)
- Overall conversion rate
- Channel breakdown (pie chart)
- Stage drop-off rates (bar chart)
- Recent journeys table

**API Endpoint:** `GET /api/analytics/overview`

### 2. Journeys Page

**Features:**
- List all customer journeys
- Search by customer email
- Filter by status (Active/Completed/Abandoned)
- Filter by current stage
- Click journey to view details

**API Endpoint:** `GET /api/journeys`

### 3. Journey Detail Page

**Features:**
- Customer info and journey metadata
- Timeline of touchpoints (chronological)
- Donut chart (touchpoint type breakdown)
- Funnel chart (stage progression with drop-off %)
- Conversions list (with values)
- Raw events table (all events for this customer)
- Export journey as CSV

**API Endpoints:**
- `GET /api/journeys/{id}/map` — Journey with touchpoints + conversions
- `GET /api/journeys/{id}/touchpoint-summary` — Donut chart data
- `GET /api/journeys/{id}/conversion-funnel` — Funnel data
- `GET /api/journeys/{id}/raw-events` — All raw events

### 4. Customers Page

**Features:**
- List all customers
- View first seen / last seen dates
- Click customer to view all their journeys

**API Endpoint:** `GET /api/customers`

### 5. Campaigns Page

**Features:**
- List all campaigns
- View channel, dates, budget, status
- Create/edit/delete campaigns

**API Endpoints:**
- `GET /api/campaigns`
- `POST /api/campaigns`
- `PUT /api/campaigns/{id}`
- `DELETE /api/campaigns/{id}`

### 6. Setup Page (Admin Only)

**Features:**
- One-click system initialization
- Setup status check
- View counts (stages, channels, campaigns)
- Identify configuration issues

**API Endpoints:**
- `POST /api/admin/init`
- `GET /api/admin/setup-status`

---

## API Reference

### Public Endpoints (No Auth Required)

#### Ingest Event
```http
POST /api/raw-events
Content-Type: application/json

{
  "eventType": "PAGE_VIEW",
  "occurredAt": "2026-08-13T12:00:00Z",
  "source": "google",
  "medium": "organic",
  ...
}

Response 201:
{
  "eventId": 1,
  "customerId": 42,
  "journeyId": 10,
  "touchpointId": 123,
  "processed": true,
  "duplicate": false,
  "noise": false,
  "conversionCreated": false
}
```

#### Customer Auth (⚠️ Currently Blocked - See Known Issues)
```http
POST /api/auth/login
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}

Response 200:
{
  "customerId": 42,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "newCustomer": true
}
```

### Authenticated Endpoints (JWT Cookie Required)

#### List Journeys
```http
GET /api/journeys
Cookie: jwt=...

Response 200:
[
  {
    "journeyId": 10,
    "customerId": 42,
    "customerEmail": "jane@example.com",
    "currentStageId": 3,
    "currentStageName": "Decision",
    "startedAt": "2026-08-13T10:00:00Z",
    "endedAt": null,
    "status": "ACTIVE"
  }
]
```

#### Get Journey Map
```http
GET /api/journeys/{journeyId}/map
Cookie: jwt=...

Response 200:
{
  "journeyId": 10,
  "customerId": 42,
  "customerEmail": "jane@example.com",
  "status": "ACTIVE",
  "startedAt": "2026-08-13T10:00:00Z",
  "touchpoints": [ /* array of touchpoints */ ],
  "conversions": [ /* array of conversions */ ]
}
```

#### Get Analytics Overview
```http
GET /api/analytics/overview
Cookie: jwt=...

Response 200:
{
  "totalJourneys": 150,
  "activeJourneys": 80,
  "completedJourneys": 60,
  "abandonedJourneys": 10,
  "totalConversions": 60,
  "overallConversionRate": 0.40,
  "channelBreakdown": [ /* ... */ ],
  "stageDropOffs": [ /* ... */ ]
}
```

---

## Integration Examples

### React / Next.js

```typescript
// lib/tracker.ts
import { v4 as uuidv4 } from 'uuid';

const API_BASE = 'https://your-backend.com';
const ANONYMOUS_ID_KEY = 'anonymous_id';

function getAnonymousId(): string {
  let id = localStorage.getItem(ANONYMOUS_ID_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(ANONYMOUS_ID_KEY, id);
  }
  return id;
}

export async function trackEvent(eventType: string, data?: any) {
  const customerId = localStorage.getItem('customer_id');
  
  await fetch(`${API_BASE}/api/raw-events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerId: customerId ? parseInt(customerId) : null,
      anonymousId: getAnonymousId(),
      eventType,
      occurredAt: new Date().toISOString(),
      source: getSource(),
      medium: getMedium(),
      pageUrl: window.location.href,
      device: getDevice(),
      browser: getBrowser(),
      sourceSystem: 'web-app',
      rawPayload: data || {},
    }),
  });
}

export async function identifyCustomer(name: string, email: string) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  });
  
  const data = await response.json();
  localStorage.setItem('customer_id', data.customerId);
  localStorage.setItem('customer_email', email);
  
  // Track identification event
  await trackEvent('FORM_SUBMIT', { action: 'login', newCustomer: data.newCustomer });
}

// Usage in components
import { trackEvent, identifyCustomer } from '@/lib/tracker';

export default function ProductPage() {
  useEffect(() => {
    trackEvent('PAGE_VIEW', { page: 'product', productId: '123' });
  }, []);
  
  const handlePurchase = async () => {
    await trackEvent('PURCHASE', { 
      orderId: 'ORD-123', 
      total: 99.99,
      currency: 'USD'
    });
  };
  
  return <button onClick={handlePurchase}>Buy Now</button>;
}
```

### Vue.js

```javascript
// plugins/tracker.js
export default {
  install(app) {
    const API_BASE = 'https://your-backend.com';
    
    const tracker = {
      async track(eventType, data) {
        const customerId = localStorage.getItem('customer_id');
        const anonymousId = localStorage.getItem('anonymous_id') || generateId();
        
        await fetch(`${API_BASE}/api/raw-events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerId: customerId ? parseInt(customerId) : null,
            anonymousId,
            eventType,
            occurredAt: new Date().toISOString(),
            source: 'direct',
            medium: 'none',
            pageUrl: window.location.href,
            sourceSystem: 'web-app',
            rawPayload: data || {},
          }),
        });
      },
    };
    
    app.config.globalProperties.$track = tracker.track;
    app.provide('tracker', tracker);
  }
};

// Usage in component
export default {
  mounted() {
    this.$track('PAGE_VIEW', { page: 'home' });
  },
  methods: {
    async handleClick() {
      await this.$track('CLICK', { element: 'cta-button' });
    }
  }
};
```

### Vanilla JavaScript

```html
<script>
(function() {
  const API_BASE = 'https://your-backend.com';
  
  function getAnonymousId() {
    let id = localStorage.getItem('anonymous_id');
    if (!id) {
      id = 'anon-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('anonymous_id', id);
    }
    return id;
  }
  
  window.trackEvent = async function(eventType, data) {
    const customerId = localStorage.getItem('customer_id');
    
    await fetch(API_BASE + '/api/raw-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: customerId ? parseInt(customerId) : null,
        anonymousId: getAnonymousId(),
        eventType: eventType,
        occurredAt: new Date().toISOString(),
        source: 'direct',
        medium: 'none',
        pageUrl: window.location.href,
        sourceSystem: 'website',
        rawPayload: data || {}
      })
    });
  };
  
  // Auto-track page views
  trackEvent('PAGE_VIEW', { page: document.title });
})();
</script>

<!-- Usage -->
<button onclick="trackEvent('CLICK', {button: 'cta'})">Click Me</button>
```

---

## Common Use Cases

### 1. E-commerce Site

**Track:**
- Product page views
- Add to cart clicks
- Checkout form submissions
- Purchase completions

```javascript
// Product page
trackEvent('PAGE_VIEW', { page: 'product', productId: product.id });

// Add to cart
trackEvent('CLICK', { action: 'add_to_cart', productId: product.id });

// Checkout start
trackEvent('CLICK', { action: 'checkout_start' });

// Purchase complete
trackEvent('PURCHASE', { 
  orderId: order.id, 
  total: order.total,
  items: order.items.map(i => i.id)
});
```

### 2. SaaS Application

**Track:**
- Signup funnel
- Feature usage
- Upgrade events
- Churn signals

```javascript
// Signup page view
trackEvent('PAGE_VIEW', { page: 'signup' });

// Signup complete
trackEvent('SIGNUP', { plan: 'free' });

// Feature usage
trackEvent('CLICK', { feature: 'export', format: 'csv' });

// Upgrade
trackEvent('PURCHASE', { plan: 'premium', amount: 49.99 });
```

### 3. Content Marketing Site

**Track:**
- Blog post views
- Newsletter signups
- Content downloads
- Conversions

```javascript
// Blog post view
trackEvent('PAGE_VIEW', { 
  page: 'blog', 
  postId: post.id,
  category: post.category 
});

// Newsletter signup
trackEvent('FORM_SUBMIT', { action: 'newsletter_signup' });

// Ebook download
trackEvent('CLICK', { action: 'download', resource: 'ebook-guide.pdf' });
```

---

## Testing & Debugging

### 1. Use the Test Tool

Open `test-tracking-client.html` in your browser:
- Send test events with one click
- View response logs
- Test different event types
- Stress test the API

### 2. Check Browser Console

All tracking calls log to console:
- ✅ `[API] Event processed successfully: PAGE_VIEW`
- ⊗ `[API] Duplicate event detected: CLICK`
- ⚠ `[API] Event marked as noise: BOUNCE`
- ❌ `[API] Event tracking failed: { status: 400, ... }`

### 3. Use Diagnostic Script

```bash
./diagnose-dashboard-issue.sh
```

Checks:
- Auth status
- Journey count
- Customer count
- Setup status
- First journey details

### 4. Verify Event Processing

```bash
curl -X POST https://your-backend.com/api/raw-events \
  -H "Content-Type: application/json" \
  -d '{
    "eventType":"PAGE_VIEW",
    "occurredAt":"2026-08-13T12:00:00Z",
    "source":"test",
    "medium":"none",
    "sourceSystem":"test"
  }'
```

Expected response:
```json
{
  "processed": true,
  "duplicate": false,
  "noise": false,
  "journeyId": 1,
  "touchpointId": 1
}
```

---

## Best Practices

### Event Tracking

1. **Always send `eventType`** — It's the only required field
2. **Include attribution** — `source`, `medium`, `campaignName` for proper channel tracking
3. **Use consistent event types** — Stick to the documented types for automatic stage progression
4. **Deduplicate events** — Send unique `eventKey` to prevent duplicate processing
5. **Track both anonymous and authenticated** — Start with `anonymousId`, upgrade to `customerId` on login

### Performance

1. **Use `keepalive` for navigation events** — Ensures delivery before page unload
2. **Batch events if high volume** — Consider queuing and sending in batches
3. **Don't block UI** — Track events asynchronously (fire and forget)
4. **Monitor tracking health** — Use the tracking health monitor in dev/staging

### Privacy & Compliance

1. **Get consent before tracking** — Follow GDPR/CCPA requirements
2. **Don't send PII in rawPayload** — Keep sensitive data in structured fields (email, etc.)
3. **Respect Do Not Track** — Check `navigator.doNotTrack` before tracking
4. **Provide opt-out** — Allow users to disable tracking

### Data Quality

1. **Validate before sending** — Ensure required fields are present
2. **Use meaningful event names** — `PURCHASE` not `event_123`
3. **Include context** — Device, browser, page URL help with analysis
4. **Clean up test data** — Delete test journeys periodically

---

## Known Issues

### 🚨 Critical: Campaign Creation Not Working

**Impact:** Dashboard shows empty, events fail to process

**Status:** Backend bug - `/api/admin/init` creates 0 campaigns

**Workaround:** Create campaign manually:
```bash
curl -b cookies.txt -X POST https://your-backend.com/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Default Campaign",
    "channelId":1,
    "startDate":"2026-01-01",
    "endDate":"2026-12-31",
    "budget":0,
    "campaignStatus":"ACTIVE"
  }'
```

**See:** `DASHBOARD_EMPTY_DIAGNOSIS.md`

---

### 🚨 Critical: Customer Auth Returns 403

**Impact:** E-commerce customers can't log in, all events anonymous

**Status:** Endpoint exists in Swagger but returns 403 Forbidden

**Workaround:** Track with `anonymousId` only (no customer attribution)

**See:** `ECOMMERCE_AUTH_ISSUE.md`

---

### ⚠️ Event Pipeline Bugs (Fixed)

**Status:** ✅ Fixed and verified working

- Bug #1: Primitive boolean crash → Fixed (using `Boolean` wrapper)
- Bug #2: System user not found → Fixed (auto-created on init)
- Bug #3: Admin 403 → Expected behavior (documented)

**See:** `VERIFICATION_COMPLETE.md`

---

## Support & Resources

**Documentation:**
- `QUICK_START_GUIDE.md` — Get started in 5 minutes
- `DASHBOARD_EMPTY_DIAGNOSIS.md` — Troubleshooting empty dashboard
- `ECOMMERCE_AUTH_ISSUE.md` — Customer auth fix guide
- `VERIFICATION_COMPLETE.md` — Event pipeline verification

**Tools:**
- `diagnose-dashboard-issue.sh` — Automated diagnostic script
- `verify-pipeline.sh` — E2E pipeline verification
- `test-tracking-client.html` — Manual testing tool

**API Documentation:**
- Swagger: `https://your-backend.com/swagger-ui/index.html`

---

**Built with Claude Code ✨**
