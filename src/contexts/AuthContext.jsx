import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      setToken(savedToken);
      checkUser(savedToken);
    }
  }, []);

  const checkUser = async (authToken) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'getUser' }),
      });
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signIn',
          email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        return { error: data.error };
      }
      
      setUser(data.user);
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('auth_token', data.token);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Auth error:", error);
      return { error: "Error de conexión" };
    }
  };

  const signup = async (email, password) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signUp',
          email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        return { error: data.error };
      }
      
      setUser(data.user);
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('auth_token', data.token);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Auth error:", error);
      return { error: "Error de conexión" };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signOut' }),
      });
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}