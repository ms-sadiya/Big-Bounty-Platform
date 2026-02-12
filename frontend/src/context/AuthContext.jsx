import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8000/api/v1'; 

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true 
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // PERSISTENCE: Initialize from localStorage to prevent UI jump
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('bb_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('bb_authenticated') === 'true';
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // FIX: The endpoint in your auth.route.js is "/me"
        const response = await api.get('/auth/me');
        
        if (response.data.success) {
          const userData = response.data.data;
          setUser(userData);
          setIsAuthenticated(true);
          
          // Keep local storage in sync
          localStorage.setItem('bb_user', JSON.stringify(userData));
          localStorage.setItem('bb_authenticated', 'true');
        } else {
          throw new Error("Session invalid");
        }
      } catch (error) {
        // If the cookie is expired or missing, the backend returns 401
        // and we clear the local state
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('bb_user');
        localStorage.removeItem('bb_authenticated');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const userData = response.data.data.user;
      
      setUser(userData);
      setIsAuthenticated(true);
      
      localStorage.setItem('bb_user', JSON.stringify(userData));
      localStorage.setItem('bb_authenticated', 'true');
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (registrationData) => {
    try {
      const response = await api.post('/auth/register', registrationData);
      const userData = response.data.data.user;
      
      setUser(userData);
      setIsAuthenticated(true);
      
      localStorage.setItem('bb_user', JSON.stringify(userData));
      localStorage.setItem('bb_authenticated', 'true');
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear everything
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('bb_user');
      localStorage.removeItem('bb_authenticated');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading }}>
      {!loading ? (
        children
      ) : (
        <div className="flex items-center justify-center h-screen bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-gray-500 font-medium">Restoring session...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};