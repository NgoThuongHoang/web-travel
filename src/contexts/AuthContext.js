import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    role: null,
    initialized: false // Thêm trạng thái khởi tạo
  });

  // Đồng bộ với Redux store nếu cần
  useEffect(() => {
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    
    if (user && role) {
      setAuthState({
        user: JSON.parse(user),
        role,
        initialized: true
      });
    } else {
      setAuthState(prev => ({ ...prev, initialized: true }));
    }
  }, []);

  const login = (userData, userRole) => {
    setAuthState({
      user: userData,
      role: userRole,
      initialized: true
    });
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userRole);
  };

  const logout = () => {
    setAuthState({
      user: null,
      role: null,
      initialized: true
    });
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  };

  const isAuthenticated = () => {
    return authState.user !== null && authState.role !== null;
  };

  const isAdmin = () => {
    return authState.role === 'Admin';
  };

  // Chờ khởi tạo xong mới render children
  if (!authState.initialized) {
    return null; // Hoặc loading spinner
  }

  return (
    <AuthContext.Provider value={{ 
      user: authState.user, 
      role: authState.role, 
      login, 
      logout, 
      isAuthenticated, 
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);