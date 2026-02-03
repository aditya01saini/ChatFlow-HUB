import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 🔐 SAFE localStorage read
  const storedUser = localStorage.getItem("user");

  const [user, setUser] = useState(
    storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null
  );

  // ✅ LOGIN FUNCTION
  const login = (data) => {
    // data = { token, user }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  // ✅ LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
