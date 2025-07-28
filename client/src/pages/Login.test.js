// Login.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { AuthContext } from '../security/AuthContext';


const mockLogin = jest.fn(() => Promise.resolve({ success: true }));
const authContextValue = {
  isAuthenticated: false,
  loading: false,
  user: null,
  login: mockLogin,
};

describe('Login Component', () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  test('renders the login form elements', () => {
    render(
      <AuthContext.Provider value={authContextValue}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    // Use getByRole to target the heading
    const heading = screen.getByRole('heading', { name: /login/i });
    expect(heading).toBeInTheDocument();

    // Use getByLabelText for the associated form controls
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();

    // Ensure there's one button with the name "Login"
    const loginButtons = screen.getAllByRole('button', { name: /login/i });
    expect(loginButtons.length).toBeGreaterThan(0);
  });

  test('submits the form and calls login with correct credentials', async () => {
    render(
      <AuthContext.Provider value={authContextValue}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password');
  });

  test('displays an error message on login failure', async () => {
    const failedAuthContext = {
      ...authContextValue,
      login: jest.fn(() => Promise.resolve({ success: false })),
    };

    render(
      <AuthContext.Provider value={failedAuthContext}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'fail@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    const errorMessage = await screen.findByText(/Login failed. Please try again./i);
    expect(errorMessage).toBeInTheDocument();
  });
});
