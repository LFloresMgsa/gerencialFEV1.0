import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Dashboard from './views/Dashboard';

import Reportes from './views/Reportes';
import Avances from './views/Avances';

import Logout from './views/Logout';

import TreeComponent from './components/layout/menu/TreeComponent';

import Cookies from 'universal-cookie';
const cookies = new Cookies();
const AppRoutes = (props) => {

  const { accessToken, currentUser } = props;
  const _Usuario = cookies.get("Sgm_cUsuario");

  //console.log(_Usuario);
  return (
    <Switch>
      <Route exact path="/" render={(route) => <Dashboard {...props} {...route} />}>
        <Redirect to="/gerencial" />
      </Route>


      <Route path="/gerencial" render={(route) => <Dashboard {...props} {...route} />} />


      <Route
        exact
        path="/logout"
        render={(route) => <Logout {...props} {...route} />}
      />

      <Route path='/gerencial' render={(route) => <Dashboard {...route} />} />

      <Route path='/reportes' render={(route) => <Reportes {...route} />} />


      <Route path='/avances' render={(route) => <Avances {...route} />} />
      {/* <Route
        exact
        path="/login"
        render={(route) => <Login {...props} {...route} />}
      /> */}

      <Route render={() => <Redirect to="/gerencial" />} />
    </Switch>
  );
};

export default AppRoutes;
