// API Configuration and Service Functions
import { config } from '../config/config.js';

const API_BASE_URL = config.API_BASE_URL;

// API utility function for making requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config_headers = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authorization header if token exists
  const token = localStorage.getItem(config.tokenKey);
  if (token) {
    config_headers.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config_headers);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const response = await apiRequest(config.endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify({
        email: email,    // Changed from 'username' to 'email'
        password,
      }),
    });
    return response;
  },

  signup: async (userData) => {    // Changed from 'register' to 'signup'
    const response = await apiRequest(config.endpoints.auth.signup, {
      method: 'POST', 
      body: JSON.stringify(userData),
    });
    return response;
  },

  getCurrentUser: async () => {
    const response = await apiRequest(config.endpoints.auth.me);
    return response;
  },
};

// Lookup/Dropdown APIs
export const lookupAPI = {
  getCampuses: async () => {
    const response = await apiRequest(config.endpoints.lookups.campuses);
    return response;
  },

  getDepartments: async () => {
    const response = await apiRequest(config.endpoints.lookups.departments);
    return response;
  },

  getDepartmentsByCollege: async (collegeId) => {
    const response = await apiRequest(`${config.endpoints.lookups.departments}?college_id=${collegeId}`);
    return response;
  },

  getColleges: async () => {    // Changed from 'getRoles' to 'getColleges'
    const response = await apiRequest(config.endpoints.lookups.colleges);
    return response;
  },

  getSchoolYears: async () => {
    const response = await apiRequest(config.endpoints.lookups.schoolYears);
    return response;
  },

  getSemesters: async () => {
    const response = await apiRequest(config.endpoints.lookups.semesters);
    return response;
  },
};

// User API
export const userAPI = {
  getCurrentUser: async () => {
    const response = await apiRequest(config.endpoints.users.me);
    return response;
  },

  getAllUsers: async () => {
    const response = await apiRequest(config.endpoints.users.all);
    return response;
  },
};

export default {
  authAPI,
  lookupAPI,
  userAPI,
};