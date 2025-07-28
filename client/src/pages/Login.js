// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '../security/AuthContext';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await login(email, password);
      if (result.success) {
        // Clear any error, navigate to dashboard
        setError('');
        navigate('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pearl via-sage to-paynes-gray flex flex-col items-center justify-start p-4">
      <div className="container mx-auto max-w-md p-4 mt-8">
        <h2 className="text-2xl font-bold mb-4 text-paynes-gray text-center">Login</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email-input" className="block mb-1 text-paynes-gray">Email:</label>
            <input 
              id="email-input"
              type="email"
              className="w-full p-2 border border-columbia-blue rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password-input" className="block mb-1 text-paynes-gray">Password:</label>
            <input 
              id="password-input"
              type="password"
              className="w-full p-2 border border-columbia-blue rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-vista-blue text-white rounded shadow hover:bg-vista-blue-dark"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
