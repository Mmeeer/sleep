# 🚀 Deployment Guide

## Overview

This guide will help you deploy the SleepWell platform with:
- **Backend**: Node.js server (can be hosted on any Node.js platform)
- **Frontend**: Static HTML files (optimized for DigitalOcean static hosting)

## Prerequisites

- Backend hosting account (Railway, Render, Heroku, etc.)
- DigitalOcean account (or any static hosting service)
- Your repository URL

## Part 1: Deploy Backend Server

### Option A: Railway (Recommended)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up/login with GitHub

2. **Deploy from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect Node.js

3. **Configure Environment**
   - Add environment variables:
     - `ADMIN_PASSWORD`: Your secure admin password
     - `PORT`: 3000 (Railway auto-assigns, but keep for compatibility)
   - Set root directory to `/backend`

4. **Deploy**
   - Railway will automatically build and deploy
   - Copy your deployment URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up/login

2. **New Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure:
     - Name: sleepwell-backend
     - Environment: Node
     - Build Command: `cd backend && npm install`
     - Start Command: `cd backend && npm start`

3. **Environment Variables**
   - Add `ADMIN_PASSWORD`
   - Copy your service URL

### Option C: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create sleepwell-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set ADMIN_PASSWORD=your_secure_password
   ```

4. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```

## Part 2: Configure Frontend

1. **Update Backend URL**

   Edit both `public/index.html` and `public/admin.html`:

   Find this line:
   ```javascript
   const ROOT = 'http://localhost:3000';
   ```

   Replace with your backend URL:
   ```javascript
   const ROOT = 'https://your-backend.railway.app';
   ```

2. **Test Locally**
   ```bash
   # Start backend
   cd backend
   npm start

   # In another terminal, serve frontend
   cd public
   python3 -m http.server 8000
   # Or use any static server
   ```

   Visit `http://localhost:8000` to test

## Part 3: Deploy Frontend to DigitalOcean

### Method 1: DigitalOcean App Platform (Recommended)

1. **Create New App**
   - Go to DigitalOcean Dashboard
   - Click "Create" → "App Platform"
   - Connect your GitHub repository

2. **Configure App**
   - Type: Static Site
   - Source Directory: `/public`
   - Output Directory: `/`

3. **Deploy**
   - DigitalOcean will build and deploy
   - You'll get a URL like `https://your-app.ondigitalocean.app`

### Method 2: DigitalOcean Spaces (Static Hosting)

1. **Create Space**
   - Go to Spaces in DigitalOcean
   - Create new Space
   - Enable CDN

2. **Upload Files**
   ```bash
   # Install s3cmd or use DigitalOcean web interface
   cd public
   # Upload all files to your Space
   ```

3. **Configure**
   - Enable static website hosting
   - Set index.html as index document

## Part 4: Custom Domain (Optional)

### Backend Domain

1. **In Railway/Render/Heroku**
   - Go to domain settings
   - Add custom domain: `api.yourdomain.com`

2. **In Your DNS Provider**
   - Add CNAME record:
     - Name: `api`
     - Value: Your backend URL

### Frontend Domain

1. **In DigitalOcean**
   - Go to domain settings
   - Add custom domain: `yourdomain.com`

2. **In Your DNS Provider**
   - Add A record or CNAME as instructed by DigitalOcean

## Part 5: Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend loads correctly
- [ ] Admin panel login works
- [ ] Can create/edit/delete courses
- [ ] Lesson redirects work correctly
- [ ] Changed default admin password
- [ ] Tested on mobile devices
- [ ] Facebook group URLs are correct
- [ ] SSL/HTTPS is enabled (usually automatic)

## Security Checklist

- [ ] Strong admin password set
- [ ] `.env` file not committed to Git
- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS properly configured
- [ ] Regular backups of `data/courses.json`

## Backup Strategy

### Backup courses.json

**Option 1: Manual**
```bash
# Download from server
scp user@server:/path/to/data/courses.json ./backup/courses-$(date +%Y%m%d).json
```

**Option 2: Automated**
Set up a cron job or GitHub Actions to backup `data/courses.json` regularly

### Restore from Backup
```bash
# Upload to server
scp ./backup/courses-YYYYMMDD.json user@server:/path/to/data/courses.json
```

## Monitoring

### Check Backend Health
```bash
curl https://your-backend.railway.app/api/courses
```

Should return JSON with courses.

### Check Frontend
Visit your frontend URL and verify all sections load.

## Troubleshooting

### Backend Issues

**Problem**: Server won't start
- Check logs in your hosting platform
- Verify environment variables are set
- Ensure Node.js version is compatible (14+)

**Problem**: CORS errors
- Verify backend URL in frontend files
- Check CORS configuration in `server.js`

### Frontend Issues

**Problem**: Can't fetch courses
- Check ROOT variable in HTML files
- Verify backend is running
- Check browser console for errors

**Problem**: Admin login fails
- Verify ADMIN_PASSWORD in backend .env
- Check backend logs

### Data Issues

**Problem**: Courses not saving
- Check file permissions on `data/` directory
- Verify backend has write access
- Check backend logs for errors

## Cost Estimates

### Free Tier Options

- **Backend**: Railway (free tier), Render (free tier), or Heroku eco dynos
- **Frontend**: DigitalOcean App Platform (free static site tier) or Spaces ($5/month)
- **Domain**: ~$10-15/year (optional)

### Paid Options

- **Backend**: Railway ($5+/month), Render ($7+/month)
- **Frontend**: DigitalOcean App Platform ($5/month)
- **Total**: ~$10-15/month for full control

## Scaling Later

When you're ready to scale:

1. **Database**: Migrate from JSON to MongoDB/PostgreSQL
2. **Authentication**: Implement JWT or session-based auth
3. **Video Hosting**: Move to self-hosted solution (Vimeo, S3, etc.)
4. **CDN**: Add Cloudflare for better performance
5. **Analytics**: Add Google Analytics or Plausible
6. **Email**: Add email notifications (SendGrid, Mailgun)

## Support

For issues, check:
1. Backend logs in your hosting platform
2. Browser console for frontend errors
3. README.md for general setup
4. Open an issue in the repository

---

**Good luck with your deployment! 🌙**
