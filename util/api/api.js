// 处理数据的请求
'use strict';

var HOST_URL = 'https://api.andylistudio.com/api';
var LOGIN = '/as_users/login';
var GET_FACTION_LIST = '/factionlists';
var GET_FACTION_DETAIL_BY_ID = '/factionlists/';
var GET_CONTENT_BY_ID = '/factioncontents/';
var GET_EMAILS_PAGEID = '/emails';
var GET_BOOKS_SORTBY_TIME = '/xxxx'

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
	//获取页面数据内容
	// getTopicByID: function(id, obj){
	// 	return HOST_URL + GET_CONTENT_BY_ID + id + '?' + obj2url(obj);
	// }
	getContentByID: function(id){
		return HOST_URL + GET_CONTENT_BY_ID + id;
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
	}
}