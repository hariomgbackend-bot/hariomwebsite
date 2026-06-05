# Hariom Electronics — Admin Portal

Separate standalone internal admin web app for inventory, offers, and CRM management.

## Setup

### 1. Firebase Configuration

Open `js/firebase-config.js` and replace the config object with your Firebase project's web app config:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ...
}
```

### 2. Admin User

1. Go to Firebase Console → Authentication → Sign-in method → Enable **Email/Password**
2. Go to Authentication → Users → **Add user** with your admin email/password

### 3. Firestore Rules (CRITICAL)

1. Go to Firebase Console → Firestore Database → Rules
2. Delete existing rules and paste the entire content from `firestore.rules`
3. Replace `ADMIN_UID_HERE` with your actual admin UID (find it in Authentication → Users)
4. Click **Publish**

### 4. Create Collections

Create these collections in Firestore:
- `products` — Add at least 1 test document with fields: `name`, `brand`, `category`, `price`, `is_visible` (boolean)
- `promotions` — Add at least 1 test document with fields: `title`, `description`, `badge`, `isActive` (boolean)
- `enquiries` — Add at least 1 test document with fields: `name`, `email`, `phone`, `message`, `read` (boolean)

## Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from the hariom-admin folder
cd hariom-admin
vercel --prod
```

Or connect the folder as a separate project on vercel.com.

## Structure

```
hariom-admin/
├── index.html              # Main HTML shell
├── vercel.json             # Vercel deployment config
├── firestore.rules         # Security rules to copy to Firebase
├── README.md
├── css/
│   ├── style.css           # Base styles, login, buttons, modal
│   └── dashboard.css       # Dashboard layout, sidebar, tables
├── js/
│   ├── firebase-config.js  # Firebase init (EDIT THIS)
│   ├── auth.js             # Auth module (login/logout/state)
│   ├── app.js              # Entry point, routing, nav
│   ├── utils/
│   │   ├── audio-alert.js  # Notification sound for enquiries
│   │   └── table.js        # Reusable table renderer + toast/modal
│   ├── modules/
│   │   ├── dashboard.js    # Overview stats cards
│   │   ├── stock.js        # Products CRUD + real-time table
│   │   ├── offers.js       # Promotions CRUD + toggle
│   │   └── enquiries.js    # Live enquiry inbox with alert
│   └── audio/
│       └── alert.wav       # (Optional) Notification sound
```
