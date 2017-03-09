module.exports = {
	"extends": "airbnb-base",
	"parser": "babel-eslint",
	"globals" : {
		"Page": true,
		"App": true,
		"wx" : true,
		"getApp":true,
		"NODE_ENV":true,
	},
	"plugins": [
		'html'
	],
	"rules" : {
		// "global-require": 0,
		"indent": [0, "tab"], // 去掉tab约定,IDE会有问题
	},
};