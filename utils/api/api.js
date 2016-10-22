// 处理数据的请求
'use strict';

var HOST_URL = 'http://120.27.161.199:3000/api';
var GET_FACTION_LIST = '/factionlists';
var GET_CONTENT_BY_ID = '/factioncontents/';

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
	//获取页面数据内容
	// getTopicByID: function(id, obj){
	// 	return HOST_URL + GET_CONTENT_BY_ID + id + '?' + obj2url(obj);
	// }
	getContentByID: function(id){
		return HOST_URL + GET_CONTENT_BY_ID + id;
	}
}