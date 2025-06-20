- Initialize project & install dependencies
- Add `.env.local` with Firebase & admin creds
- Create shared Firebase helpers (`lib/firebase.ts` & `lib/firebaseAdmin.ts`)
- Implement auth utilities (`verifyAuth`/`verifyAdmin`) and `/api/auth/me` route
- Scaffold admin pages:
  - Login page (`app/admin/login/page.tsx`)
  - Protected layout (`app/admin/layout.tsx`)
  - Entity selector (`app/admin/page.tsx`)
- Generate API routes for Hotels:
  - `app/api/hotels/route.ts` (GET list + POST create)
  - `app/api/hotels/[id]/route.ts` (GET read + PUT update + DELETE soft-delete)
- Generate API routes for Packages:
  - `app/api/packages/route.ts` (GET list + POST create)
  - `app/api/packages/[slug]/route.ts` (GET read + PUT update + DELETE soft-delete)
- Add Firestore security rules (public read, admin-only writes)
- Wire up frontend data-fetching & mutations (replace mocks with `/api/*`)
- Test in emulator & add basic Jest tests for each endpoint
