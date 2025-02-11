import  { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser, login, register } from "../utils/Auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      initAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = async (email, password) => {
    await login(email, password);
    await initAuth();
  };

  const registerUser = async (lisence,username, email, password) => {
    await register(lisence ,username, email, password);
  };

  const logoutUser = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login: loginUser, register: registerUser, logout: logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Fix: Ensure `useAuth` is used inside `AuthProvider`
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
