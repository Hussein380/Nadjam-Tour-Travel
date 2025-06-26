# Firebase Setup Guide

## 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

## 2. Login to Firebase
```bash
firebase login
```

## 3. Initialize Firebase Project
```bash
firebase init
```

## 4. Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

## 5. Deploy Indexes
```bash
firebase deploy --only firestore:indexes
```

## 6. Start Emulators (for testing)
```bash
firebase emulators:start --only firestore,auth
```

## Security Rules Summary

### Hotels Collection
- ✅ **Public Read**: Anyone can read hotel data
- 🔒 **Admin Write**: Only authenticated admins can create/update/delete

### Packages Collection  
- ✅ **Public Read**: Anyone can read package data
- 🔒 **Admin Write**: Only authenticated admins can create/update/delete

### Admin Access
- Email: `admin@nadjamtravel.co.ke`
- Role: `admin` in Firebase Auth custom claims
- UID-based admin verification in `/admins` collection

### Indexes Created
- Hotels: `active + featured + price`, `active + location`
- Packages: `active + featured + price`, `active + category`, `active + difficulty`, `slug`

## Testing Security Rules
```bash
# Test read access (should work)
curl -X GET "http://localhost:8080/v1/projects/nadjam-travel/databases/(default)/documents/hotels"

# Test write access without auth (should fail)
curl -X POST "http://localhost:8080/v1/projects/nadjam-travel/databases/(default)/documents/hotels" \
  -H "Content-Type: application/json" \
  -d '{"fields": {"name": {"stringValue": "Test Hotel"}}}'
``` 