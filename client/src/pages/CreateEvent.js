import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ImageSelector from '../components/ImageSelector';
import AppLayout from '../components/AppLayout';

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('OTHER');
  const [customCategory, setCustomCategory] = useState('');
  const [vibeKeywords, setVibeKeywords] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const finalCategory = category === 'OTHER' ? 'OTHER' : category;

    const eventData = {
      title,
      description,
      event_date: eventDate,
      location,
      category: finalCategory,
      customLabel: category === 'OTHER' ? customCategory : undefined,
      imageUrl: selectedImage,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/events`,
          eventData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        setSuccess('Event created successfully!');
        setTimeout(() => navigate('/events'), 1500);
      }
    } catch (err) {
      console.error('Error creating event:', err.response?.data);
      setError('Could not create event. Please try again.');
    }
  };

  return (
    <AppLayout>
      <div className="flex justify-center p-8">
        <div className="w-full max-w-2xl bg-white border border-pearl rounded-3xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-paynes-gray">Create Event</h2>
          <button
            onClick={() => navigate('/events')}
            className="bg-vista-blue text-white px-4 py-1.5 rounded-full hover:bg-blue-500 transition"
            >
            Cancel
          </button>
        </div>
        <p className="text-sm text-gray-500 italic mb-4">
          Fields marked with <span className="text-red-500">*</span> are required.
        </p>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {success && <div className="text-green-600 mb-4">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-5 text-paynes-gray">

          <FormField label={<span>Title <span className="text-red-500">*</span></span>}>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-columbia-blue rounded-lg px-3 py-2"
              required
            />
          </FormField>

            <FormField label="Description">
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border border-columbia-blue rounded-lg px-3 py-2"
                rows={3}
              />
            </FormField>

            <FormField label={<span>Event Date <span className="text-red-500">*</span></span>}>
              <input
                type="datetime-local"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                className="w-full border border-columbia-blue rounded-lg px-3 py-2"
                required
              />
            </FormField>

            <FormField label="Location">
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full border border-columbia-blue rounded-lg px-3 py-2"
              />
            </FormField>

            <FormField label={<span>Category <span className="text-red-500">*</span></span>}>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
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

              {category === 'OTHER' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value)}
                  className="w-full mt-2 border border-columbia-blue rounded-lg px-3 py-2"
                  placeholder="Enter custom category"
                  required
                />
              )}
            </FormField>

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

            <FormField label="Event Image (Optional)">
              <ImageSelector
                category={category}
                vibeKeywords={vibeKeywords}
                onImageSelect={setSelectedImage}
              />
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="mt-2 max-h-40 rounded-xl shadow"
                />
              )}
            </FormField>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-vista-blue text-white rounded-xl shadow hover:bg-blue-600 transition"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

const FormField = ({ label, children }) => (
  <div>
    <label className="block text-sm font-semibold text-paynes-gray mb-1">{label}</label>
    {children}
  </div>
);

export default CreateEvent;
