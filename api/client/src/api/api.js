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
  // 分页
  query.filter = {"limit": 10, "skip": 0};
  query.access_token = cookie.getCookie('access_token');
  return axios.get(`${base}/emails/getEmails`, {params: query}).then(res => res.data.data);
};
export const removeEmail = params => {
  let query = {};
  query.access_token = cookie.getCookie('access_token');
  return axios.delete(`${base}/adminUser/`+ params.userid +'/emails/' + params.emailid, {params: query});
};
export const editEmail = (adminUserId, emailId, putData) => {
  let access_token = cookie.getCookie('access_token');
  return axios.put(`${base}/adminUser/`+ adminUserId +'/emails/'+emailId+'?access_token='+access_token, putData);
};
export const addEmail = (myAppUserId, adminUserId, postData) => {
  postData.myAppUserId = myAppUserId;
  postData.adminUserId = adminUserId;
  let access_token = cookie.getCookie('access_token');
  return axios.post(`${base}/adminUser/`+ adminUserId +'/emails?access_token='+access_token, postData);
};
export const getAllUser = function(){
  let query = {};
  query.access_token = cookie.getCookie('access_token');
  return axios.get(`${base}/myAppUser/getAllUser`, {params: query}).then(res=> res.data.data);
};
