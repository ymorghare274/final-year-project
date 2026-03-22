# 🔐 Environment Variables Setup Guide

This guide will help you configure the environment variables required to run the **Yukta Jewellery** platform locally and in production.

---

## 📂 1. Backend Setup (`/backend/.env`)

Create a file named `.env` inside the `backend` folder and add the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database (Supabase)
# Get this from: https://supabase.com/dashboard/project/_/settings/api
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Authentication (JWT)
# Use a long random string for security
JWT_SECRET=your_super_secret_unique_string
JWT_EXPIRE=30d

# Payments (Stripe)
# Get these from: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email Service (Nodemailer)
# For Gmail, use an "App Password"
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_google_app_password
```

---

## 📂 2. Frontend Setup (`/frontend/.env.local`)

Create a file named `.env.local` inside the `frontend` folder and add these variables. Note that variables used on the client-side must be prefixed with `NEXT_PUBLIC_`.

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Stripe Public Key (For Checkout)
# Get this from: https://dashboard.stripe.com/test/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🛠️ How to get these values?

### ⚡ Supabase Credentials
1. Login to [Supabase Dashboard](https://supabase.com/).
2. Create or select a Project.
3. Go to **Project Settings** (gear icon) -> **API**.
4. Copy the **Project URL** and the **`anon` `public` API Key**.
5. To setup tables, go to **SQL Editor** and paste the contents of `supabase_schema.sql` (found in project root).

### 💳 Stripe Keys
1. Login to your [Stripe Dashboard](https://dashboard.stripe.com/).
2. Toggle "Test Mode" on.
3. Go to **Developers** -> **API Keys**.
4. Copy the **Publishable key** and **Secret key**.

### 📧 Gmail App Password
1. Go to your [Google Account Security](https://myaccount.google.com/security).
2. Enable **2-Step Verification**.
3. Scroll down to **App passwords**.
4. Select App as 'Other' and Name it 'Jewellery Shop'.
5. Copy the 16-character code.

---

> **⚠️ Security Warning:** Never commit your `.env` files to GitHub. They are already listed in the `.gitignore` files to keep your secrets safe.
