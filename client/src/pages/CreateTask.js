import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';

const CreateTask = () => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [eventId, setEventId] = useState('');
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/events`, { withCredentials: true })
      .then(response => setEvents(response.data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        task_name: taskName,
        description,
        dueDate,
        status,
        event_id: eventId || null,
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks`, payload, { withCredentials: true });
      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task:', error.response?.data);
    }
  };

  return (
    <AppLayout>
      <div className="flex justify-center p-8">
        <div className="w-full max-w-2xl bg-white border border-pearl rounded-3xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-paynes-gray">Create Task</h2>
            <button
              onClick={() => navigate('/tasks')}
              className="bg-vista-blue text-white px-4 py-1.5 rounded-full hover:bg-blue-500 transition"
            >
              Cancel
            </button>
          </div>
          <p className="text-sm text-gray-500 italic mb-4">
          Fields marked with <span className="text-red-500">*</span> are required.
        </p>

          <form onSubmit={handleSubmit} className="space-y-5 text-paynes-gray">
          <FormField label={<span>Task Name <span className="text-red-500">*</span></span>}>
            <input
              type="text"
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
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

            <FormField label={<span>Due Date <span className="text-red-500">*</span></span>}>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full border border-columbia-blue rounded-lg px-3 py-2"
                required
              />
            </FormField>

            <FormField label="Status">
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full border border-columbia-blue rounded-lg px-3 py-2"
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </FormField>

            <FormField label="Associated Event">
              <select
                value={eventId}
                onChange={e => setEventId(e.target.value)}
                className="w-full border border-columbia-blue rounded-lg px-3 py-2"
              >
                <option value="">None</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-vista-blue text-white rounded-xl shadow hover:bg-blue-600 transition"
              >
                Create Task
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

export default CreateTask;
