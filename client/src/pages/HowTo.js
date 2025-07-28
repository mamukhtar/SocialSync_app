// src/pages/HowTo.js
import React from 'react';

const HowTo = () => {
  return (
    <div className="text-paynes-gray space-y-6">
      <h1 className="text-3xl font-bold">How to Use SocialSync</h1>
      <p>
        SocialSync helps you organize your social life — from events like birthdays and dinners, 
        to task reminders like sending gifts or checking in on friends.
      </p>

      <section>
        <h2 className="text-xl font-semibold mb-2">🔔 Events</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Create events like birthdays, weddings, dinners, or anything else.</li>
          <li>Add custom categories and attach a vibe-based image for inspiration.</li>
          <li>View upcoming events by month or date using the calendar.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">📋 Tasks</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Create tasks for things you don’t want to forget — like buying a gift or sending a card.</li>
          <li>Associate tasks with specific events (optional).</li>
          <li>Track completion and stay organized.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">🗓 Dashboard & Calendar</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>See all your events and tasks in one place.</li>
          <li>Filter by Today, This Week, or All Upcoming.</li>
          <li>Click on an item to view details or edit it.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">👤 Profile</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>View your name and email.</li>
          <li>Logout or manage your account (more features coming soon!).</li>
        </ul>
      </section>

      <p className="text-sm italic">
        Need help or want to suggest a feature? We’re just getting started — more features are on the way!
      </p>
    </div>
  );
};

export default HowTo;
