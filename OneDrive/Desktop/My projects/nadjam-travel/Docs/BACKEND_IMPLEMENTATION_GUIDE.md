# Nadjam Travel – Backend Implementation Guide for Cursor

> **Purpose**: This markdown file instructs Cursor-AI to scaffold the full backend MVP for Nadjam Travel, with special focus on **admin login**, **entity selection**, and **CRUD for Hotels & Packages**. Work top‑to‑bottom and fill the TODO blocks in each file.

---

## 0  Project Bootstrap

* [ ] **Create the repo** `nadjam-backend` and open in Cursor.
* [ ] **Init Next 15 (App Router) with TypeScript**

  ```bash
  npx create-next-app@latest nadjam-backend \
    --typescript --app --no-tailwind --import-alias "@/*"
  ```
* [ ] **Install dependencies**

  ```bash
  pnpm add firebase firebase-admin @types/jsonwebtoken jsonwebtoken zod bcryptjs
  pnpm add -D @types/bcryptjs @types/jsonwebtoken dotenv prettier eslint
  ```

---

## 1  Environment Variables

Create **`.env.local`**:

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=

JWT_SECRET=super_secret_change_me
```

> Cursor: Autofill from Firebase console later.

---

## 2  Shared Firebase Helpers

* **`src/lib/firebase.ts`** – client SDK
* **`src/lib/firebaseAdmin.ts`** – admin SDK

```ts
// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const cfg = { /* env vars */ };
export const app = getApps()[0] || initializeApp(cfg);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

```ts
// src/lib/firebaseAdmin.ts
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth as adminAuth } from 'firebase-admin/auth';
import { getFirestore as adminDb } from 'firebase-admin/firestore';
import { getStorage as adminStorage } from 'firebase-admin/storage';
const svc = { /* serviceAccount */ };
const appAdmin = getApps().length ? getApps()[0] : initializeApp({ credential: cert(svc) });
export { adminAuth, adminDb, adminStorage };
```

---

## 3  Auth + Admin Flow

### 3.1  Auth Utilities

* **`src/lib/auth.ts`** – verify Firebase tokens & roles

```ts
import { NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
export async function verifyAuth(req: NextRequest) { /* ... */ }
export async function verifyAdmin(req: NextRequest) { /* throw if not admin */ }
```

### 3.2  Admin Pages Entry

* **Login page**: `app/admin/login/page.tsx` uses Firebase Auth UI.
* **Admin layout**: `app/admin/layout.tsx` wraps routes with a check:

  ```ts
  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(u => {
      if (u.role !== 'admin') redirect('/admin/login');
    });
  }, []);
  ```

### 3.3  Entity Selector

* **`app/admin/page.tsx`**: ask "What do you want to manage?" with links:

  * **Packages** → `/admin/packages`
  * **Hotels**   → `/admin/hotels`
  * **Flights**  → `(v2)`

---

## 4  CRUD Scaffold for Hotel & Package

### 4.1  Hotels Endpoints

```
app/api/hotels/route.ts           ← list + create
app/api/hotels/[id]/route.ts      ← read + update + soft-delete
```

* **List (GET)**: filters (`city`, `minPrice`, `featured`, `active`) + pagination.
* **Create (POST)**: `verifyAdmin()`, Zod validation matching `Hotel` interface, upload images, save.
* **Read (GET /\[id])**: fetch hotel + related reviews.
* **Update (PUT)**: `verifyAdmin()`, Zod.partial(), handle image changes.
* **Soft-delete (DELETE)**: `verifyAdmin()`, set `{ active: false, featured: false }`.

### 4.2  Packages Endpoints

```
app/api/packages/route.ts          ← list + create
app/api/packages/[slug]/route.ts   ← read + update + soft-delete
```

* **List (GET)**: filters (`category`, `difficulty`, `minPrice`, `featured`, `active`) + pagination.
* **Create (POST)**: `verifyAdmin()`, Zod validation matching `Package` interface, upload images, save.
* **Read (GET /\[slug])**: `.where('slug','==',slug)` + include reviews.
* **Update (PUT)**: `verifyAdmin()`, Zod.partial(), update fields.
* **Soft-delete (DELETE)**: `verifyAdmin()`, set `{ active: false, featured: false }`.

> Cursor: where you see TODO, invoke "Fill code from comment."

---

## 5  Frontend Integration Notes

* **Data fetching**: replace `import mock` with `fetch('/api/...')` or `onSnapshot` listener.
* **Mutations**: wire form submit & toggles to POST/PUT/DELETE endpoints.
* **Realtime vs ISR**: choose `onSnapshot` for instant, or `revalidate = 60` if using server components.
* **Feature flags**: query `where('featured','==',true)` for public "Top Picks."

---

## 6  Security & Testing

1. **Firestore rules**: public read, admin-only writes on `hotels` & `packages`.
2. **Emulator testing**: `firebase emulators:start --only firestore,auth`.
3. **TypeScript**: ensure `strict` mode catches any type drift.
4. **Jest**: write one happy-path + one validation-failure test per endpoint.
5. **Lint & format**: `pnpm lint` & `pnpm format` before commits.

---

🎯  **Goal**: Admin can log in → select "Hotels" or "Packages" → perform CRUD (including toggling `featured`) → public frontend reflects **active** & **featured** in real time or via ISR.

Once all tasks are checked, your backend MVP is complete and integrated with the existing UI. 🚀
