# Environment Setup Guide

## Quick Start

### 1. Create .env File

```bash
# Copy the template
cp .env.example .env
```

### 2. Essential Configuration

Minimum required environment variables:

```env
# Application
NODE_ENV=development
APP_NAME=Energy Dashboard
APP_URL=http://localhost:3000

# Python Models
PYTHON_PATH=/usr/bin/python3
PYTHON_MODELS_DIR=./python_models
MODELS_TIMEOUT=300
ENABLE_ARIMA=true
ENABLE_LSTM=true
ENABLE_PROPHET=true
FORECAST_STEPS=14
```

## Data Storage

This project stores all data in memory and via CSV uploads. No database configuration is required. Your energy consumption data is processed directly from CSV files.

### Alternative: MongoDB

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/energy_dashboard
```

## Cloud Storage Setup

### AWS S3 (For storing CSV files)

```env
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_S3_BUCKET=energy-dashboard-bucket
```

**Steps:**
1. Create AWS account
2. Go to IAM → Users → Create user
3. Attach policy: `AmazonS3FullAccess`
4. Create access keys
5. Copy credentials to `.env`

### Vercel Blob Storage (Easiest)

```env
VERCEL_BLOB_READ_WRITE_TOKEN=your_blob_token
```

**Steps:**
1. Go to vercel.com
2. Project Settings → Storage
3. Create Blob storage
4. Copy token to `.env`

## Authentication Setup

### NextAuth

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generated-secret-key-32-chars-minimum
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d
```

**Generate secret:**
```bash
openssl rand -base64 32
```

### Google OAuth (Optional)

```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

**Steps:**
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs: `http://localhost:3000/auth/callback/google`
4. Copy credentials to `.env`

## Analytics Setup (Optional)

### PostHog (Product Analytics)

```env
POSTHOG_API_KEY=phc_your_api_key
POSTHOG_API_HOST=https://app.posthog.com
```

### Sentry (Error Tracking)

```env
SENTRY_DSN=https://your_key@sentry.io/your_project_id
```

### Google Analytics

```env
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## Email Setup (Optional)

### SendGrid

```env
SENDGRID_API_KEY=SG.your_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### Mailgun

```env
MAILGUN_API_KEY=key-your_api_key
MAILGUN_DOMAIN=mg.yourdomain.com
```

## Redis Cache Setup (Optional)

### Local Redis

```bash
# Install Redis
brew install redis

# Start Redis
redis-server

# Update .env
REDIS_URL=redis://localhost:6379
```

### Upstash Redis (Cloud)

```env
UPSTASH_REDIS_REST_URL=https://your-project.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
```

## Python Models Configuration

### Install Dependencies

```bash
cd python_models
pip install -r requirements.txt
```

### Test Models

```bash
# Test ARIMA
python3 arima_flexible.py

# Test LSTM
python3 lstm_flexible.py

# Test Prophet
python3 prophet_flexible.py
```

### Configure in .env

```env
PYTHON_PATH=/usr/bin/python3
PYTHON_MODELS_DIR=./python_models
MODELS_TIMEOUT=300
FORECAST_STEPS=14
CONFIDENCE_INTERVAL=0.95
```

## Verification Checklist

- [ ] Created `.env` file from `.env.example`
- [ ] Set `NODE_ENV=development` or `production`
- [ ] Configured database connection
- [ ] Set `NEXTAUTH_URL` and `NEXTAUTH_SECRET`
- [ ] Installed Python dependencies
- [ ] Tested Python models
- [ ] Set `PYTHON_PATH` correctly
- [ ] Tested application startup

## Running the Application

```bash
# Install Node dependencies
npm install

# Run development server
npm run dev

# Application will be available at http://localhost:3000
```

## Deployment to Vercel

1. Push code to GitHub
2. Go to vercel.com
3. Import project
4. Add environment variables from `.env`
5. Deploy

**Important:** Never commit `.env` to git. Use `.env.example` for reference only.

## Common Issues

### "Python command not found"
```bash
# Find Python path
which python3
# Update PYTHON_PATH in .env
```

### "Database connection failed"
- Check if database is running
- Verify connection string syntax
- Check credentials

### "Models timeout"
- Increase `MODELS_TIMEOUT` value
- Check if Python is installed correctly
- Verify CSV file isn't too large

### "AWS S3 access denied"
- Check AWS credentials are correct
- Verify IAM user has S3 permissions
- Ensure bucket exists in correct region

## Support

For issues:
1. Check `.env` values are set correctly
2. Review logs in console
3. Verify all dependencies installed
4. Test Python models independently
