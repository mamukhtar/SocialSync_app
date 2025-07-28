// AuthContext middleware for handling user authentication.
// This middleware is used to check if the user is authenticated before accessing protected routes.

import React, { createContext, useState, useEffect, useContext } from "react";

// Create the AuthContext
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // State variables for authentication
  const [loading, setLoading] = useState(true); // Loading state for fetching user data
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication status
  const [user, setUser] = useState(null); // User data

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from the API
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          credentials: "include",
        });
        console.log('➡️ API URL:', process.env.REACT_APP_API_URL);

        
        if (res.ok) {
          setIsAuthenticated(true); // Set authentication status to true
          const data = await res.json(); // Parse user data
          setUser(data); // Set user data
        } else {
          setIsAuthenticated(false); // Set authentication status to false
          setUser(null); // Clear user data
        }
      } catch (error) {
        console.error("Error fetching user data:", error); // Log error if request fails
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUserData(); // Call the function to fetch user data
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: "POST", // HTTP POST method
        credentials: "include", // Include cookies in the request
        headers: { "Content-Type": "application/json" }, // Set content type to JSON
        body: JSON.stringify({ email, password }), // Send email and password in the request body
      });
      if (res.ok) {
        const userData = await res.json(); // Parse user data
        setIsAuthenticated(true); // Set authentication status to true
        setUser(userData); // Set user data
        return { success: true, userData }; // Return success response
      } else {
        setIsAuthenticated(false); // Set authentication status to false
        setUser(null); // Clear user data
        return { success: false }; // Return failure response
      }
    } catch (error) {
      console.error("Login error in context:", error); 
      return { success: false }; // Return failure response
    }
  };

  // Logout function
  const logout = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
      method: "POST", // HTTP POST method
      credentials: "include", // Include cookies in the request
    });
    setIsAuthenticated(false); // Set authentication status to false
    setUser(null); // Clear user data
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: "POST", // HTTP POST method
        credentials: "include", // Include cookies in the request
        headers: { "Content-Type": "application/json" }, // Set content type to JSON
        body: JSON.stringify({ name, email, password }), // Send name, email, and password in the request body
      });
      if (res.ok) {
        const userData = await res.json(); // Parse user data
        setIsAuthenticated(true); // Set authentication status to true
        setUser(userData); // Set user data
        return { success: true, userData }; // Return success response
      } else {
        setIsAuthenticated(false); // Set authentication status to false
        setUser(null); // Clear user data
        return { success: false }; // Return failure response
      }
    } catch (error) {
      console.error("Registration error:", error); 
      return { success: false }; // Return failure response
    }
  };

  // Provide authentication context to children components
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export const useAuthUser = () => useContext(AuthContext);


