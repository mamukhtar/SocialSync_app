// src/components/AppLayout.js
import React from 'react';
import { Link } from 'react-router-dom';

const AppLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[250px_1fr]">
      {/* Sidebar */}
      <aside className="bg-sage p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-paynes-gray">SocialSync</h2>
          <p className="text-sm text-paynes-gray">Organize your social life</p>
        </div>
        <nav className="space-y-4">
          <Link to="/dashboard" className="block text-paynes-gray hover:text-vista-blue">Calendar</Link>
          <Link to="/events" className="block text-paynes-gray hover:text-vista-blue">Events</Link>
          <Link to="/tasks" className="block text-paynes-gray hover:text-vista-blue">Tasks</Link>
          <Link to="/profile" className="block text-paynes-gray hover:text-vista-blue">Profile</Link>
          <Link to="/how-to" className="block text-paynes-gray hover:text-vista-blue">Getting Started</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="p-6 bg-pearl">
        {/* Top Bar */}
        {title && (
          <div className="flex items-center justify-between border-b border-columbia-blue pb-2 mb-4">
            <h1 className="text-xl font-bold text-paynes-gray">{title}</h1>
          </div>
        )}

        {children}
      </main>
    </div>
  );
};

export default AppLayout;
