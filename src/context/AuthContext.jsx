import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
  });

  useEffect(() => {
    // Keep localStorage in sync
    localStorage.setItem('token', authState.token || '');
    localStorage.setItem('role', authState.role || '');
  }, [authState]);

  const login = async (username, password) => {
    const response = await axios.post('/auth/login', { username, password });
    const { token, role } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setAuthState({ token, role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuthState({ token: null, role: null });
  };

  const isAuthenticated = !!authState.token;

  return (
    <AuthContext.Provider value={{ ...authState, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
