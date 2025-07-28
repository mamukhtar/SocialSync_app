// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthUser } from '../security/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuthUser();

  return (
    <div className="min-h-screen bg-gradient-to-r from-pearl via-sage to-paynes-gray flex flex-col items-center justify-start pt-32 md:pt-40 text-center">
     {/* Logo */}
      <img 
        src="/Logo.png" 
        alt="SocialSync Logo" 
        className="w-40 md:w-56 mb-6 mt-2"
      />

      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-paynes-gray">
        Welcome to SocialSync
      </h1>
      <p className="text-lg md:text-xl mb-8 text-paynes-gray">
        Manage your social events and tasks easily. Stay organized and never miss a special moment.
      </p>
      { !isAuthenticated ? (
        <div className="space-x-4">
          <Link 
            to="/login" 
            className="px-6 py-2 bg-vista-blue text-white rounded shadow hover:bg-vista-blue-dark"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="px-6 py-2 bg-columbia-blue text-paynes-gray rounded shadow hover:bg-columbia-blue-dark"
          >
            Register
          </Link>
        </div>
      ) : (
        <p className="text-lg text-paynes-gray">
          You're logged in. Go to your <Link to="/dashboard" className="text-vista-blue underline">Dashboard</Link>.
        </p>
      )}
    </div>
  );
};

export default Home;
