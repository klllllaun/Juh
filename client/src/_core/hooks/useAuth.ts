import { useEffect, useState } from "react";

export interface AuthUser {
  id: number;
  email: string;
  name: string | null;
  role: "user" | "admin";
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Always true for public access

  useEffect(() => {
    setLoading(false);
  }, []);

  const logout = async () => {
    // No-op for public access
    console.log("Logout called (no-op for public access)");
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    logout,
  };
}
