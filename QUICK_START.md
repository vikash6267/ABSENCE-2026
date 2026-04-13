# Quick Start Guide - ABSENCE E-commerce

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Setup Environment Variables

### Backend (.env file already created)
Edit `backend/.env` and add your credentials:

1. **MongoDB** (Required)
   - If you have MongoDB installed locally, keep: `mongodb://localhost:27017/absence-ecommerce`
   - Or use MongoDB Atlas: Get connection string from https://cloud.mongodb.com/

2. **Razorpay** (Required for payments)
   - Sign up at: https://razorpay.com/
   - Go to: https://dashboard.razorpay.com/app/website-app-settings/api-keys
   - Copy Test Key ID and Key Secret
   - Update in .env:
     ```
     RAZORPAY_KEY_ID=rzp_test_xxxxx
     RAZORPAY_KEY_SECRET=xxxxx
     ```

3. **Cloudinary** (Required for image uploads)
   - Sign up at: https://cloudinary.com/
   - Go to: https://cloudinary.com/console
   - Copy Cloud Name, API Key, API Secret
   - Update in .env:
     ```
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=123456789012345
     CLOUDINARY_API_SECRET=xxxxx
     ```

4. **Email** (Optional - for email marketing)
   - For Gmail:
     - Enable 2-factor authentication
     - Generate App Password: https://myaccount.google.com/apppasswords
     - Update in .env:
       ```
       EMAIL_USER=your_email@gmail.com
       EMAIL_PASS=your_16_digit_app_password
       ```

### Frontend
```bash
cd frontend
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

## Step 3: Start MongoDB

If using local MongoDB:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

Or use MongoDB Atlas (cloud) - no local installation needed!

## Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on: http://localhost:5000

## Step 5: Start Frontend

Open new terminal:
```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:3000

## Step 6: Create Superadmin Account

1. Open browser: http://localhost:3000
2. Click "Login" → "Create Account"
3. Register with your email

4. Open MongoDB and update user role:

**Using MongoDB Compass:**
- Connect to: `mongodb://localhost:27017`
- Database: `absence-ecommerce`
- Collection: `users`
- Find your user and edit
- Change `role` from `"user"` to `"superadmin"`

**Using MongoDB Shell:**
```javascript
use absence-ecommerce
db.users.updateOne(
  { email: "your_email@example.com" },
  { $set: { role: "superadmin" } }
)
```

5. Refresh browser and login again
6. You'll now see "Admin Panel" in user menu

## Step 7: Add Products

1. Go to Admin Panel → Products
2. Click "Add Product"
3. Fill details:
   - Name, Description, Price
   - Category (e.g., "T-Shirts")
   - Sizes with stock
   - SEO fields
   - Upload images (will go to Cloudinary folder: `absence/products`)
4. Click Create

## Folder Structure in Cloudinary

Images will be organized as:
- `absence/products/` - Product images
- `absence/size-charts/` - Size chart images

## Testing Payments

Use Razorpay test cards:
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## Common Issues

### Backend won't start
- Check if MongoDB is running
- Verify .env file has correct values
- Make sure port 5000 is not in use

### Images not uploading
- Verify Cloudinary credentials in .env
- Check internet connection
- Ensure image size is under 5MB

### Payment not working
- Verify Razorpay keys in both backend/.env and frontend/.env.local
- Use test mode keys (starting with rzp_test_)
- Check browser console for errors

## Next Steps

1. Add your products
2. Create coupons
3. Setup email templates
4. Test the complete flow
5. Customize colors in `frontend/tailwind.config.js`

## Support

Check these files for more details:
- `README.md` - Overview
- `SETUP.md` - Detailed setup
- Backend API routes in `backend/routes/`
- Frontend pages in `frontend/app/`

Happy coding! 🚀
