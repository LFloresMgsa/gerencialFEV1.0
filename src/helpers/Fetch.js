//fecth.js
import { store } from '../store.js';

//const apiHost = 'http://localhost:5000';
const _apiHost = `${SERVICE_URL}`;



async function request(url, params = {}, method = 'GET', options) {
  
  // const _options = { method, credentials: 'include', ...options };
  const _options = { method, credentials: 'same-origin', ...options };

  
  //console.log(_options);
  url += '?' +  objectToQueryString({...params});

  return await fetch(_apiHost + url, _options);
}

function objectToQueryString(obj) {
  return Object.keys(obj)
    .map((key) => key + '=' + obj[key])
    .join('&');
}

function get(url, params, options) {
  return request(url, params, 'GET', options);
}

function post(url, params, options) {
  return request(url, params, 'POST', options);
}

function update(url, params, options) {
  return request(url, params, 'PUT', options);
}

function remove(url, params, options) {
  return request(url, params, 'DELETE', options);
}

export default {
  get,
  post,
  update,
  remove,
};
