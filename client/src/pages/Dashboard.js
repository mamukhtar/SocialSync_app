// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import CalendarView from '../components/CalendarView';
import AppLayout from '../components/AppLayout';
import { useAuthUser } from '../security/AuthContext';

const Dashboard = () => {
  const { isAuthenticated, loading } = useAuthUser();
  const [events, setEvents] = useState([]);

  // Always declare hooks before any return!
  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/events`, { withCredentials: true })
        .then((response) => setEvents(response.data))
        .catch((error) => console.error('Error fetching events:', error));
    }
  }, [isAuthenticated]);

  // Avoid returning early inside hook logic — render fallback instead
  if (loading) {
    return (
      <AppLayout>
        <div className="p-8 text-paynes-gray">Loading dashboard...</div>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <div>
        <h2 className="text-2xl font-bold mb-4 text-paynes-gray">Today's Overview</h2>
        <p className="mb-6 text-base text-paynes-gray">
          Welcome back! Here’s a quick glance at your upcoming events.
        </p>
        <CalendarView events={events} />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
