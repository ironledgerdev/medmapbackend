## MedMap Admin Dashboard - Deployment Guide

This document provides instructions for deploying and configuring the MedMap Admin Dashboard.

## Prerequisites

1. **Supabase Project Access**
   - Access to the MedMap Supabase project (irvwoushpskgonjwwmap)
   - Service role key for admin operations

2. **Node.js Environment**
   - Node.js 20.x or higher
   - npm or compatible package manager

## Environment Setup

### Required Environment Variables

Create a `.env` file or configure these in your hosting platform:

```bash
# Supabase Configuration
SUPABASE_URL=https://irvwoushpskgonjwwmap.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Admin API Security (Production)
ADMIN_API_KEY=generate_a_secure_random_key_here

# Node Environment
NODE_ENV=production
PORT=5000
```

### Generating Secure API Key

For production, generate a secure API key:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

## Database Configuration

### Verify Supabase Tables

Ensure your Supabase database has the following tables:

1. **doctors** table
   - Required columns: id, name, email, specialty, province, city, price, experience, languages, status, rating, review_count, bio, qualifications, created_at, updated_at

2. **appointments** table
   - Required columns: id, patient_id, doctor_id, appointment_date, appointment_time, status, notes, created_at, updated_at
   - Optional: Relations to patients and doctors tables

3. **patients** table
   - Required columns: id, name, email, phone, province, membership_type, created_at

### Row Level Security (RLS)

The admin backend uses the service role key, which bypasses RLS. However, for additional security:

1. Keep RLS enabled on all tables
2. Create specific policies for service role if needed
3. Audit service role usage regularly

## Installation

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install

# Build frontend (if deploying separately)
npm run build
```

### 2. Database Schema Verification

If your Supabase table names differ, update `server/storage.ts`:

```typescript
// Example: If your table is named 'medical_professionals' instead of 'doctors'
const { data, error } = await supabase
  .from('medical_professionals') // Update table name here
  .select('*');
```

### 3. Test Database Connection

```bash
# Run in development mode to test
npm run dev

# Check logs for connection errors
# Visit http://localhost:5000 to test the dashboard
```

## Deployment Options

### Option 1: Replit Deployment

1. **Push to Replit**
   - The project is already configured for Replit
   - Set environment secrets in Replit Secrets panel
   - Deploy using Replit's deployment features

2. **Configure Secrets**
   - Go to Tools → Secrets
   - Add all required environment variables
   - Restart the deployment

### Option 2: Vercel/Netlify

1. **Build Configuration**
   ```json
   {
     "buildCommand": "npm install && npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install"
   }
   ```

2. **Environment Variables**
   - Add all environment variables in the hosting platform dashboard
   - Ensure `NODE_ENV=production`

### Option 3: Traditional VPS/Server

1. **Server Setup**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Clone repository
   git clone <your-repo-url>
   cd medmap-admin

   # Install dependencies
   npm install

   # Start with PM2 (process manager)
   npm install -g pm2
   pm2 start server/index.ts --name medmap-admin
   pm2 save
   pm2 startup
   ```

2. **Nginx Configuration** (optional reverse proxy)
   ```nginx
   server {
       listen 80;
       server_name admin.medmap.co.za;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Security Considerations

### 1. API Key Management

- **Never commit API keys to version control**
- Rotate API keys regularly
- Use different keys for development and production
- Store keys in secure secret management systems

### 2. Access Control

- Deploy admin dashboard on a separate subdomain (e.g., admin.medmap.co.za)
- Use HTTPS only (enforce SSL/TLS)
- Consider adding IP whitelist for additional security
- Implement session timeouts

### 3. CORS Configuration

Update `server/index.ts` to allow only trusted origins:

```typescript
import cors from 'cors';

app.use(cors({
  origin: ['https://medmap.co.za', 'https://admin.medmap.co.za'],
  credentials: true
}));
```

### 4. Rate Limiting

The project includes express-rate-limit. Configure in `server/index.ts`:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Monitoring and Maintenance

### Logging

- Monitor server logs for errors
- Track API usage patterns
- Set up alerts for failed authentications

### Database Monitoring

- Monitor Supabase dashboard for query performance
- Track connection pool usage
- Set up alerts for slow queries

### Regular Tasks

1. **Weekly**
   - Review access logs
   - Check for suspicious activity
   - Verify backup integrity

2. **Monthly**
   - Rotate API keys
   - Update dependencies: `npm audit fix`
   - Review and archive old logs

3. **Quarterly**
   - Security audit
   - Performance optimization
   - Dependency updates

## Troubleshooting

### Database Connection Issues

```bash
# Test Supabase connection
curl -H "apikey: YOUR_SUPABASE_KEY" \
     "https://irvwoushpskgonjwwmap.supabase.co/rest/v1/doctors?select=*&limit=1"
```

### Common Errors

1. **"Could not find table" error**
   - Verify table names in Supabase match `server/storage.ts`
   - Check RLS policies don't block service role

2. **Authentication failures**
   - Verify ADMIN_API_KEY is set correctly
   - Ensure client sends correct header: `x-api-key`

3. **CORS errors**
   - Update CORS configuration to include your domain
   - Check that requests include proper headers

## Support

For issues specific to MedMap:
- Check Supabase dashboard for database errors
- Review server logs for detailed error messages
- Verify all environment variables are set correctly

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
