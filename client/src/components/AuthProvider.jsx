import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loginFailed, setLoginFailed] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode(token);
      const user = decodedToken.user;
      setUser(user);
      console.log(user);

      // Assuming your user object has an addresses field
      setAddresses(user.addresses || []);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLoginFailed(false);
    setSelectedAddress(null);
    setAddresses([]);
  };

  const value = useMemo(() => {
    return {
      user,
      loginFailed,
      selectedAddress,
      addresses,
      setUser,
      handleLogout,
      setSelectedAddress,
      setAddresses,
    };
  }, [user, loginFailed, selectedAddress, addresses]);

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