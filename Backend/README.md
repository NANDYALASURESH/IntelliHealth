Role	Email	Password
Admin	
admin@intellihealth.com
Admin123!
Doctor	
doctor@intellihealth.com
Doctor123!
Patient	
patient@intellihealth.com
Patient123!
Lab	
lab@intellihealth.com
Lab123!
s

## IntelliHealth Backend

Express + MongoDB (Mongoose) API with JWT auth, role-based access, email, file uploads, and Socket.IO notifications.

### Prerequisites
- Node.js >= 16, npm >= 8
- MongoDB running locally or in the cloud

### Setup
1. Copy environment template and fill values:
   - Windows PowerShell:
     ```powershell
     Copy-Item .env.example .env
     ```
2. Install dependencies:
   - PowerShell uses semicolons for chaining:
     ```powershell
     npm install
     ```
3. Start server:
   ```powershell
   npm run dev
   ```

Server runs on `http://localhost:5000`. Health check: `GET /health`.

### Environment Variables
See `.env.example` for all variables including `MONGODB_URI`, `JWT_SECRET`, `EMAIL_*`, and `CLOUDINARY_*`.

### Scripts
- `npm run seed` – seed sample data
- `npm run migrate` – run simple migrations
- `npm test` – run Jest tests

### File Uploads
POST `/api/upload` with `multipart/form-data` field `file`. Requires Cloudinary env vars. If not set, route will still accept but upload will fail with 500.

