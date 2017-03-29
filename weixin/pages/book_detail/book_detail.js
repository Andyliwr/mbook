//login.js
var Api = require('../../utils/api/api.js');
var Util = require('../../utils/util.js');

Page({
    data: {
        commentInputHide:true,
        showAllDes: false,
    	rankData: [],
        currentIndex: 0,
        shortDes:'神秘古怪的嬉命小丑百城联邦，三大帝国，异族横行，魂兽霸幽这是一....""双月当空，无限可能的英魂世界孤神秘古怪的嬉命小丑百城联邦，三大帝国，异异...',
        des:'神秘古怪的嬉命小丑百城联邦，三大帝国，异族横行，魂兽霸幽这是一....""双月当空，无限可能的英魂世界孤神秘古怪的嬉命小丑百城联邦，三大帝国，异族横行，魂兽霸幽这是一....""双月当空，无限可能的英魂世界孤神秘古怪的嬉命小丑百城联邦，三大帝国，异族横行，魂兽霸幽这是一....""双月当空，无限可能的英魂世界孤22',
        img: 'https://olpkwt43d.qnssl.com/myapp/dazhuzai.jpg',
        comments: [
            {
                headImg:'../../image/user.png',
                commentId:123123,
                readerName:'路人甲',
                comment:'这是一条不走心的评论，这是一条不走心的评论，这是一条不走心的评论，这是一条不走心的评论'
            },
            {   
                headImg:'../../image/user.png',
                commentId:123123,
                readerName:'路人乙',
                comment:'这是一条不走心的评论，这是一条不走心的评论，这是一条不走心的评论，这是一条不走心的评论'
            },
            {
                headImg:'../../image/user.png',
                commentId:123123,
                readerName:'路人丙',
                comment:'这是一条不走心的评论，这是一条不走心的评论，这是一条不走心的评论，这是一条不走心的评论'
            }
        ]
    },
    onLoad: function(options) {
        var self = this;
        self.setData({showAllDes:false});
        //options rankType
        console.log(this.bookId);
        wx.request({
		  url: Api.getBookById(options.bookId),
		  success: function(res) {
            if(res.data.data && res.data.data.code == 0){
                self.setData({book:res.data.data});
            }else{
                console.log('请求书籍信息失败....')
            }
		  },
      fail:function() {
             console.log('书籍不存在....')
          }
		});
    },
    showAllDes: function(){
        if(this.data.showAllDes){
            this.setData({showAllDes: false})
        }else{
            this.setData({showAllDes: true})
        }
    },
    addToList: function(){

    },
    goToReader: function(){
        wx.navigateTo({
            url:'reader/reader'
        });        
    },
    //评论相关
    toWriteComment: function(){
        this.setData({commentInputHide:false})
    },
    hideCommentBar: function(){
        this.setData({commentInputHide:true})
    },
    stageCommentValue:function(e){
        this.setData({currentCommentValue:e.detail.value})
    },
    sendComment:function(e){
        console.log(e.detail.value);
        var comments = this.data.comments
        comments.push({
            headImg:'../../image/user.png',
            commentId:123123,
            readerName:'我',
            comment:e.detail.value
        })
        console.log(comments);
        this.setData({comments:comments,currentCommentValue:''});
    }
});