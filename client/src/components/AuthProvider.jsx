import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loginFailed, setLoginFailed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode(token);
      const user = decodedToken.user;
      setUser(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLoginFailed(false);
  };

  const value = useMemo(() => {
    return {
      user,
      loginFailed,
      setUser,
      handleLogout,
    };
  }, [user, loginFailed]);

  return (
    <AuthContext.Provider value={value}>
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