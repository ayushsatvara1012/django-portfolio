# Django Portfolio Deployment Guide

## Quick Deploy to Railway (Recommended)

### Step 1: Push your code to GitHub
```bash
cd /Users/ayushsatvara/CodeWorld/AI-Projects/django-site
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy to Railway
1. Go to https://railway.app/
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `django-portfolio` repository
5. Railway will auto-detect Django and deploy

### Step 3: Add Environment Variables in Railway
In Railway dashboard → Variables tab, add:
```
DJANGO_SECRET_KEY=your-secret-key-here-generate-new-one
DEBUG=False
ALLOWED_HOSTS=.railway.app,.yourdomain.com
```

### Step 4: Connect Your GoDaddy Domain

#### In Railway:
1. Go to Settings → Domains
2. Click "Custom Domain"
3. Add your domain (e.g., `yourdomain.com`)
4. Railway will show you DNS records to add

#### In GoDaddy:
1. Log into GoDaddy
2. Go to "My Products" → Your domain → DNS
3. Add the DNS records Railway provided:
   - **A Record**: Point `@` to Railway's IP
   - **CNAME**: Point `www` to your Railway domain
4. Wait 10-60 minutes for DNS propagation

---

## Alternative: Deploy to Render

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy to Render
1. Go to https://render.com/
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your `django-portfolio` repo
5. Fill in:
   - **Name**: django-portfolio
   - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - **Start Command**: `gunicorn mysite.wsgi:application`

### Step 3: Add Environment Variables
```
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=False
PYTHON_VERSION=3.12.8
```

### Step 4: Connect Domain (same GoDaddy steps as Railway)

---

## Alternative: PythonAnywhere (Easiest)

### Step 1: Sign up
1. Go to https://www.pythonanywhere.com/
2. Create free account

### Step 2: Upload Code
```bash
# On PythonAnywhere Bash console:
git clone https://github.com/ayushsatvara1012/django-portfolio.git
cd django-portfolio
```

### Step 3: Set up Virtual Environment
```bash
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py collectstatic
```

### Step 4: Configure Web App
1. Go to "Web" tab
2. Add new web app → Manual configuration → Python 3.12
3. Set paths in configuration:
   - **Source code**: `/home/yourusername/django-portfolio`
   - **WSGI file**: Edit to point to your project

### Step 5: Connect GoDaddy Domain
PythonAnywhere free tier doesn't support custom domains. Upgrade to paid ($5/month) for custom domain support.

---

## Generate Secret Key
Run this in your terminal to generate a new secret key:
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

---

## Recommended: Railway or Render
- **Railway**: Easiest, free tier, auto-deploys from GitHub
- **Render**: Similar to Railway, very reliable
- **PythonAnywhere**: Good for beginners but needs paid plan for custom domains

## After Deployment:
1. Update `ALLOWED_HOSTS` with your actual domain
2. Set `DEBUG=False` in production
3. Use environment variables for secrets
4. Enable HTTPS (most platforms do this automatically)

## Need Help?
Let me know which platform you choose and I can guide you through the specific steps!
