# DebugMate Backend & Auto-Fix Setup

This directory contains the Node.js/Express backend for the DebugMate Auto-Fix feature.

## Prerequisites

- Node.js v18+
- PostgreSQL Database
- GitHub Account (for OAuth app)
- Google Gemini API Key

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3001
   DATABASE_URL=postgresql://user:password@localhost:5432/debugmate
   GEMINI_API_KEY=your_gemini_key
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_CALLBACK_URL=http://localhost:3001/api/auth/github/callback
   ```

3. **Database Setup**
   Run the schema migration:
   ```bash
   psql -U postgres -d debugmate -f database/schema.sql
   ```

4. **Run the Server**
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/ai/generate-fix`: Generates a code fix using Gemini.
- `POST /api/github/apply-fix`: Creates a branch and Pull Request with the fix.
- `POST /api/auth/login`: Authenticates the user (Stub).

## Frontend Integration

The frontend components are located in `src/components/autofix`.
To use the Auto-Fix button:

```tsx
import { AutoFixButton } from './components/autofix/AutoFixButton';

<AutoFixButton 
  errorId="err_123"
  errorMessage="TypeError: Cannot read property 'map' of undefined"
  codeContext="..."
  filePath="src/utils/data.ts"
/>
```
