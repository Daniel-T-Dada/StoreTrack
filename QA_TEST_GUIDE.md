# StoreTrack — QA Test Guide

This document is a practical checklist for testing StoreTrack end-to-end.

## Scope

- Frontend: Next.js (App Router) + shadcn/ui + TanStack React Query
- Backend: StoreTrack API (via Next proxy `/api/proxy/*`)
- Auth: Email verification (OTP), cookie-based sessions, password reset
- Core flows: Products, POS checkout, receipts/transactions, staff/admin dashboards, profile image

## Environments

- Local FE: `http://localhost:3000`
- Local API: configured via `BACKEND_API_URL` (Next proxy)

## Roles & permissions (expected)

- **Admin / Manager (owner users)**
  - Can view dashboard, products, sales, reports
  - Can manage staff (admin has extra privileges like delete)
  - Can record sales/checkout **as themselves** (cashier attribution handled by backend)
- **Staff users**
  - Can access staff dashboard and sales flows
  - Cannot access Reports/Staff management screens

> Note: The backend enforces store scoping. Product IDs and staff/users are bound to a store.

## Test data setup

You’ll need at least:

- 1 verified owner account (admin or manager)
- 1 staff account created under the same store
- 2–3 products with:
  - valid `price` and `costPrice`
  - non-zero `quantity`
  - at least one product with low stock

---

# 1) Authentication & Email Verification (OTP)

## 1.1 Register (Send OTP)

**Steps**

1. Go to `/signup`
2. Fill: Name, Email, Password, Store Name
3. Submit

**Expected**

- UI confirms account creation and instructs user to check email
- User is redirected to `/verify-otp?email=...`

**Backend integration**

- `POST /api/auth/register-send-otp` (no tokens returned)

## 1.2 Verify OTP + Login

**Steps**

1. On `/verify-otp`, confirm email field is populated (or enter it)
2. Enter the 6-digit OTP code
3. Submit

**Expected**

- Success message
- User is signed in (cookies set) and redirected to `/`
- Sidebar/nav matches the user role

**Backend integration**

- `POST /api/auth/verify-otp-login` (sets HttpOnly cookies)

## 1.3 Resend OTP

**Steps**

1. On `/verify-otp`, click **Resend code**

**Expected**

- Generic success message (no account enumeration)

**Backend integration**

- `POST /api/auth/resend-verification`

## 1.4 Login gating (Email not verified)

**Steps**

1. Register but do not verify OTP
2. Go to `/signin`
3. Attempt login with the correct credentials

**Expected**

- Backend responds `403 Email not verified`
- Frontend redirects to `/verify-otp?email=...` and displays a prompt to verify

---

# 2) Password Reset

## 2.1 Forgot password

**Steps**

1. Go to `/forgot-password`
2. Enter an email
3. Submit

**Expected**

- UI displays a generic success message
- If the environment sends emails, the email should contain a link like:
  - `/reset-password?token=...`

**Backend behavior notes**

- Each new request overwrites the previous token
- Token expiry: ~30 minutes

## 2.2 Reset password

**Steps**

1. Open `/reset-password?token=...`
2. Enter a new password and confirm
3. Submit

**Expected**

- Password is reset
- User is redirected to `/signin` and can log in with new password

---

# 3) Navigation / RBAC

## 3.1 Staff user navigation

**Steps**

1. Sign in as a staff account

**Expected**

- User is redirected to `/staff-dashboard`
- Sidebar does **not** show privileged links like Reports/Staff

## 3.2 Admin/Manager navigation

**Steps**

1. Sign in as admin/manager

**Expected**

- Dashboard shows owner widgets
- Sidebar includes Products, Sales, Reports, Staff (depending on role)

---

# 4) Products (Admin/Manager)

## 4.1 Create product

**Steps**

1. Go to `/products/create`
2. Enter required fields including valid numeric `price` and `costPrice`
3. Save

**Expected**

- Product appears in `/products`
- Prices display in NGN formatting

**Negative tests**

- Leave price/cost price empty → should be blocked by the UI
- Enter non-numeric values → should be blocked by the UI

## 4.2 Edit product

**Steps**

1. Go to `/products/[id]`
2. Change quantity/price
3. Save

**Expected**

- List updates

## 4.3 Staff restrictions

**Steps**

1. Sign in as staff
2. Attempt to access `/products/create` or `/products/[id]`

**Expected**

- Staff is redirected away or prevented from managing products

---

# 5) Sales / POS checkout

## 5.1 Add items to cart via Search

**Steps**

1. Go to `/sales`
2. Search by name/SKU/barcode
3. Click **Add**

**Expected**

- Item appears in cart
- Quantity can be adjusted but not exceed available stock

## 5.2 Add item via Lookup (SKU/barcode)

**Steps**

1. Enter SKU or barcode in "Scan / Quick Lookup"
2. Click **Add**

**Expected**

- Item is added to cart

## 5.3 Checkout

**Steps**

1. Add 1–3 items to cart
2. Click **Checkout**

**Expected**

- Backend computes totals
- Success toast
- App redirects to the receipt view: `/sales/history/[transactionId]`

**Backend integration**

- `POST /api/sales/checkout`
- Payload contains `items` and optional `client.expectedTotal`
- **Important**: For admin/manager tokens, frontend must NOT send a `staff` field

## 5.4 Receipt view

**Steps**

1. After checkout, confirm receipt page loads

**Expected**

- Receipt shows transaction summary and itemized totals
- NGN currency formatting

## 5.5 Store scoping negative test

**Steps**

1. Attempt checkout using a product ID from another store/account (if possible)

**Expected**

- Backend rejects with 404 "Product not found in this store"
- Frontend displays a friendly error

---

# 6) Transactions / Sales history

## 6.1 Transactions list

**Steps**

1. Go to `/sales/history`

**Expected**

- List of transactions displayed
- Clicking an item count navigates to `/sales/history/[id]`

## 6.2 Filtering (admin/manager)

**Steps**

1. Sign in as admin/manager
2. Use staff filter (if shown)

**Expected**

- Results reflect selected staff filter (subject to backend implementation)

---

# 7) Reports (Admin/Manager only)

## 7.1 Reports access

**Steps**

1. As admin/manager: open `/reports`
2. As staff: open `/reports`

**Expected**

- Admin/manager can view reports
- Staff should be blocked/redirected or shown an access-denied message

---

# 8) Staff management (Admin/Manager only)

## 8.1 View staff list

**Steps**

1. As admin/manager: open `/staff`

**Expected**

- Staff list loads

## 8.2 Staff restrictions

**Steps**

1. Sign in as staff
2. Open `/staff`

**Expected**

- Access denied UI and no staff list

---

# 9) Profile picture (Cloudinary direct upload)

## 9.1 Upload profile image

**Steps**

1. Go to `/profile`
2. Click **Change picture**
3. Select an image <= 5MB

**Expected**

- Upload progress appears
- Avatar updates

**Backend integration**

- `POST /api/uploads/cloudinary-signature`
- Direct upload to Cloudinary
- `PUT /api/auth/me/profile-image` with `{ profileImagePublicId }`

## 9.2 Remove profile image

**Steps**

1. Click **Remove picture**

**Expected**

- Profile image cleared

---

# 10) Logout

**Steps**

1. Click Logout in the sidebar footer

**Expected**

- Cookies cleared
- User redirected to `/signin`
- Subsequent access to protected routes should redirect to sign-in

---

# 11) UX / Consistency checks

- Currency formatting is consistent (NGN) across:
  - Dashboard cards, products, cart totals, receipts, reports
- No “privileged links flash” for staff users during initial load
- Loading states show skeletons where appropriate
- Mobile responsiveness:
  - Sidebar collapses/works
  - Tables remain usable

---

# Known integration notes (for QA awareness)

- Store scoping is enforced by backend. Always create/select products under the same authenticated store.
- Forgot-password links expire and can be invalidated by requesting a new reset.
- OTP resend returns a generic message by design.

---

# QA sign-off checklist

Use this section as the final QA summary to share back with the team.

## Build + environment

- [ ] App loads at `http://localhost:3000`
- [ ] No console errors during normal flows
- [ ] Network calls go through `/api/proxy/*` (cookie auth)

## Auth (OTP)

- [ ] Register triggers OTP flow and redirects to `/verify-otp`
- [ ] OTP verify logs user in and redirects to `/`
- [ ] Resend OTP shows generic success message
- [ ] Login gating works: unverified login redirects to `/verify-otp`

## Password reset

- [ ] Forgot password returns generic message
- [ ] Reset password works with valid token
- [ ] Old tokens become invalid after new request

## RBAC / navigation

- [ ] Staff cannot see or access Reports/Staff management
- [ ] Admin/Manager can access dashboard + products + sales + reports
- [ ] No privileged-link flash on initial load for staff

## Inventory + sales

- [ ] Product create/edit validates numeric price/costPrice
- [ ] Cart add/search/lookup works
- [ ] Checkout succeeds and redirects to receipt
- [ ] Receipt page shows itemized totals and NGN formatting

## Profile

- [ ] Upload profile image shows progress and updates avatar
- [ ] Remove profile image works

## Logout

- [ ] Logout clears session and redirects to `/signin`

## QA result

- Result: **PASS / FAIL**
- Tested by:
- Date:
- Environment (local/staging/prod):
- Notes:

---

# Bug report template

Copy/paste this for each defect.

## Title

Short, specific summary.

## Environment

- URL:
- Browser + version:
- Account type: admin / manager / staff
- Store context (if relevant):

## Steps to reproduce

1.
2.
3.

## Expected result

What should happen.

## Actual result

What happened instead.

## Evidence

- Screenshots/screen recording:
- Console logs:
- Network request + response payload (redact secrets):

## Severity

- Blocker / High / Medium / Low

## Notes

- Any workarounds found:
