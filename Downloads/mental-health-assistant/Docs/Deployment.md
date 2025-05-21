## Deployment Guide – Mental Health Voice Assistant

This guide explains how to deploy the backend and frontend of the Mental Health Voice Assistant project using **Vercel** for frontend and **Firebase Functions** for the backend.

---

### 🧱 Project Structure Summary

* Frontend: Next.js 14 App Router (deployed via Vercel)
* Backend: Firebase Functions (serverless)
* Database: Firestore
* Auth: Firebase Authentication

---

### 🚀 Frontend Deployment (Vercel)

#### 1. **Push Your Code to GitHub**

Ensure your frontend code (in `/mental-health-assistant`) is pushed to a GitHub repo.

#### 2. **Connect to Vercel**

* Go to [vercel.com](https://vercel.com/)
* Connect your GitHub account
* Select the repo and import it
* Set environment variables:

```
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_token
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

* Click **Deploy**

---

### 🔧 Backend Deployment (Firebase Functions)

#### 1. **Install Firebase Tools**

```bash
npm install -g firebase-tools
```

#### 2. **Login & Init**

```bash
firebase login
firebase init functions
```

* Use TypeScript
* Choose existing project

#### 3. **Setup Admin SDK Credentials**

Add the following environment variables in `.env`:

```
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=... (escaped properly)
GOOGLE_GENERATIVE_AI_API_KEY=...
```

#### 4. **Deploy Backend**

```bash
firebase deploy --only functions
```

---

### 🛠 Recommended Folder Structure

```
functions/
├── src/
│   ├── index.ts         # Firebase Functions entry point
│   ├── sessions.ts      # Handles /respond and /complete
│   ├── auth.ts          # Handles login and signup
│   ├── gemini.ts        # Gemini wrapper logic
│   └── utils.ts
├── .env
├── package.json
└── tsconfig.json
```

---

### 🧪 Local Development

You can run Firebase Functions locally:

```bash
firebase emulators:start
```

For frontend:

```bash
npm run dev
```

---

### ✅ Final Checks

* VAPI webhook points to `/api/webhook`
* All Firebase rules are set correctly
* CORS is handled if frontend/backend are separate

---

### 🧠 Notes

* Free tier of Firebase and Vercel is enough for testing
* No credit card is needed
* Upgrade only when scale or HIPAA compliance is required
