import axios from 'axios'
import { cookie } from '../common/js/util'

// let base = 'https://api.andylistudio.com/api';
let base = 'http://localhost:3000/api';
let accessToken = cookie.getCookie('access_token');

export const requestLogin = params => { return axios.post(`${base}/adminUser/login`, params).then(res => res.data); };
export const getUserInfo = id => {
  let query = {};
  query.access_token = cookie.getCookie('access_token');
  return axios.get(`${base}/adminUser/`+ id, {params: query}).then(res => res.data);
};
export const getEmail = id => {
  let query = {};
  query.userid = id;
  query.access_token = cookie.getCookie('access_token');
  return axios.get(`${base}/emails/getEmails`, {params: query}).then(res => res.data.data);
}
export const removeEmail = params => { return axios.get(`${base}/adminUser/`+ params.userId +'/emails/' + params.emailId, {}); };
export const editEmail = (params, putData) => { return axios.port(`${base}/adminUser/`+ params.userId +'/emails/' + params.emailId, {data: putData}); };
export const addEmail = (params, postData) => { return axios.port(`${base}/adminUser/`+ params.userId +'/emails/', {data: postData}); };