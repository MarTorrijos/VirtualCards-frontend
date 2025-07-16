// context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginService, logout as logoutService, getToken, isAuthenticated } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());

  useEffect(() => {
    if (isAuthenticated() && !token) {
      setToken(getToken());
    }
  }, []);

  const login = async (mail, password) => {
    const newToken = await loginService(mail, password);
    setToken(newToken);
  };

  const logout = () => {
    logoutService();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

