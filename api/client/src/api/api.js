import axios from 'axios'
import { cookie } from '../common/js/util'

let base = 'https://api.andylistudio.com/api';

export const requestLogin = params => { return axios.post(`${base}/adminUser/login`, params).then(res => res.data); };

export const getUserInfo = id => {
  let query = {};
  query.access_token = cookie.getCookie('tokenid');
  return axios.get(`${base}/adminUser/`+ id, {params: query}).then(res => res.data);
};

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };
