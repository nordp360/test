import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi, RegisterData } from "../services/api";

interface UserProfile {
  first_name?: string;
  last_name?: string;
  pesel?: string;
  address?: string;
}

interface User {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  is_active: boolean;
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (loginData: { email: string; password: string }) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (loginData: { email: string; password: string }) => {
    const data = await authApi.login(loginData);
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
    const userData = await authApi.getMe();
    setUser(userData);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", userData.role || "client");
  };

  const register = async (userData: RegisterData) => {
    await authApi.register(userData);
    // After registration, user needs to login or we can auto-login if backend returns token
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
