import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from './Views/Login';
import NavBarDash from '../src/Components/NavbarDash';

import { isAuthenticated } from './services/auth';
import Login2 from './Views/Login2';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <React.Fragment>
          <Component {...props} />
        </React.Fragment>
      ) : (
        <Redirect
          to={{ pathname: '/login', state: { from: props.location } }}
        />
      )
    }
  />
);

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path='/login' component={() => <Login />} />
      <PrivateRoute exact path='/' component={() => <NavBarDash activeKey={1} />} />

      <PrivateRoute
        exact
        path='/dashboard'
        component={() => <NavBarDash activeKey={1} />}
      />
      <PrivateRoute
        exact
        path='/dashboard/contact-us'
        component={() => <NavBarDash activeKey={2} />}
      />
      <PrivateRoute
        exact
        path='/dashboard/about-us'
        component={() => <NavBarDash activeKey={3} />}
      />
      <Route
        path='/dashboard/logout'
        component={() => <NavBarDash activeKey={4} />}
      />
      <Route
        path='/dashboard/login2'
        component={() => <Login2 />}
      />
      <Route path='*' component={() => <h1>Ops! Página não encontrada</h1>} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
