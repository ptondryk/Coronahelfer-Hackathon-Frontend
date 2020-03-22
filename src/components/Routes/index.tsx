import React, { useContext, FC } from 'react';
import { Switch, Route, Redirect, RouteProps } from 'react-router-dom';

import StartPage from '../../pages/StartPage';
import HelpWanted from '../../pages/HelpWanted';
import Login from '../../pages/Login';
import { Auth, IAuthContext } from '../App';

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
  return (
    <Switch>
      <Route exact path="/">
        <StartPage />
      </Route>
      <ProtectedRoute exact path="/help" component={HelpWanted} />
      <Route path="/get-help">
        <div>Hilfe bekommen</div>
      </Route>
      <Route path="/information">
        <div>Informationen</div>
      </Route>
      <Route path="/contact">
        <div>Kontakt</div>
      </Route>
      <Route path="/login" component={Login} />
      <Redirect to="/" />
    </Switch>
  );
}
