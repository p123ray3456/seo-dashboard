import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /* ADMIN LOGIN */
  const loginAsAdmin = () => {
    const admin = {
      id: "admin_001",
      role: "admin",
    };

    localStorage.setItem("auth_user", JSON.stringify(admin));
    localStorage.setItem("token", "admin-token");
    localStorage.setItem("role", "admin");

    setUser(admin);
  };

  /* CLIENT LOGIN — IMPORTANT */
  const loginAsClient = () => {
    const client = {
      id: "client_001",
      role: "client",
      clientId: "1770399731623", // 🔥 MUST match Mongo client id
    };

    localStorage.setItem("auth_user", JSON.stringify(client));
    localStorage.setItem("token", "client-token");
    localStorage.setItem("role", "client");

    setUser(client);
  };

  const logout = () => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, loginAsAdmin, loginAsClient, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
