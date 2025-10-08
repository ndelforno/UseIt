import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser } from "../api/auth";
import { User } from "@/Types/User";

export interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: User | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem("token")
  );

  const refreshUser = async (): Promise<User | null> => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setIsLoggedIn(false);
      return null;
    }

    try {
      const profile = await getCurrentUser();
      setUser(profile);
      setIsLoggedIn(true);
      return profile;
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
      setIsLoggedIn(false);
      throw err;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await refreshUser();
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        setAuthLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const token = await loginUser(email, password);
    if (!token) throw new Error("Login failed");
    localStorage.setItem("token", token);
    await refreshUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        authLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
