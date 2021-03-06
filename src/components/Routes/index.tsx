import React, { useContext, FC } from 'react';
import { Switch, Route, Redirect, RouteProps } from 'react-router-dom';

import StartPage from '../../pages/StartPage';
import HelpWanted from '../../pages/HelpWanted';
import Impressum from '../../pages/Impressum';
import Privacy from '../../pages/Privacy';
import Login from '../../pages/Login';
import { Auth, IAuthContext } from '../App';
import GetHelp from '../../pages/GetHelp';
import MyRequests from '../../pages/MyRequests';

export interface ProtectedRouteProps extends RouteProps {}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  component: Component,
  path,
  ...rest
}) => {
  const authCtx: IAuthContext = useContext(Auth);

  if (!authCtx.auth.authenticated) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: {
            from: path,
          },
        }}
      />
    );
  } else {
    return <Route component={Component} {...rest} />;
  }
};

export default function Base() {
  const auth: IAuthContext = useContext(Auth);

  return (
    <Switch>
      <Route exact path="/">
        <StartPage />
      </Route>
      <ProtectedRoute exact path="/profile/requests" component={MyRequests} />
      <Route path="/help">
        <HelpWanted />
      </Route>
      <ProtectedRoute path="/get-help" component={GetHelp} />
      <Route path="/information">
        <div>Informationen</div>
      </Route>
      <Route path="/contact">
        <div>Kontakt</div>
      </Route>
      <Route path="/flyer">
        <div>Flyer</div>
      </Route>
      <Route path="/impressum">
        <Impressum />
      </Route>
      <Route path="/privacy">
        <Privacy />
      </Route>
      {!auth.auth.authenticated && <Route path="/login" component={Login} />}
      <Redirect to="/" />
    </Switch>
  );
}
