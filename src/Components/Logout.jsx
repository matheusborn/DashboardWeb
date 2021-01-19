import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Logout = () => {
  const history = useHistory();

  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem('dash-token');
      localStorage.setItem('logout', true);
      if (localStorage.getItem('bla') !== null) {
        localStorage.removeItem('bla');
        history.push({ pathname: '/dashboard/login2' });
      } else {
        history.push({ pathname: '/login' });
      }
      window.location.reload();
    };

    handleLogout();
  }, [history]);

  return <></>;
};

export default Logout;
