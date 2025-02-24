import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log('Sending login request:', { username, password, role: 'Admin' });

      const response = await axios.post('http://localhost:5001/api/admin/login', {
        username,
        password,
        role: 'Admin',
      });

      if (response.status === 200) {
        setMessage(response.data.message);
        navigate('/AdminDashboard'); // Redirect to Admin Dashboard
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
        <div className="w-full md:w-1/2">
          <img src="/assets/a.jpeg" alt="Admin Login" className="w-full rounded-lg" />
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="mb-6 text-gray-700 text-2xl font-semibold">Admin Login</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-green-500 text-white p-3 rounded-md cursor-pointer hover:bg-green-600"
          >
            Login
          </button>
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
