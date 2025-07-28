// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  // State variables for form fields and messages.
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const navigate = useNavigate();

  // Handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        { name, email, password },
        { withCredentials: true }
      );      
      // Optionally display a success message before redirecting.
      setSuccess('Registration successful! Please log in.');
      // Redirect to login page after a short delay.
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pearl via-sage to-paynes-gray flex flex-col items-center justify-start p-4">
      <div className="container mx-auto max-w-md p-4 mt-8">
        <h2 className="text-2xl font-bold mb-4 text-paynes-gray">Register</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {success && <div className="text-green-600 mb-4">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field */}
          <div>
            <label htmlFor="name-input" className="block mb-1 text-paynes-gray">Name:</label>
            <input 
              id="name-input"
              type="text"
              className="w-full p-2 border border-columbia-blue rounded"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          {/* Email field */}
          <div>
            <label htmlFor="email-input" className="block mb-1 text-paynes-gray">Email:</label>
            <input 
              id="email-input"
              type="email"
              className="w-full p-2 border border-columbia-blue rounded"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          {/* Password field */}
          <div>
            <label htmlFor="password-input" className="block mb-1 text-paynes-gray">Password:</label>
            <input 
              id="password-input"
              type="password"
              className="w-full p-2 border border-columbia-blue rounded"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-vista-blue text-white rounded shadow hover:bg-vista-blue-dark"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
