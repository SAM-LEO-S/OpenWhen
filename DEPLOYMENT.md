# Deploy Backend to Render (For Mobile App Access)

## 🚀 Quick Deployment Steps

### 1. **Create Render Account**
- Go to [render.com](https://render.com)
- Sign up with GitHub (free)

### 2. **Deploy Your Backend**
1. **Connect your GitHub repository** to Render
2. **Create a new Web Service**
3. **Select your repository** (`OpenWhenVerse`)
4. **Configure the service:**
   - **Name:** `openwhenverse-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Port:** `10000`

### 3. **Environment Variables**
Add these in Render dashboard:
- `NODE_ENV` = `production`
- `PORT` = `10000`

### 4. **Deploy**
- Click "Create Web Service"
- Wait for deployment (2-3 minutes)
- Get your URL: `https://your-app-name.onrender.com`

### 5. **Update Mobile App**
In `OpenWhenVerseMobile/api.ts`, change:
```typescript
const API_BASE_URL = 'https://your-app-name.onrender.com';
```

## 🔧 Alternative: Railway Deployment

If Render doesn't work, try [Railway](https://railway.app):

1. **Sign up** at railway.app
2. **Connect GitHub** repository
3. **Deploy** automatically
4. **Get URL** and update mobile app

## 📱 Test Your Mobile App

1. **Update API URL** in mobile app
2. **Start Expo:** `npx expo start`
3. **Share QR code** with your girlfriend
4. **She scans with Expo Go** - app works from anywhere!

## 🎯 What This Does

- **Deploys your backend** to the cloud
- **Makes API accessible** from anywhere
- **Mobile app connects** to cloud server
- **No WiFi restrictions** - works globally

## 💡 Tips

- **Free tier** on Render has some limitations but works for personal use
- **Custom domain** available if needed
- **Auto-deploys** when you push to GitHub
- **Logs available** in Render dashboard

## 🆘 Troubleshooting

- **If deployment fails:** Check build logs in Render
- **If API doesn't work:** Verify environment variables
- **If mobile app can't connect:** Check API URL is correct 