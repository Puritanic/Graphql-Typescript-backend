import React, { FC, useState, useEffect } from 'react';
import Routes from './Routes';
import { setAccessToken } from './accessToken';

export interface AppProps {}

const App: FC<AppProps> = props => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/refresh_token', {
      credentials: 'include',
      method: 'POST',
    })
      .then(res => res.json())
      .then(({ accessToken }) => {
        setAccessToken(accessToken);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div> Loading!!! </div>;
  }

  return <Routes />;
};

export default App;
