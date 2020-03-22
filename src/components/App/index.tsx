import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import './style.scss';
import Layout from '../Layout';

import Base from '../Routes';
import { callApi } from '../../api/requests';

export interface IAuth {
  authenticated: Boolean;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  token: string | null;
}

export interface IAuthContext {
  auth: IAuth;
  set: Function;
  logout: Function;
}

// Create Auth context
// @ts-ignore
export const Auth = React.createContext<IAuthContext>();

function App() {
  const [auth, setAuth] = useState<IAuth>({
    authenticated: false,
    firstname: null,
    lastname: null,
    email: null,
    token: null,
  });

  useEffect(() => {
    const run = async () => {
      // Check if jwt is valid
      if (window.localStorage.getItem('coronahelp-token')) {
        try {
          let res: any = await fetch('http://localhost:3000/api/v1/users/me', {
            headers: {
              'Content-Type': 'application/json',
              'X-Access-Token': window.localStorage.getItem(
                'coronahelp-token',
              ) as string,
            },
          });

          res = await res.json();

          if (res.error) throw new Error('Token invalid.');

          setAuth({
            authenticated: true,
            firstname: res.user.firstname,
            lastname: res.user.lastname,
            email: res.user.email,
            token: window.localStorage.getItem('coronahelp-token') as string,
          });
        } catch (e) {
          console.log(e);
        }
      }
    };

    run();
  }, []);

  const logout = () => {
    setAuth({
      authenticated: false,
      firstname: null,
      lastname: null,
      email: null,
      token: null,
    });
    window.localStorage.removeItem('coronahelp-token');
  };

  return (
    <div className="App">
      <Auth.Provider value={{ auth, set: setAuth, logout: logout }}>
        <BrowserRouter>
          <Layout>
            <Base />
          </Layout>
        </BrowserRouter>
      </Auth.Provider>
    </div>
  );
}

export default App;
