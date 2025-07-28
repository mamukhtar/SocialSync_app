import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../App.css';

const localizer = momentLocalizer(moment);

const categoryColors = {
  BIRTHDAY: '#80a4ed',
  WEDDING: '#ef476f',
  ANNIVERSARY: '#4db6ac',
  DINNER: '#f4a261',
  CHECKIN: '#b39ddb',
  GIFT_REMINDER: '#ffd166',
  OTHER: '#7e57c2',
};

const taskStatusColors = {
  PENDING: '#ffe59e',
  COMPLETED: '#a0e6a0',
};

const CalendarView = () => {
  const [combinedItems, setCombinedItems] = useState([]);
  const [agendaFilter, setAgendaFilter] = useState('TODAY'); // TODAY | WEEK | ALL
  const [calendarDate, setCalendarDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCalendarItems = async () => {
      try {
        const [eventsRes, tasksRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/events`, { credentials: 'include' }),
          fetch(`${process.env.REACT_APP_API_URL}/api/tasks`, { credentials: 'include' }),
        ]);

        const [eventsData, tasksData] = await Promise.all([
          eventsRes.json(),
          tasksRes.json(),
        ]);

        const formattedEvents = eventsData.map(event => {
          const start = new Date(event.event_date);
          const end = new Date(start);
          end.setHours(start.getHours() + 1);
          return {
            id: `event-${event.id}`,
            type: 'event',
            title: `📅 ${event.title}`,
            rawTitle: event.title,
            start,
            end,
            allDay: true,
            category: event.category,
            bgColor: categoryColors[event.category] || categoryColors.OTHER,
          };
        });

        const formattedTasks = tasksData.map(task => {
          const start = new Date(task.dueDate);
          const end = new Date(start);
          end.setHours(start.getHours() + 1);
          return {
            id: `task-${task.id}`,
            type: 'task',
            title: `📝 ${task.task_name}`,
            rawTitle: task.task_name,
            start,
            end,
            allDay: true,
            status: task.status,
            bgColor: taskStatusColors[task.status] || '#ccc',
          };
        });

        setCombinedItems([...formattedEvents, ...formattedTasks]);
      } catch (err) {
        console.error('❌ Error fetching calendar data:', err);
      }
    };

    fetchCalendarItems();
  }, []);

  const filterAgendaItems = () => {
    const now = new Date();
    return combinedItems
      .filter(item => {
        const date = new Date(item.start);
        if (agendaFilter === 'TODAY') {
          return date.toDateString() === now.toDateString();
        } else if (agendaFilter === 'WEEK') {
          const oneWeekFromNow = new Date();
          oneWeekFromNow.setDate(now.getDate() + 7);
          return date >= now && date <= oneWeekFromNow;
        }
        return date >= now;
      })
      .sort((a, b) => new Date(a.start) - new Date(b.start));
  };

  const handleItemClick = (item) => {
    if (item.type === 'event') {
      navigate(`/events/${item.id.replace('event-', '')}`);
    } else {
      navigate(`/tasks/${item.id.replace('task-', '')}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow border border-pearl p-4 mb-10 responsive-calendar-wrapper">
      <div className="responsive-calendar">
        <Calendar
          localizer={localizer}
          events={combinedItems}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.MONTH}
          views={[Views.MONTH]}
          date={calendarDate}
          onNavigate={(date) => setCalendarDate(date)}
          popup
          style={{ height: 600 }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.bgColor,
              color: 'white',
              borderRadius: '6px',
              fontSize: '13px',
              padding: '2px 6px',
            },
          })}
        />
      </div>


      {/* Agenda */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-paynes-gray">Upcoming</h3>
          <select
            value={agendaFilter}
            onChange={(e) => setAgendaFilter(e.target.value)}
            className="border border-columbia-blue rounded-lg px-3 py-1 text-sm text-paynes-gray"
          >
            <option value="TODAY">Today</option>
            <option value="WEEK">This Week</option>
            <option value="ALL">All Upcoming</option>
          </select>
        </div>

        {filterAgendaItems().length === 0 ? (
          <p className="text-paynes-gray text-sm italic">No items to show.</p>
        ) : (
          <ul className="space-y-3">
            {filterAgendaItems().map(item => (
              <li
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-4 border rounded-xl border-l-4 cursor-pointer transition-all duration-200 ${
                  item.type === 'event'
                    ? 'bg-[#f0f6ff] border-vista-blue hover:bg-[#d6e9ff]'
                    : 'bg-[#fdf6db] border-sage hover:bg-[#f6eec0]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-paynes-gray">{item.title}</span>
                  <span className="text-sm text-paynes-gray font-medium">{new Date(item.start).toLocaleString()}</span>
                </div>

                {item.type === 'event' && (
                  <p className="text-xs mt-1 text-paynes-gray font-semibold">
                    Category:{' '}
                    <span className="uppercase tracking-wide">
                      {item.category === 'OTHER' ? 'Custom' : item.category}
                    </span>
                  </p>
                )}

                {item.type === 'task' && (
                  <p className="text-xs mt-1 text-paynes-gray font-semibold">
                    Status: <span className="uppercase">{item.status}</span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
