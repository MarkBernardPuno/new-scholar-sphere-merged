# Frontend API Integration

## ✅ Changes Made

The frontend has been updated to connect to your **real Scholar Sphere backend API** with **no hardcoded data**.

### 🔧 Updated Features

1. **Dynamic Dropdowns**: Department, College, and Campus dropdowns **only** fetch data from your API
2. **Real Authentication**: Login and signup use JWT authentication via your API
3. **Loading States**: Users see loading indicators while data is being fetched
4. **Backend Dependency**: Form is completely disabled if backend is unavailable
5. **Non-clickable Headers**: Headers are display-only as requested

### 📁 New Files Created

- `src/services/api.js` - API service functions
- `src/config/config.js` - Configuration file for API settings

### 🌐 API Configuration

The frontend is configured to connect to: `https://firmamental-unicameral-kane.ngrok-free.dev`

**To change the API URL**, edit `src/config/config.js`:

```javascript
export const config = {
  API_BASE_URL: 'https://firmamental-unicameral-kane.ngrok-free.dev', // ← Change this
  // ...
};
```

### 📋 API Endpoints Used

| Purpose | Method | Endpoint |
|---------|--------|----------|
| Login | POST | `/auth/login` |
| Sign Up | POST | `/auth/signup` |
| Get Current User | GET | `/auth/me` |
| Get Departments | GET | `/lookups/departments` |
| Get Colleges | GET | `/lookups/colleges` |
| Get Campuses | GET | `/lookups/campuses` |

### 🔄 Form Fields

The signup form now uses the correct field structure for your API:

```javascript
{
  "full_name": "John Doe",
  "email": "john@example.com", 
  "password": "password123",
  "department_name": "Computer Science",
  "college_name": "College of Engineering",
  "campus_name": "Main Campus"
}
```

### 🚀 Testing the Integration

1. **Backend should be running** at: `https://firmamental-unicameral-kane.ngrok-free.dev`
2. **Start the Frontend**:
   ```bash
   npm run dev
   ```
3. **Test the Features**:
   - Visit signup page - dropdowns should load from API
   - Try registering a new user
   - Try logging in with existing credentials
   - Verify headers are non-clickable

### 🔄 Data Flow

1. **Page Load**: Dropdowns fetch data from `/lookups/*` endpoints
2. **Registration**: User data sent to `/auth/signup`
3. **Login**: Credentials sent to `/auth/login`, JWT token stored
4. **Protected Pages**: Token automatically included in API requests

### 🛡️ Authentication

- JWT tokens are stored in `localStorage` as `authToken`
- User data is stored in `localStorage` as `user`
- All API requests automatically include the `Authorization: Bearer <token>` header
- Login request uses `email` field (not `username`)

### ⚠️ Backend Dependency

**IMPORTANT**: The frontend has **NO hardcoded fallback data**. If the backend API is not running:

- ❌ Dropdowns will be empty with "No [items] available" messages
- ❌ Sign Up button will be disabled showing "Backend Required"
- ❌ Registration and login will fail with connection errors
- ✅ Clear error messages guide users to check backend connection

### 🔧 Troubleshooting

If dropdowns are empty or login fails:

1. ✅ **Check backend is running**: `https://firmamental-unicameral-kane.ngrok-free.dev`
2. ✅ **Test API directly**: Visit `https://firmamental-unicameral-kane.ngrok-free.dev/docs`
3. ✅ **Check browser console**: Look for CORS or network errors
4. ✅ **Verify authentication**: Ensure JWT tokens are being set properly

---

## 📞 Need Help?

If you need to modify the API integration:
1. Update endpoints in `src/config/config.js`
2. Modify request/response handling in `src/services/api.js`  
3. Update UI components in `src/components/Login.jsx`