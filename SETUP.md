# ABSENCE E-commerce Setup Guide

## Prerequisites
- Node.js (v18+)
- MongoDB
- Razorpay Account
- Cloudinary Account

## Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
- MongoDB URI
- JWT Secret
- Razorpay Keys (from https://dashboard.razorpay.com/)
- Cloudinary credentials (from https://cloudinary.com/)
- Email SMTP settings

5. Start backend server:
```bash
npm run dev
```

Backend will run on http://localhost:5000

## Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

5. Start frontend:
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## Creating Superadmin

After starting the backend, create a superadmin account:

1. Register a new user at http://localhost:3000/login
2. Connect to MongoDB and update the user's role:
```javascript
db.users.updateOne(
  { email: "your_email@example.com" },
  { $set: { role: "superadmin" } }
)
```

## Features Checklist

✅ User Authentication (Login/Register)
✅ Product Management (CRUD with images)
✅ Size Chart Upload
✅ SEO Fields for Products
✅ Shopping Cart
✅ Checkout Process
✅ Razorpay Payment Integration
✅ Payment Ledger & History
✅ Order Management
✅ Order Status Tracking
✅ Coupon System
✅ Email Marketing with Templates
✅ Email Campaigns
✅ User Management
✅ Role-based Access (User/Admin/Superadmin)
✅ Sales Analytics
✅ Dashboard with Stats
✅ Cloudinary Image Uploads
✅ Modern UI with Tailwind CSS
✅ Responsive Design

## Default Login Credentials

After creating your account and setting it as superadmin, you can:
- Manage all products
- Create coupons
- View all orders
- Manage users
- Send email campaigns
- View analytics

## Important Notes

1. Make sure MongoDB is running before starting the backend
2. Razorpay test mode keys work for testing payments
3. For production, update all environment variables with production credentials
4. Enable CORS properly for production deployment
5. Set up proper email SMTP for email marketing features

## Production Deployment

### Backend (Node.js)
- Deploy to services like Heroku, Railway, or DigitalOcean
- Set environment variables in hosting platform
- Use MongoDB Atlas for database

### Frontend (Next.js)
- Deploy to Vercel (recommended) or Netlify
- Set environment variables in deployment platform
- Update API URL to production backend URL

## Support

For issues or questions, check:
- MongoDB connection string format
- Razorpay API keys are correct
- Cloudinary credentials are valid
- CORS is properly configured
