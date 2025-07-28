// src/components/PublicHeader.js
import React from 'react';
import { Link } from 'react-router-dom';

const PublicHeader = () => {
  return (
    <header className="bg-gradient-to-r from-pearl via-sage to-paynes-gray p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-paynes-gray">
          SocialSync
        </Link>

        <div className="flex items-center gap-6 font-medium">
          <Link
            to="/how-to"
            className="text-sage hover:text-c4b55a transition" // Tailwind custom class mapping
          >
            Getting Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
