import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ImageSelector from '../components/ImageSelector';
import AppLayout from '../components/AppLayout';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    category: '',
    customLabel: '',
    imageUrl: '',
  });
  const [vibeKeywords, setVibeKeywords] = useState('');

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
        const foundEvent = response.data.find((evt) => evt.id === id);
        if (foundEvent) {
          setEventData(foundEvent);
          setFormData({
            title: foundEvent.title,
            description: foundEvent.description || '',
            event_date: new Date(foundEvent.event_date).toISOString().slice(0, 16),
            location: foundEvent.location || '',
            category: foundEvent.category,
            customLabel: foundEvent.customLabel || '',
            imageUrl: foundEvent.imageUrl || '',
          });
        }
      })
      .catch((error) => console.error('Error fetching event details:', error));
  }, [id]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageSelect = (url) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/events/${id}`,
        formData,
        { withCredentials: true }
      );
      setEventData(response.data.event);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating event:', error.response?.data);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/events/${id}`, {
        withCredentials: true,
      });
      navigate('/events');
    } catch (error) {
      console.error('Error deleting event:', error.response?.data);
    }
  };

  if (!eventData)
    return <p className="text-center mt-8 text-paynes-gray">Loading event details...</p>;

  return (
    <AppLayout>
      <div className="flex justify-center p-8">
        <div className="w-full max-w-2xl bg-white border border-pearl rounded-3xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-paynes-gray">
              {editMode ? 'Edit Event' : 'Event Details'}
            </h2>
            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-vista-blue text-white px-4 py-1.5 rounded-full hover:bg-blue-500 transition"
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editMode && (
            <p className="text-sm text-gray-500 italic mb-4">
              Fields marked with <span className="text-red-500">*</span> are required.
            </p>
          )}


          {editMode ? (
            <form onSubmit={handleUpdate} className="space-y-5 text-paynes-gray">
              <FormField label={<span>Title <span className="text-red-500">*</span></span>}>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-columbia-blue rounded-lg px-3 py-2"
                  required
                />
              </FormField>

              <FormField label={<span>Event Date <span className="text-red-500">*</span></span>}>
                <input
                  type="datetime-local"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleInputChange}
                  className="w-full border border-columbia-blue rounded-lg px-3 py-2"
                  required
                />
              </FormField>

              <FormField label="Location">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border border-columbia-blue rounded-lg px-3 py-2"
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-columbia-blue rounded-lg px-3 py-2"
                  rows={3}
                />
              </FormField>

              <FormField label={<span>Category <span className="text-red-500">*</span></span>}>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-columbia-blue rounded-lg px-3 py-2"
                >
                  <option value="BIRTHDAY">Birthday</option>
                  <option value="WEDDING">Wedding</option>
                  <option value="ANNIVERSARY">Anniversary</option>
                  <option value="DINNER">Dinner</option>
                  <option value="CHECKIN">Check-In</option>
                  <option value="GIFT_REMINDER">Gift Reminder</option>
                  <option value="OTHER">Other</option>
                </select>
              </FormField>

              {formData.category === 'OTHER' && (
                <FormField label="Custom Label">
                  <input
                    type="text"
                    name="customLabel"
                    value={formData.customLabel}
                    onChange={handleInputChange}
                    className="w-full border border-columbia-blue rounded-lg px-3 py-2"
                    placeholder="e.g., Me Day, Celebration, etc."
                  />
                </FormField>
              )}

              <FormField
                label={
                  <span className="flex items-center gap-1 relative group w-fit">
                    Image Inspiration
                    <span className="text-red-500 cursor-pointer font-bold">i</span>

                    {/* Tooltip */}
                    <div className="absolute top-full left-0 z-10 mt-1 w-64 text-sm bg-red-600 text-white px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    Add keywords to inspire your event image — like “cozy dinner,” “spring picnic,” or “neon birthday.”
                    </div>
                  </span>
                }
              >
                <input
                  type="text"
                  name="vibeKeywords"
                  value={vibeKeywords}
                  onChange={e => setVibeKeywords(e.target.value)}
                  className="w-full border border-columbia-blue rounded-lg px-3 py-2"
                  placeholder="e.g., spring brunch, candlelit garden, rooftop party"
                />
              </FormField>

              <FormField label="Event Image">
                <ImageSelector
                  category={formData.category}
                  vibeKeywords={vibeKeywords} 
                  onImageSelect={handleImageSelect}
                />
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Selected"
                    className="mt-2 max-h-40 rounded-xl shadow"
                  />
                )}
              </FormField>


              <div className="flex gap-3 pt-4">
                <button type="submit" className="bg-sage text-white px-4 py-2 rounded-xl">
                  Save
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-paynes-gray">
                {eventData.title && (
                  <BubbleRow label="Title" value={eventData.title} color="#4caf50" />
                )}
                {eventData.event_date && (
                  <BubbleRow label="Date" value={formatDateTime(eventData.event_date)} color="#4db6ac" />
                )}
                {eventData.location && (
                  <BubbleRow label="Location" value={eventData.location} color="#f6a04d" />
                )}
                {eventData.description && (
                  <BubbleRow label="Description" value={eventData.description} color="#c59cf0" />
                )}
                {(eventData.category || eventData.customLabel) && (
                  <BubbleRow
                    label="Category"
                    value={eventData.category === 'OTHER' ? eventData.customLabel : eventData.category}
                    color={
                      eventData.category === 'BIRTHDAY' ? '#80a4ed' :
                      eventData.category === 'WEDDING' ? '#ef476f' :
                      eventData.category === 'ANNIVERSARY' ? '#4db6ac' :
                      eventData.category === 'DINNER' ? '#f4a261' :
                      eventData.category === 'CHECKIN' ? '#b39ddb' :
                      eventData.category === 'GIFT_REMINDER' ? '#ffd166' :
                      '#7e57c2'
                    }
                  />
                )}
              </div>

              {eventData.imageUrl && (
                <div className="mt-6">
                  <div className="overflow-auto rounded-xl shadow">
                    <img
                      src={eventData.imageUrl}
                      alt="Event"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-6">
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

// ===== REUSABLE COMPONENTS =====

const BubbleRow = ({ label, value, color }) => (
  <div className="flex items-start gap-3">
    <span
      className="text-sm font-semibold text-white px-3 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
    <p className="text-paynes-gray leading-6">{value}</p>
  </div>
);

const FormField = ({ label, children }) => (
  <div>
    <label className="block text-sm font-semibold text-paynes-gray mb-1">{label}</label>
    {children}
  </div>
);

export default EventDetails;
