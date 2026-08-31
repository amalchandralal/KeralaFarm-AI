# AgroVision AI - Bug Reports

## Bug 1: Dashboard displays hardcoded "Kerala" as fallback location name

**Severity:** Low

**Steps to Reproduce:**
1. Login to AgroVision.
2. Navigate to `/dashboard`.
3. If geolocation API fails or returns no label AND backend location data is null, observe the location name under the welcome header.

**Expected Behavior:**
Should display "Your Location" or GPS coordinates as fallback.

**Actual Behavior:**
Displays hardcoded string "Kerala" (see `DashboardPage.jsx` line 119: `|| 'Kerala'`). This is incorrect for users outside Kerala.

**Affected Files:**
`frontEnd/client/pages/DashboardPage.jsx` line 119

**Impact:**
Users in other Indian states or countries see incorrect location branding.

---

## Bug 2: Dashboard market summary section has hardcoded "Kerala Market Highlights" heading

**Severity:** Low

**Steps to Reproduce:**
1. Login to AgroVision.
2. Navigate to `/dashboard`.
3. Scroll to the right sidebar "Market Prices Brief" section.

**Expected Behavior:**
Heading should say "Market Highlights" or dynamically reference user's state.

**Actual Behavior:**
Heading is hardcoded as "Kerala Market Highlights" (`DashboardPage.jsx` line 364).

**Affected Files:**
`frontEnd/client/pages/DashboardPage.jsx` line 364

**Impact:**
Misleading for users viewing market prices from other states.

---

## Bug 3: Disease Scanner accepts arbitrarily large files without size validation

**Severity:** Medium

**Steps to Reproduce:**
1. Login and navigate to `/scan`.
2. Upload a very large image file (e.g., 50MB RAW photo).
3. Click Analyze Image.

**Expected Behavior:**
Client should reject files exceeding a reasonable limit (e.g., 10MB) with a user-friendly error before uploading.

**Actual Behavior:**
The file is accepted regardless of size. Canvas compression mitigates bandwidth, but very large files cause browser memory spikes and slow canvas processing. No explicit size check exists in `DiseaseScanner.jsx` `handleFile()` function — it only checks `file.type.startsWith('image/')` (line 15).

**Affected Files:**
`frontEnd/client/components/DiseaseScanner.jsx` lines 14-25

**Impact:**
Poor UX on mobile devices with limited RAM. Potential browser tab crash with extremely large files.
