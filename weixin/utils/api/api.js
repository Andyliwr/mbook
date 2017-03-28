// 处理数据的请求
'use strict';

var HOST_URL = 'http://localhost:3000/api';
var LOGIN = '/as_users/login';
var GET_FACTION_LIST = '/xs_list';
var GET_FACTION_DETAIL_BY_ID = '/xs_list/';
var GET_CONTENT_BY_ID = '/xs_content/getContentById';
var GET_EMAILS_PAGEID = '/emails';
var GET_BOOKS_SORTBY_TIME = '/xxxx';
var GET_RANK = '/xs_rank/getRank';
var GET_BOOK_MULU = '/xs_list/getMulu';
var GET_SESSION_ID = '/myappuser/getSessionId';
var CHECK_SESSION_ID = '/myappuser/checkSessionId';
var IS_REGISTED_BY_WX = '/myappuser/isRegistedByWx';
var GET_UPLOAD_TOKEN = '/myappuser/getUploadToken';
var REGISTE = '/myappuser';

function obj2url(obj){
	if(obj instanceof Object){
		return Object.keys(obj).map(function(k){
			return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
		}).join('&');
	}else{
		console.err(obj+"，不是一个对象!");
		return '';
	}
}

module.exports = {
	//获取列表数据
	getFactionList: function(){
		return HOST_URL + GET_FACTION_LIST;
	},
	getFactionDetailById: function(id){
		return HOST_URL + GET_FACTION_DETAIL_BY_ID + id;
	},
	getContentById: function(sectionId){
		return HOST_URL + GET_CONTENT_BY_ID + '?sectionId='+sectionId;
	},
	login: function(umt, password){
		return HOST_URL + LOGIN;
	},
	getEmailsByPageid: function(pageid){
		return HOST_URL + GET_FACTION_DETAIL_BY_ID + '?pageid=' + pageid;
	},
	//根据时间分类用户的书籍
	getBooksSortByTime: function(timeObj){
		if(timeObj.timeType && timeObj.timeValue){
			return HOST_URL + GET_BOOKS_SORTBY_TIME + '?timeType=' + timeObj.timeType + '&timeValue=' + timeObj.timeValue;
		}else{
			console.log('根据时间分类用户的书籍 传入参数错误');
		}
	},
	getRank: function(rankType){
		return HOST_URL + GET_RANK + '?rankType='+rankType;
	},
	getMulu: function(bookid, sectionNum){
		return HOST_URL + GET_BOOK_MULU + '?bookId='+bookid+'&sectionNum='+sectionNum;
	},
	//将登录凭证发往你的服务端，并在你的服务端使用该凭证向微信服务器换取该微信用户的唯一标识(openid)和会话密钥(session_key)
	getSessionId: function(wxcode){
		return HOST_URL + GET_SESSION_ID + '?wxcode=' + wxcode;
	},
	//检查本地缓存中记录的登录信息是否有效
	checkSessionId: function(sessionid){
		return HOST_URL + CHECK_SESSION_ID + '?sessionid='+sessionid;
	},
	//检查用户是否已经通过微信注册过
	isRegistedByWx: function(wxcode){
		return HOST_URL + IS_REGISTED_BY_WX + '?wxcode=' + wxcode;
	},
	//个人中心上传图片获取上传token
	getUploadToken: function(){
		return HOST_URL + GET_UPLOAD_TOKEN;
	},
	//新用户注册
	registe: function(){
		return HOST_URL + REGISTE;
	}
}