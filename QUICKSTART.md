# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TailwindCSS
- Recharts (for charts)
- Axios (for API calls)
- Cloudinary (for image storage)

### Step 2: Set Up Environment Variables

```bash
# Copy the example file
cp .env.local.example .env.local
```

Then edit `.env.local` and add your credentials:

```env
# Cloudinary (Sign up at https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

# FastAPI ML Service (Your ML backend URL)
FASTAPI_URL=http://localhost:8000
FASTAPI_API_TOKEN=xxxx
```

### Step 3: Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Step 4: Explore the App

- **Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Upload**: [http://localhost:3000/upload](http://localhost:3000/upload)
- **Login**: [http://localhost:3000/auth/login](http://localhost:3000/auth/login)

## 📋 What's Included

### Pages
- ✅ Dashboard with panel grid
- ✅ Individual panel details with charts
- ✅ Image upload interface
- ✅ Login/Register pages

### Components
- ✅ Navbar with navigation
- ✅ Sidebar (optional)
- ✅ Footer
- ✅ Panel cards
- ✅ Status badges
- ✅ History charts

### API Routes
- ✅ `/api/upload` - Upload images to Cloudinary
- ✅ `/api/predict` - Get ML predictions
- ✅ `/api/panels` - CRUD operations for panels

### Utilities
- ✅ Cloudinary integration
- ✅ FastAPI client
- ✅ Validators
- ✅ Helper functions

## 🔧 Next Steps

### 1. Set Up Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from the dashboard
3. Add them to `.env.local`

### 2. Set Up FastAPI Backend

Your FastAPI service should have these endpoints:

```python
POST /predict
{
  "image_url": "https://..."
}

Response:
{
  "condition": "Clean" | "Dusty" | "Damaged",
  "confidence": 0.95,
  "details": {}
}
```

### 3. Add a Database (Optional)

To persist panel data, integrate a database:

**Option A: Supabase** (Recommended for quick setup)
```bash
npm install @supabase/supabase-js
```

**Option B: Prisma + PostgreSQL**
```bash
npm install prisma @prisma/client
npx prisma init
```

**Option C: MongoDB**
```bash
npm install mongodb mongoose
```

### 4. Implement Real Authentication

**Option A: NextAuth.js**
```bash
npm install next-auth
```

**Option B: Supabase Auth**
```bash
npm install @supabase/auth-helpers-nextjs
```

**Option C: Clerk**
```bash
npm install @clerk/nextjs
```

### 5. Add UI Components (Optional)

Install shadcn/ui components:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill the process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Image Not Loading
- Check Cloudinary credentials in `.env.local`
- Verify domain is added to `next.config.js`

### API Errors
- Ensure FastAPI service is running
- Check `FASTAPI_URL` in `.env.local`
- Verify CORS is enabled on FastAPI

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Recharts Documentation](https://recharts.org/)

## 🎯 Production Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel

Add all variables from `.env.local` to your Vercel project settings.

### Build for Production

```bash
npm run build
npm start
```

## 💡 Tips

1. **FastAPI Integration**: The app calls your FastAPI backend through Next.js API routes. If FastAPI is offline, the UI falls back to mock data so you can still demo the dashboard.
2. **Authentication**: Implement proper auth before deploying to production.
3. **Database**: Add a database for persistent storage.
4. **Testing**: Add tests before deploying.
5. **Monitoring**: Set up error tracking (Sentry, LogRocket, etc.)

## 🤝 Need Help?

- Check the main [README.md](./README.md)
- Review the code comments
- Check Next.js documentation

Happy coding! 🚀

