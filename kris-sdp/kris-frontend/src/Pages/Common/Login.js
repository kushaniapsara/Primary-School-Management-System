import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [userType, setUserType] = useState('Teacher');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // React Router hook for navigation

  const handleLogin = async () => {
    try {
      console.log('Sending login request:', { username, password, role: userType });

      const response = await axios.post('http://localhost:5001/api/auth/login', {
        username,
        password,
        role: userType,
      });

      // On successful login, redirect based on role
      if (response.status === 200) {
        setMessage(response.data.message);
        if (userType === 'Teacher') {
          navigate('/TeacherDashboard'); // Redirect to Teacher Dashboard
        } else if (userType === 'Student') {
          navigate('/ParentDashboard'); // Redirect to Student Dashboard
        }
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
        <div className="w-full md:w-1/2">
          <img src="/assets/a.jpeg" alt="Kids with Globe" className="w-full rounded-lg" />
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="mb-6 text-gray-700 text-2xl font-semibold">Login</h1>
          <div className="flex mb-6">
            <button
              className={`flex-1 p-3 border-none cursor-pointer ${
                userType === 'Teacher' ? 'bg-blue-500 text-white font-semibold' : 'bg-gray-300 text-gray-700'
              }`}
              onClick={() => setUserType('Teacher')}
            >
              Teacher
            </button>
            <button
              className={`flex-1 p-3 border-none cursor-pointer ${
                userType === 'Student' ? 'bg-blue-500 text-white font-semibold' : 'bg-gray-300 text-gray-700'
              }`}
              onClick={() => setUserType('Student')}
            >
              Parent
            </button>
          </div>
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
          <div className="text-right mb-4">
            <a href="#" className="text-blue-500 text-sm">
              Forgot password?
            </a>
          </div>
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

export default Login;
