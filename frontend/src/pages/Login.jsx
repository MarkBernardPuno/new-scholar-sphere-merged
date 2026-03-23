import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', formData);
      
      // Save the token to local storage so the browser "remembers" the user
      localStorage.setItem('token', response.data.access_token);
      
      alert('Login successful!');
      // navigate('/dashboard'); // We'll build the dashboard next!
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <p className="mb-6 text-sm text-center text-gray-600">Access TIP ScholarSphere</p>
        
        {error && <p className="p-2 mb-4 text-sm text-red-600 bg-red-100 rounded">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" placeholder="Email" required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;