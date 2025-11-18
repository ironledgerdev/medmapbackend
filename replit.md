# MedMap Admin Dashboard

## Overview
This is a separate administrative backend and dashboard for managing the MedMap platform (medmap.co.za). It provides a secure interface for managing doctors, patients, appointments, and viewing analytics.

## Purpose
- **Admin Management**: Approve/reject doctor verifications, manage patient accounts
- **Appointment Oversight**: View and manage all platform appointments
- **Analytics**: Track platform metrics and performance
- **Live Integration**: Connects directly to the production Supabase database (irvwoushpskgonjwwmap)

## Architecture
- **Frontend**: React + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Express.js + Node.js
- **Database**: Supabase PostgreSQL (shared with main platform)
- **Authentication**: API key-based authentication for admin access

## Key Features
- 📊 Real-time dashboard with platform statistics
- 👨‍⚕️ Doctor management (view, approve, reject, search, filter)
- 📅 Appointment management (view, filter by status/date)
- 🔍 Advanced search and filtering capabilities
- 🌓 Dark mode support
- 🔒 Secure API endpoints with authentication

## Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components (Dashboard, Doctors, Appointments)
│   │   └── lib/           # Utilities and helpers
├── server/                 # Backend Express server
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database access layer (Supabase)
│   ├── supabase.ts        # Supabase client configuration
│   └── middleware/        # Authentication middleware
├── shared/                 # Shared types between frontend/backend
│   └── schema.ts          # TypeScript interfaces and validation schemas
```

## Environment Variables
Required secrets (stored in Replit Secrets):
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for admin operations)
- `ADMIN_API_KEY`: (Production only) API key for securing admin endpoints

## API Endpoints

### Dashboard
- `GET /api/stats` - Get platform statistics

### Doctors
- `GET /api/doctors` - List all doctors (with filters: status, province, specialty, search)
- `GET /api/doctors/:id` - Get doctor by ID
- `PATCH /api/doctors/:id/status` - Update doctor verification status

### Appointments
- `GET /api/appointments` - List all appointments (with filters: status, date, search)
- `GET /api/appointments/:id` - Get appointment by ID
- `PATCH /api/appointments/:id/status` - Update appointment status

### Patients
- `GET /api/patients` - List all patients (with search)
- `GET /api/patients/:id` - Get patient by ID

## Database Schema Notes
The application expects the following Supabase tables:
- `doctors` - Doctor profiles and verification status
- `appointments` - Booking appointments
- `patients` - Patient accounts

Note: If table names differ in your Supabase database, update `server/storage.ts` accordingly.

## Development
- Authentication is disabled in development mode for easier testing
- All API routes are prefixed with `/api`
- Hot module reloading enabled for frontend
- Backend auto-restarts on file changes

## Security
- API key authentication in production
- CORS configured for live website communication
- Service role key used for admin operations
- Rate limiting and helmet security headers applied

## Deployment Notes
This admin panel is separate from the main medmap.co.za website and should be deployed on a different domain/subdomain for security isolation.

## Recent Changes
- 2025-11-18: Initial admin dashboard setup
- Connected to Supabase database
- Implemented doctor management with approval workflow
- Added appointment viewing and filtering
- Created dashboard analytics
