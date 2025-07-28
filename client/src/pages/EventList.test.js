import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import EventList from './EventList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('EventList Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays "No events found" when API returns an empty list', async () => {
    // Setup: axios.get resolves with an empty array
    axios.get.mockResolvedValue({ data: [] });

    render(
      <Router>
        <Routes>
          <Route path="/" element={<EventList />} />
        </Routes>
      </Router>
    );

    // Check for the heading and create event button
    expect(screen.getByText(/My Events/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Event/i })).toBeInTheDocument();

    // Wait for the "No events found." text to be rendered
    await waitFor(() => {
      expect(screen.getByText(/No events found./i)).toBeInTheDocument();
    });
  });

  test('displays a list of events when API returns events', async () => {
    const mockEvents = [
      { id: '1', title: 'Test Event 1', event_date: '2025-04-25T18:00:00.000Z' },
      { id: '2', title: 'Test Event 2', event_date: '2025-05-01T20:00:00.000Z' },
    ];

    // Setup: axios.get resolves with our mockEvents
    axios.get.mockResolvedValue({ data: mockEvents });

    render(
      <Router>
        <Routes>
          <Route path="/" element={<EventList />} />
        </Routes>
      </Router>
    );

    // Wait for the events to be displayed, then check that the events are rendered as links
    await waitFor(() => {
      expect(screen.getByText(/Test Event 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Event 2/i)).toBeInTheDocument();
    });
  });
});
