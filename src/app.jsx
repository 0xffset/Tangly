
import axios from 'axios';
import { useState, useEffect } from 'react';

import Router from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import 'src/global.css';
import ThemeProvider from 'src/theme';

// ----------------------------------------------------------------------


export default function App() {
  useScrollToTop();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [loginSubmitFlag, setLoginSubmitFlag] = useState(true); // New state variable

  const handleLoginSubmit = () => {
    // Perform login actions
    // Set loginSubmitFlag to true when the login is submitted
    setLoginSubmitFlag(true);
  };

  const runOnceBeforeRender = () => {
    
  }
  const useBeforeInitialRender = (fn) => {
    useState(fn);
  }
  useEffect(() => {
    if (loginSubmitFlag) {
      const auth_token = localStorage.getItem("auth_token");
      const auth_token_type = localStorage.getItem("auth_token_type");
      const token = `${auth_token_type} ${auth_token}`;
      const API_URL = import.meta.env.VITE_ENVIRONMENT === "development" ? import.meta.env.VITE_SERVER_DEVELOPMENT : import.meta.env.VITE_SERVER_PRODUCTION

      if (!token) {
        setIsAuthenticated(false);
        setLoginSubmitFlag(false);
        return;
      }
      axios.get(`${API_URL}users/`, {
        headers: { Authorization: token },
      })
        .then((response) => {
          if (response.status === 200) {
            setUser(response.data.result);
            setIsAuthenticated(true);
          } else {
            // Handle other status codes (e.g., 401 for unauthorized)
            setIsAuthenticated(false);
          }
        })
        .catch((error) => {
          setIsAuthenticated(false);
        });

      setLoginSubmitFlag(false); // Reset the flag after the effect is done
    }
  }, [isAuthenticated, loginSubmitFlag]);

  useBeforeInitialRender(runOnceBeforeRender);
  return (
    <ThemeProvider>
      <Router isAuthenticated={isAuthenticated} user={user} handleLoginSubmit={handleLoginSubmit} />
    </ThemeProvider>
  );
}
