# IntelliHealth - Quick Start Guide

## Prerequisites
- Node.js >= 16.0.0
- MongoDB (local or cloud)
- npm >= 8.0.0

## Setup Instructions

### 1. Backend Setup

```powershell
# Navigate to backend
cd Backend

# Install dependencies
npm install

# Configure environment
# Copy .env.example to .env and update with your values
Copy-Item .env.example .env

# Start MongoDB (if running locally)
# Make sure MongoDB is running on mongodb://localhost:27017

# Seed database with sample data (optional)
npm run seed

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### 2. Frontend Setup

```powershell
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## Default Login Credentials

After seeding the database, you can use these credentials:

**Admin:**
- Email: admin@intellihealth.com
- Password: admin123

**Doctor:**
- Email: doctor@intellihealth.com
- Password: doctor123

**Patient:**
- Email: patient@intellihealth.com
- Password: patient123

**Lab:**
- Email: lab@intellihealth.com
- Password: lab123

## Important Environment Variables

### Backend (.env)
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `EMAIL_USER` - Email for sending notifications
- `EMAIL_PASS` - Email app password
- `CLOUDINARY_*` - Cloudinary credentials (for file uploads)

### Frontend (.env)
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:5000/api)

## Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run seed` - Seed database with sample data
- `npm run lint` - Run ESLint

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in Backend/.env
- For local MongoDB: `mongodb://localhost:27017/intellihealth`

### CORS Issues
- Verify `CLIENT_URL` in Backend/.env matches your frontend URL
- Default: `http://localhost:5173`

### Port Already in Use
- Backend: Change `PORT` in Backend/.env
- Frontend: Vite will automatically suggest another port

## Project Structure

```
IntelliHealth/
├── Backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── scripts/        # Utility scripts
│   └── server.js       # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context
│   │   ├── services/   # API services
│   │   └── App.jsx     # Main app
│   └── index.html
│
└── data/              # Sample data files
```

## Next Steps

1. Configure your `.env` files
2. Start MongoDB
3. Run backend server
4. Run frontend server
5. Open browser to `http://localhost:5173`
6. Login with default credentials

## Support

For issues or questions, check:
- Backend README: `Backend/README.md`
- Frontend README: `frontend/README.md`
- Admin Dashboard Guide: `frontend/README_ADMIN.md`
