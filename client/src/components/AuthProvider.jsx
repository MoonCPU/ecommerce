import { createContext, useState, useContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null); // New state for userName
  const [loginFailed, setLoginFailed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode(token);
      const user = decodedToken.user; // Full user object
      setUser(user);
      setUserName(user.user_name); // Set userName separately
    }
  }, []); // Run this effect only once on component mount

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserName(null); // Clear userName on logout
    setLoginFailed(false);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userName, 
        loginFailed,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  return useContext(AuthContext);
};