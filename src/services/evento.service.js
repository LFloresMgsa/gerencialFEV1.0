//evento.service.js
import { Try } from '@mui/icons-material';
import { authHeader, handleResponse } from '../helpers';
import Fetch from '../helpers/Fetch';

export const eventoService = {
  obtenerUsuario,
  //obtenerFiles,
  obtenerToken,
  obtenerEmpresas,
  obtenerAnios
  
};

function obtenerToken(dataJson) {
  const url = '/api/LOGIN';
  const options = { headers: authHeader(), body: JSON.stringify(dataJson) };
  const params = {};


  return Fetch.post(url, params, options).then((res) =>
    handleResponse(res, false)
  );
}


function obtenerUsuario(dataJson) {
  const url = '/api/LOGIN/ValidaIngreso';
  const options = { headers: authHeader(), body: JSON.stringify(dataJson) };
  const params = {};


  return Fetch.post(url, params, options).then((res) =>
    handleResponse(res, false)
  );
}

function obtenerEmpresas(dataJson) {
  const url = '/api/LOGIN/BuscarEmpresas';
  const options = { headers: authHeader(), body: JSON.stringify(dataJson) };
  const params = {};


  return Fetch.post(url, params, options).then((res) =>
    handleResponse(res, false)
  );
}


function obtenerAnios(dataJson) {
  const url = '/api/LOGIN/BuscarAnios';
  const options = { headers: authHeader(), body: JSON.stringify(dataJson) };
  const params = {};


  return Fetch.post(url, params, options).then((res) =>
    handleResponse(res, false)
  );
}


