import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', formData);
      localStorage.setItem('token', response.data.access_token);
      alert('Login successful!');
      // navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-blue-700 text-white flex items-center px-8 py-6 shadow-md">
        <img src="/tipLogo.png" alt="TIP Logo" className="h-14 w-14 mr-6 drop-shadow-lg" />
        <div>
          <h1 className="font-extrabold text-3xl md:text-4xl tracking-tight drop-shadow">Academic Research Unit</h1>
          <p className="text-base md:text-lg text-blue-100">Technological Institute of the Philippines</p>
        </div>
      </header>
      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row items-center justify-center">
        {/* Login Form */}
        <div className="flex flex-1 flex-col justify-center items-center py-16">
          <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-10 border border-gray-200 backdrop-blur-md">
            <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-800">Log In</h2>
            {error && <p className="p-3 mb-5 text-base text-red-700 bg-red-100 rounded-lg border border-red-200">{error}</p>}
            <input
              type="email"
              placeholder="Enter email"
              required
              className="w-full mb-5 p-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full mb-6 p-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
            <button type="submit" className="w-full py-3 text-white font-bold bg-gradient-to-r from-blue-700 to-purple-700 rounded-lg hover:from-blue-800 hover:to-purple-800 shadow-lg transition mb-3">
              Login
            </button>
            <div className="text-center text-base mt-3">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-700 font-semibold hover:underline">Sign Up</Link>
            </div>
          </form>
        </div>
        {/* Quote/Visual Side */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-gray-50 relative">
          <div className="max-w-lg mx-auto px-8">
            <p className="text-2xl md:text-3xl font-serif mt-8 mb-4 text-gray-800">
              Research is formalized <span className="text-yellow-700 font-semibold">curiosity</span>. It is poking and prying with a <span className="text-yellow-700 font-semibold">purpose</span>.
            </p>
            <p className="text-right text-gray-700 italic">-Zora Neale Hurston</p>
            <img src="/hero.png" alt="Desk" className="mt-8 rounded-lg shadow-lg" />
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-yellow-800 text-white py-3 px-8 flex justify-end text-sm">
        <a href="#" className="mr-6 hover:underline">Terms and Conditions</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
      </footer>
    </div>
  );
}