import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { format } from 'date-fns';

// Helper: Format to "Month YYYY"
const getMonthYear = (dateString) => {
  const options = { year: 'numeric', month: 'long' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, COMPLETED
  const navigate = useNavigate();

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/tasks`, { withCredentials: true })
      .then((response) => {
        const sorted = [...response.data].sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
        );
        setTasks(sorted);
      })
      .catch((error) => console.error('Error fetching tasks:', error));
  };

  const toggleStatus = async (task) => {
    const updatedStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/tasks/${task.id}`,
        { status: updatedStatus },
        { withCredentials: true }
      );
      fetchTasks(); // Refresh tasks after update
    } catch (error) {
      console.error('Error toggling task status:', error.response?.data);
    }
  };

  const groupedTasks = tasks.reduce((groups, task) => {
    if (filter !== 'ALL' && task.status !== filter) return groups;

    const month = getMonthYear(task.dueDate);
    if (!groups[month]) groups[month] = [];
    groups[month].push(task);
    return groups;
  }, {});

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-paynes-gray">My Tasks</h2>
          <button
            onClick={() => navigate('/tasks/create')}
            className="bg-vista-blue text-white px-4 py-2 rounded-xl hover:bg-blue-500 transition"
          >
            Create New Task
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['ALL', 'PENDING', 'COMPLETED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-sm rounded-full border ${
                filter === f
                  ? 'bg-vista-blue text-white'
                  : 'border-columbia-blue text-paynes-gray hover:bg-columbia-blue/20'
              } transition`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Grouped Task Cards */}
        {Object.keys(groupedTasks).length === 0 ? (
          <p className="text-paynes-gray">No tasks found.</p>
        ) : (
          Object.entries(groupedTasks).map(([month, monthTasks]) => (
            <div key={month} className="mb-10">
              <h3 className="text-xl font-semibold text-paynes-gray mb-4">{month}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {monthTasks.map((task) => (
                  <div
                  key={task.id}
                  className="bg-white border border-pearl rounded-2xl shadow p-4 flex flex-col justify-between relative"
                >
                <button
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="absolute top-3 right-3 text-xl text-[#80a4ed] hover:text-[#4f73b5] transition-colors duration-200"
                  title="View / Edit Task"
                >
                  ⋯
                </button>


                    <div className="mb-3 space-y-1">
                      <h4 className="text-lg font-semibold text-paynes-gray">
                        {task.task_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                      📅 {format(new Date(task.dueDate), 'MMM d, yyyy · h:mm a')}
                      </p>
                      {task.event?.title && (
                        <p className="text-sm text-gray-700">
                          📌 Event: {task.event.title}
                        </p>
                      )}
                    </div>

                    {/* Toggleable Status Badge */}
                    <button
                      onClick={() => toggleStatus(task)}
                      className={`self-start px-3 py-1 text-xs font-semibold rounded-full transition ${
                        task.status === 'COMPLETED'
                          ? 'bg-[#79d29d] text-[#1b5934] hover:bg-[#66bc8b]'
                          : 'bg-[#f2cd65] text-[#6a4e00] hover:bg-[#e3bb55]'
                      }`}
                    >
                      {task.status === 'COMPLETED' ? 'Reopen Task' : 'Task Completed'}
                    </button>

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

export default TaskList;
