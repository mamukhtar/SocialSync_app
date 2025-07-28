import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { format } from 'date-fns';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    task_name: '',
    description: '',
    dueDate: '',
    status: '',
  });
  const [eventId, setEventId] = useState('');
  const [events, setEvents] = useState([]);

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
      .get(`${process.env.REACT_APP_API_URL}/api/tasks`, { withCredentials: true })
      .then((response) => {
        const foundTask = response.data.find((t) => t.id === id);
        if (foundTask) {
          setTask(foundTask);
          setFormData({
            task_name: foundTask.task_name,
            description: foundTask.description || '',
            dueDate: new Date(foundTask.dueDate).toISOString().slice(0, 16),
            status: foundTask.status,
          });
          setEventId(foundTask.event_id || '');
        }
      })
      .catch((error) => console.error('Error fetching task details:', error));
  
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/events`, { withCredentials: true })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error('Error fetching events:', err));
  }, [id]);
  

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/tasks/${id}`,
        { ...formData, event_id: eventId },
        { withCredentials: true }
      );      
      setTask(response.data.task);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating task:', error.response?.data);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, {
        withCredentials: true,
      });
      navigate('/tasks');
    } catch (error) {
      console.error('Error deleting task:', error.response?.data);
    }
  };

  if (!task)
    return <p className="text-center mt-8 text-paynes-gray">Loading task details...</p>;

  return (
    <AppLayout>
      <div className="flex justify-center p-16">
        <div className="w-full max-w-2xl bg-white border border-pearl rounded-3xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-paynes-gray">
              {editMode ? 'Edit Task' : 'Task Details'}
            </h2>
            <button
              onClick={() => setEditMode((prev) => !prev)}
              className="bg-vista-blue text-white px-4 py-1.5 rounded-full hover:bg-blue-500 transition"
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editMode ? (
            <>
              <p className="text-sm text-gray-500 italic mb-4">
                Fields marked with <span className="text-red-500">*</span> are required.
              </p>

              <form onSubmit={handleUpdate} className="space-y-5 text-paynes-gray">
                <FormField label={<span>Task Name <span className="text-red-500">*</span></span>}>
                  <input
                    type="text"
                    name="task_name"
                    value={formData.task_name}
                    onChange={handleInputChange}
                    className="w-full border border-columbia-blue rounded-lg px-3 py-2"
                    required
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

                <FormField label={<span>Due Date <span className="text-red-500">*</span></span>}>
                  <input
                    type="datetime-local"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full border border-columbia-blue rounded-lg px-3 py-2"
                    required
                  />
                </FormField>

                <FormField label="Status">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
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

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="bg-sage text-white px-4 py-2 rounded-xl">
                    Save
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-paynes-gray">
                <BubbleRow label="Task Name" value={task.task_name} color="#a6d36f" />
                <BubbleRow
                  label="Due Date"
                  value={formatDateTime(task.dueDate)}
                  color="#4db6ac"
                />

                {task.description && (
                  <BubbleRow label="Description" value={task.description} color="#f0ab6d" />
                )}
                <BubbleRow
                  label="Status"
                  value={task.status}
                  color={
                    task.status === 'COMPLETED'
                      ? '#43a047' // Fresh green
                      : '#f4b400' // Strong yellow-gold
                  }
                />
              {eventId && (
                <BubbleRow
                  label="Associated Event"
                  value={events.find(e => e.id === eventId)?.title || 'N/A'}
                  color="#ab47bc"
                />
              )}
              </div>
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

// ==== Reusable Components ====

const FormField = ({ label, children }) => (
  <div>
    <label className="block text-sm font-semibold text-paynes-gray mb-1">{label}</label>
    {children}
  </div>
);

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

export default TaskDetails;
