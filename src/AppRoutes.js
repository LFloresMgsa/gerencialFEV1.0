import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Dashboard from './views/Dashboard';

import Logout from './views/Logout';


import Cookies from 'universal-cookie';
const cookies = new Cookies();
const AppRoutes = (props) => {

  const { accessToken, currentUser } = props;
  const _Usuario = cookies.get("Sgm_cUsuario");

  //console.log(_Usuario);
  return (
    <Switch>
      <Route exact path="/" render={(route) => <Dashboard {...props} {...route} />}>
        <Redirect to="/gestcon" />
      </Route>


      <Route path="/gestcon" render={(route) => <Dashboard {...props} {...route} />} />


      <Route
        exact
        path="/logout"
        render={(route) => <Logout {...props} {...route} />}
      />


{/* <Route
        exact
        path="/login"
        render={(route) => <Login {...props} {...route} />}
      /> */}

      <Route render={() => <Redirect to="/gestcon" />} />
    </Switch>
  );
};

export default AppRoutes;
