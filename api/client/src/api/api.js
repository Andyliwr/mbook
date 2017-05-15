import axios from 'axios'
import { cookie } from '../common/js/util'

// let base = 'https://api.andylistudio.com/api';
let base = 'http://localhost:3000/api';
let accessToken = cookie.getCookie('access_token');

export const requestLogin = params => { return axios.post(`${base}/adminUser/login`, params).then(res => res.data); };
export const getUserInfo = id => {
  let query = {};
  query.access_token = accessToken;
  return axios.get(`${base}/adminUser/`+ id, {params: query}).then(res => res.data);
};
export const getEmail = id => {return axios.get(`${base}/adminUser/` + id + '/emails', {params: {filter: {"include": "adminUser"}, access_token: accessToken}}).then(res => res.data)}
export const removeEmail = params => { return axios.get(`${base}/adminUser/`+ params.userId +'/emails/' + params.emailId, {}); };
export const editEmail = (params, putData) => { return axios.port(`${base}/adminUser/`+ params.userId +'/emails/' + params.emailId, {data: putData}); };
export const addEmail = (params, postData) => { return axios.port(`${base}/adminUser/`+ params.userId +'/emails/', {data: postData}); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };


// when it can't use network
// let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

// export const getUserInfo = params => {return axios.get(`${base}/user/getUserInfo`, {params: params}); };

// export const getUserInfo = id => {
//   let query = {};
//   query.access_token = cookie.getCookie('access_token');
//   return axios.get(`${base}/adminUser/`+ id, {params: query}).then(res => res.data);
// };

// export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

// export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

// export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

// export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

// export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };
