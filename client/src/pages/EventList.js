import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppLayout from '../components/AppLayout';

// Utility: Format to "Month YYYY"
const getMonthYear = (dateString) => {
  const options = { year: 'numeric', month: 'long' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const categories = ['ALL', 'BIRTHDAY', 'WEDDING', 'ANNIVERSARY', 'DINNER', 'CHECKIN', 'GIFT REMINDER', 'OTHER'];

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('ALL');
  const navigate = useNavigate();

  const formatDateTime = (dateString) => {
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return new Intl.DateTimeFormat(undefined, options).format(new Date(dateString));
  };
  

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/events`, { withCredentials: true })
      .then((response) => {
        // Sort by date ascending
        const sorted = [...response.data].sort(
          (a, b) => new Date(a.event_date) - new Date(b.event_date)
        );
        setEvents(sorted);
      })
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  const handleCreateEvent = () => {
    navigate('/events/create');
  };

  // Group events by Month-Year
  const groupedEvents = events.reduce((groups, event) => {
    const month = getMonthYear(event.event_date);
    if (!groups[month]) groups[month] = [];
    if (filteredCategory === 'ALL' || event.category === filteredCategory) {
      groups[month].push(event);
    }
    return groups;
  }, {});

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
          <h2 className="text-3xl font-bold text-paynes-gray">My Events</h2>
          <button
            className="bg-vista-blue text-white px-4 py-2 rounded-xl hover:bg-blue-500 transition"
            onClick={handleCreateEvent}
          >
            Create Event
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilteredCategory(cat)}
              className={`px-3 py-1 text-sm rounded-full border ${
                filteredCategory === cat
                  ? 'bg-vista-blue text-white'
                  : 'border-columbia-blue text-paynes-gray hover:bg-columbia-blue/20'
              } transition`}
            >
              {cat === 'ALL' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Event Sections by Month */}
        {Object.keys(groupedEvents).length === 0 ? (
          <p className="text-paynes-gray">No events found.</p>
        ) : (
          Object.entries(groupedEvents).map(([month, monthEvents]) => (
            <div key={month} className="mb-10">
              <h3 className="text-xl font-semibold text-paynes-gray mb-4">{month}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {monthEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl shadow border border-pearl p-4 flex flex-col justify-between"
                  >
                    <div className="mb-3 space-y-1">
                      <h4 className="text-lg font-semibold text-paynes-gray">{event.title}</h4>
                      <p className="text-sm text-gray-600">
                      {`📅 ${formatDateTime(event.event_date)}`}
                      </p>
                    </div>
                    {event.location && (
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">📍</span> {event.location}
                      </p>
                    )}
                    <div className="mb-4">
                    <span
                      className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                        event.category === 'BIRTHDAY' ? 'bg-[#f285b0] text-white' :
                        event.category === 'WEDDING' ? 'bg-[#ef476f] text-white' :
                        event.category === 'ANNIVERSARY' ? 'bg-[#4db6ac] text-white' :
                        event.category === 'DINNER' ? 'bg-[#f4a261] text-white' :
                        event.category === 'CHECKIN' ? 'bg-[#b39ddb] text-white' :
                        event.category === 'GIFT_REMINDER' ? 'bg-[#ffd166] text-slate-800' :
                        'bg-[#7e57c2] text-white'
                      }`}
                    >
                      {event.category === 'OTHER' ? event.customLabel : event.category}
                    </span>

                    </div>
                    <Link
                      to={`/events/${event.id}`}
                      className="text-sm text-vista-blue font-medium hover:underline mt-auto"
                    >
                      View Details →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
};

export default EventList;
