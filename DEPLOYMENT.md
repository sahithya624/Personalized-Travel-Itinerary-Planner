# Deployment Guide

## 🚀 Production Deployment

This guide covers deploying the Travel Itinerary Planner to production using Render (backend) and Vercel (frontend).

## Prerequisites

- GitHub account with repository pushed
- Supabase account with project set up
- Render account (render.com)
- Vercel account (vercel.com)
- Groq API key (for AI generation)

---

## 1. Database Setup (Supabase)

### Create Supabase Project

1. Go to https://supabase.com and sign up
2. Create a new project
3. Wait for project initialization
4. Go to SQL Editor
5. Create new query and paste contents of `database/schema.sql`
6. Execute the query

### Get Credentials

1. Go to Project Settings → API
2. Copy public URL (SUPABASE_URL)
3. Copy anon public key (SUPABASE_KEY)
4. Copy service role key (SUPABASE_SERVICE_ROLE_KEY)

---

## 2. Backend Deployment (Render)

### Build & Deploy

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/travel-planner.git
git push -u origin main
```

2. Go to https://render.com
3. Sign up and connect GitHub account
4. Click "New +" → "Web Service"
5. Select your repository
6. Configure as follows:
   - **Name**: travel-planner-api
   - **Environment**: Python 3.11
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`

### Environment Variables (Render)

Add these in the Render dashboard:

```
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

SECRET_KEY=your-very-secure-random-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

AI_PROVIDER=groq
GROQ_API_KEY=<your-groq-api-key>

DEBUG=False
ENVIRONMENT=production
BACKEND_URL=https://travel-planner-api.onrender.com
FRONTEND_URL=https://your-vercel-domain.vercel.app

LOG_LEVEL=INFO
```

### Verify Backend

Once deployed, test the API:
```bash
curl https://travel-planner-api.onrender.com/health
```

---

## 3. Frontend Deployment (Vercel)

### Connect to Vercel

1. Go to https://vercel.com
2. Sign up and connect GitHub
3. Click "Add New +" → "Project"
4. Select your repository
5. Configure:
   - **Framework**: React
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
   - **Root Directory**: `frontend`

### Environment Variables (Vercel)

Add these in Vercel Project Settings:

```
VITE_API_URL=https://travel-planner-api.onrender.com
```

### Deploy

- Vercel will auto-deploy on push to main branch
- Check deployment status in Vercel dashboard

### Custom Domain

1. In Vercel, go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## 4. Post-Deployment Checklist

- [ ] Backend health check returns 200
- [ ] Frontend loads without errors
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can create trip
- [ ] Can generate itinerary
- [ ] Error handling works
- [ ] API CORS is configured
- [ ] Environment variables are set
- [ ] Database connections are working
- [ ] Groq/LLM API key is valid
- [ ] HTTPS is enabled

---

## 5. Monitoring & Logs

### Backend Logs (Render)
- View in Render dashboard under "Logs"
- Monitor errors and performance

### Frontend Monitoring (Vercel)
- View analytics in Vercel dashboard
- Check build logs for issues

### Database (Supabase)
- Monitor in Supabase dashboard
- Check Row Level Security policies
- Review query performance

---

## 6. Scaling Considerations

### Backend Scaling
- Render auto-scales based on traffic
- Upgrade plan for higher concurrency
- Consider caching for itinerary generation

### Frontend Optimization
- Vercel handles CDN distribution
- Optimize images and bundle size
- Use code splitting for lazy loading

### Database Scaling
- Upgrade Supabase plan as needed
- Add database indexes for performance
- Archive old itineraries for cleanup

---

## 7. Disaster Recovery

### Backup Strategy
1. Supabase auto-backups (daily)
2. Export data regularly to S3
3. Keep environment variables secure

### Rollback Procedure
1. **Vercel**: Select previous deployment and promote
2. **Render**: Select previous build and deploy
3. **Database**: Restore from Supabase backup

---

## 8. Cost Optimization

### Free Tier Limits
- **Render**: 750 hours/month free
- **Vercel**: Unlimited free deployments
- **Supabase**: 500MB database, 2GB bandwidth
- **Groq**: Free tier available with rate limits

### Cost Management
- Monitor usage in each service's dashboard
- Set billing alerts
- Archive old trips to save storage
- Use caching to reduce API calls

---

## 9. Security in Production

### Recommendations
1. Enable HTTPS (automatic with Vercel/Render)
2. Use strong JWT secret
3. Enable CORS properly
4. Validate all inputs
5. Use environment variables for secrets
6. Implement rate limiting
7. Enable database backups
8. Monitor for unauthorized access
9. Use API keys securely
10. Update dependencies regularly

### Security Checklist
- [ ] Remove debug mode
- [ ] Use strong SECRET_KEY
- [ ] CORS configured correctly
- [ ] No API keys in code
- [ ] HTTPS enabled
- [ ] Database RLS enabled
- [ ] Regular backups enabled
- [ ] Logging configured
- [ ] Error monitoring set up

---

## 10. Troubleshooting

### Backend Issues

**Problem**: Deployment fails
```bash
# Check build logs in Render
# Verify requirements.txt is valid
pip install -r requirements.txt
```

**Problem**: Environment variables not loaded
- Verify all variables are set in Render dashboard
- Restart the service after adding variables

**Problem**: Database connection fails
- Verify SUPABASE_URL and SUPABASE_KEY
- Check Supabase network settings
- Ensure schema is created

### Frontend Issues

**Problem**: API calls fail
- Check VITE_API_URL is correct
- Verify backend is running
- Check CORS settings

**Problem**: Build fails
```bash
npm install
npm run build
```

**Problem**: Blank page on load
- Check browser console for errors
- Verify API URL is accessible
- Clear browser cache

---

## 11. Monitoring & Analytics

### Key Metrics to Monitor
- API response times
- Database query times
- Error rates
- User registration rate
- Itinerary generation success rate
- Frontend performance

### Useful Tools
- Sentry (error tracking)
- LogRocket (frontend monitoring)
- Better Stack (log management)
- Vercel Analytics (frontend metrics)

---

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

**Deployment is production-ready!** 🚀

For issues, check logs and error messages carefully. Most problems stem from:
1. Missing environment variables
2. Incorrect API keys
3. Database schema not initialized
4. API CORS misconfiguration
