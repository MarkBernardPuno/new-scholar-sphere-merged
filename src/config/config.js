// Configuration file for API settings
export const config = {
  API_BASE_URL: 'http://10.3.35.209:8000',
  
  // API endpoints
  endpoints: {
    auth: {
      login: '/auth/login',
      signup: '/auth/signup',  // Changed from 'register' to 'signup'
      me: '/auth/me',
    },
    lookups: {
      departments: '/lookups/departments',
      colleges: '/lookups/colleges',    // Changed from 'roles' to 'colleges'  
      campuses: '/lookups/campuses',
      schoolYears: '/lookups/school-years',
      semesters: '/lookups/semesters',
    },
    users: {
      me: '/auth/me',  // Updated to use auth/me
      all: '/users/',
    },
  },
  
  // Other settings
  tokenKey: 'authToken',
  userKey: 'user',
};