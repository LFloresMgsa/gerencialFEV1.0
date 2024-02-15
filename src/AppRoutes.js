import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Dashboard from './views/Dashboard';


import Avances from './views/Avances';

import Logout from './views/Logout';

import TreeComponent from './components/layout/menu/TreeComponent';
MovUsuarios
import MovUsuarios from './components/Reportes/Rep_movimientos_usuarios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const AppRoutes = (props) => {

  const { accessToken, currentUser } = props;
  const _Usuario = cookies.get("Sgm_cUsuario");
  const [validaLogeo, setValidaLogeo] = useState(_Usuario || '')
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


      {validaLogeo !== null && validaLogeo.trim() !== '' ? (
        <>


          <Route path='/avances' render={(route) => <Avances {...route} />} />

          <Route path='/MovUsuario' render={(route) => <MovUsuarios {...route} />} />
        </>
      ) : (
        <Route
          path="/gestcon"
          render={(route) => <Dashboard {...props} {...route} />}
        />
      )}


      <Route render={() => <Redirect to="/gerencial" />} />
    </Switch>
  );
};

export default AppRoutes;
