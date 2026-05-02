# TaskMaster Deployment Guide

Complete guide to deploy TaskMaster to Railway.

## 📋 Prerequisites

1. GitHub account with repository containing code
2. Railway account (free tier available)
3. MongoDB Atlas account (free tier available)
4. Git installed locally

## 🗄️ Step 1: Setup MongoDB Atlas

### Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login
3. Create a new project
4. Create a new cluster (M0 free tier)
5. Wait for cluster to be created

### Create Database User

1. Go to "Database Access"
2. Create database user:
   - Username: `taskmaster_user` (or your choice)
   - Password: Generate secure password
   - Role: Read and write to any database
3. Copy the password, you'll need it

### Get Connection String

1. Go to "Databases" → Your Cluster
2. Click "Connect"
3. Choose "Drivers"
4. Select Node.js driver
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `myFirstDatabase` with `task_manager`

Example:
```
mongodb+srv://taskmaster_user:YOUR_PASSWORD@cluster0.abc123.mongodb.net/task_manager
```

## 🚀 Step 2: Deploy Backend to Railway

### Push to GitHub

1. Create GitHub repository if not exist
2. Push code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/taskmaster.git
   git push -u origin main
   ```

### Deploy on Railway

1. Go to [Railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Create new project
4. Click "Add Service" → "GitHub Repo"
5. Select your repository
6. Railway will automatically detect the `railway.toml` configuration

### Configure Backend Environment Variables

1. In Railway dashboard, select the service
2. Go to "Variables"
3. Add environment variables (do NOT set PORT, Railway provides it automatically):
   ```
   MONGODB_URI=mongodb+srv://visheshyadav2408_db_user:EeXXmamJ9mZVwXEC@cluster0.iy7al6f.mongodb.net/Ethara_AI_Task_Manager?appName=Cluster0
   JWT_SECRET=3c5faae6a558ca6c7adbc04f8b5f088cd5ba7c0117b0fc1264a82a4d387b1e6413bb136c8136ccfbaec851be2ffdcbc8c78d5e09216c47e846a2609acea7e7f7
   JWT_EXPIRE=7d
   NODE_ENV=production
   CORS_ORIGIN=*
   ```

**Important Notes:**
- Do NOT set the `PORT` variable - Railway provides it automatically
- The `railway.toml` file handles the build and deployment configuration
- The app will listen on Railway's provided PORT

### Deploy

1. Railway automatically deploys on push to GitHub
2. Check deployment logs:
   - Go to "Deployments" tab
   - View logs to ensure no errors
3. Get your backend URL:
   - Go to "Settings"
   - Copy the public URL (e.g., `https://taskmaster-backend.railway.app`)

## 🎨 Step 3: Deploy Frontend to Railway

### Add Frontend Service

1. In same Railway project, click "Add Service" → "GitHub Repo"
2. Select your repository
3. Select `frontend` folder as root directory
4. Configure build and start commands:
   - Build: `npm install && npm run build`
   - Start: `npm run preview`

### Configure Frontend Service

1. Go to "Variables"
2. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```
   (Replace with actual backend URL from step 2)

### Deploy

1. Railway deploys automatically
2. Check "Deployments" logs
3. Get your frontend URL from "Settings"

## ✅ Step 4: Verify Deployment

### Test Backend

```bash
curl https://your-backend-url.railway.app/api/health
```

Response:
```json
{"status": "Server is running"}
```

### Test Frontend

1. Visit your frontend URL in browser
2. Try signup/login
3. Create a project
4. Create a task
5. Check all features work

## 🔄 Step 5: Update CORS (if needed)

If frontend and backend are now deployed:

1. Update backend CORS_ORIGIN:
   - In Railway, update backend variable `CORS_ORIGIN` to your frontend URL
   - Redeploy backend

## 📝 GitHub Push Workflow

After making changes:

```bash
# Make changes locally
git add .
git commit -m "Describe changes"
git push

# Railway automatically redeploys!
```

## � Troubleshooting

### Backend won't start

1. Check MongoDB URI is correct
2. Check all required env variables are set
3. View deployment logs for errors
4. Ensure MongoDB cluster is running

### Frontend blank page

1. Clear browser cache
2. Check VITE_API_URL is set correctly
3. Check backend URL is accessible
4. View browser console for errors

### API calls fail

1. Verify CORS_ORIGIN in backend matches frontend URL
2. Check backend is running
3. Check JWT_SECRET is set
4. View network tab in DevTools for error details

### Database connection error

1. Verify MongoDB URI is correct
2. Check database user password
3. Whitelist Railway IPs in MongoDB (usually 0.0.0.0/0 for simplicity)
4. Ensure database user has correct permissions

## 🔐 Security Checklist

Before going live:

- [ ] Change JWT_SECRET to strong random string
- [ ] Use HTTPS (Railway provides this)
- [ ] Enable MongoDB IP whitelist (or use 0.0.0.0/0)
- [ ] Use strong database password
- [ ] Set NODE_ENV=production
- [ ] CORS_ORIGIN set to correct frontend URL
- [ ] Hide sensitive information in environment variables
- [ ] No API keys or secrets in code

## 📊 Monitoring

### View Logs

In Railway:
1. Select service
2. Go to "Logs" tab
3. Tail logs in real-time

### Restart Service

1. Go to service settings
2. Click "Restart" button

### View Metrics

1. Go to service "Metrics" tab
2. Monitor CPU, memory, network

## 💾 Database Backups

### MongoDB Atlas Backups

1. Go to Atlas Dashboard
2. Select cluster
3. Go to "Backup" tab
4. Backups are automatic (free tier: 7 days)

### Manual Export

```bash
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/task_manager"
```

## 📈 Scaling (Future)

When you outgrow free tier:

1. **Backend:** Upgrade Railway plan
2. **Database:** Upgrade MongoDB cluster (M1, M2, etc.)
3. **Frontend:** Can stay on free tier

## 🎉 You're Live!

Your application is now deployed and accessible to the world!

### Share Your Links

- **Frontend:** `https://your-frontend-url.railway.app`
- **Backend:** `https://your-backend-url.railway.app`
- **GitHub:** `https://github.com/YOUR_USERNAME/taskmaster`

### Next Steps

1. Share the link
2. Collect user feedback
3. Deploy updates with `git push`
4. Monitor logs for issues

## 📞 Support

- Railway Docs: https://docs.railway.app
- MongoDB Atlas Help: https://docs.atlas.mongodb.com
- Express.js: https://expressjs.com
- React: https://react.dev

---

**Happy Deploying! 🚀**
