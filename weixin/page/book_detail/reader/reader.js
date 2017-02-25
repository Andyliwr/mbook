//login.js
var Api = require('../../../util/api/api.js');
var Util = require('../../../util/util.js');

Page({
    data: {
    	rankData: [],
        currentIndex: 0
    },
    onLoad: function(options) {
        var self = this;
    },
    showRank: function(event){
        this.setData({currentIndex: event.currentTarget.dataset.index});
    }
});