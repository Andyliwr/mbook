//login.js
var Api = require('../../utils/api/api.js');
var Util = require('../../utils/util.js');

Page({
  data: {
    bookid: null,
    isInList: 0, // 是否已经在书架中
    userInfo: null,
    commentInputHide: true,
    showAllDes: false,
    bookDetail: null,
    comments: [],
    err_page_data: null, //app状态页
    commentType: 'root'
  },
  onLoad: function (options) {
    var self = this;
    // show loading
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 0
    });

    // 只有url中带了是否在书架的参数才去更新isInList的值
    if (options.isInList === '0' || options.isInList === '1') {
      self.setData({isInList: parseInt(options.isInList)});
    }else{
      var booklist = wx.getStorageSync('booklist');
      var isInMyBook = booklist.some(function(item){
        return item.bookid === options.bookid;
      });
      self.setData({isInList: isInMyBook? 1: 0});
    }

    // 获取userid和用户信息
    var userInfo = wx.getStorageSync('userInfo');
    userInfo.userid = wx.getStorageSync('id').userid;
    self.setData({userInfo: userInfo, showAllDes: false, bookid: options.bookid});
    self.getBookDetail();
    self.getComments(options.bookid);
  },
  getBookDetail: function () {
    var self = this;
    var bookid = self.data.bookid;
    wx.request({
      url: Api.getBookDetail(bookid),
      success: function (res) {
        var tmpData = res.data.data;
        if (tmpData && tmpData.code == 0) {
          //格式化日期
          var date = new Date(tmpData.detail.updateTime);
          tmpData.detail.updateTime = Util.formatDate3(date);
          // devide des into shortDes and des;
          var shortDes = '';
          // format des
          var des = tmpData.detail.des;
          tmpData.detail.des = des.replace(/( ){2,}/, ' ');
          if (des.length > 95) {
            shortDes = des.substring(0, 76);
          }
          tmpData.detail.shortDes = shortDes;
          self.setData({bookDetail: tmpData.detail, err_page_data: null});
        } else {
          console.log('请求书籍信息失败....');
          self.setData({
            err_page_data: {
              show: true,
              image_url: 'https://olpkwt43d.qnssl.com/myapp/err_tips/network_err.png',
              text: '努力找不到网络>_<请检查后重试',
              buttonText: '重试',
              click: 'getBookDetail'
            }
          });
        }
      },
      fail: function (err) {
        console.log(err);
        self.setData({
          err_page_data: {
            show: true,
            image_url: 'https://olpkwt43d.qnssl.com/myapp/err_tips/network_err.png',
            text: '努力找不到网络>_<请检查后重试',
            buttonText: '登录',
            click: 'getBookDetail'
          }
        });
      },
      complete: function () {
        //hide loading
        setTimeout(function () {
          wx.hideToast()
        }, 1000)
      }
    });
  },
  // get comments
  getComments: function (bookid) {
    var self = this;
    wx.request({
      url: Api.listComments(bookid),
      success: function (res) {
        var tmpData = res.data.data;
        if (tmpData && tmpData.code == 0) {
          // 格式化日期
          var finalData = tmpData.comments.map(function (item) {
            // rootComment
            var rootDate = new Date(item.rootComment.time);
            item.rootComment.time = Util.formatDate3(rootDate);
            // child
            item.child.forEach(function (childItem) {
              var childDate = new Date(childItem.time);
              childItem.time = Util.formatDate3(childDate);
            });
            // isLike and isOpenMoreComment
            item.rootComment.isLike = 0;
            item.rootComment.isOpenMoreComment = 0;
            return item;
          });
          self.setData({comments: finalData});
        } else {
          console.log('请求书籍信息失败....');
          self.setData({
            err_page_data: {
              show: true,
              image_url: 'https://olpkwt43d.qnssl.com/myapp/err_tips/network_err.png',
              text: '努力找不到网络>_<请检查后重试',
              buttonText: '重试',
              click: 'getBookDetail'
            }
          });
        }
      },
      fail: function (err) {
        console.log(err);
        self.setData({
          err_page_data: {
            show: true,
            image_url: 'https://olpkwt43d.qnssl.com/myapp/err_tips/network_err.png',
            text: '努力找不到网络>_<请检查后重试',
            buttonText: '重试',
            click: 'getBookDetail'
          }
        });
      },
      complete: function () {
        //hide loading
        setTimeout(function () {
          wx.hideToast()
        }, 1000)
      }
    });
  },
  showAllDes: function () {
    if (this.data.bookDetail.shortDes) {
      if (this.data.showAllDes) {
        this.setData({showAllDes: false})
      } else {
        this.setData({showAllDes: true})
      }
    }
  },
  addLikeNum: function (e) {
    var self = this;
    var commentid = e.currentTarget.dataset.commentid;
    var isInLikeArr = self.data.comments.some(function (item) {
      return commentid === item.rootComment.commentid && item.rootComment.isLike
    });
    // 如果已经点赞了，就不重复发接口了
    if (!isInLikeArr) {
      var addLikeData = {
        bookid: self.data.bookid,
        commentid: commentid
      };
      wx.request({
        method: 'post',
        url: Api.addLikeNum(),
        data: addLikeData,
        success: function (res) {
          var tmpData = res.data.data;
          if (tmpData && tmpData.code === 0) {
            console.log('点赞成功');
            var comments = self.data.comments;
            // 更新comments
            comments.forEach(function (item) {
              if (commentid === item.rootComment.commentid) {
                item.rootComment.isLike = 1;
                ++item.rootComment.likenum;
              }
            })
            self.setData({comments: comments});
          } else {
            Util.showErrMsg(self, '点赞失败!', 1000);
          }
        },
        fail: function (err) {
          console.log(err);
          Util.showErrMsg(self, '点赞失败!', 1000);
        }
      });
    }
  },
  addOrRemove: function () {
    var self = this;
    // 已在书架的先提示确认是否移除，然后调用deleteMyBook， 不在驾的调用addMyBook
    if (self.data.isInList === 1) {
      var deleteData = {
        userid: self.data.userInfo.userid,
        bookids: self.data.bookid
      };
      wx.request({
        method: 'post',
        url: Api.deleteMyBooks(),
        data: deleteData,
        success: function (res) {
          var tmpData = res.data.data;
          if (tmpData && tmpData.code === 0) {
            console.log('将该书已成功从书架中移除');
            wx.showToast({
              title: '已从书架移除',
              icon: 'success',
              duration: 2000
            });
            setTimeout(function () {
              wx.hideToast();
            }, 1000);
            self.setData({isInList: 0});
          } else {
            Util.showErrMsg(self, '移除失败!', 1000);
          }
        },
        fail: function (err) {
          console.log(err);
          Util.showErrMsg(self, '移除失败!', 1000);
        }
      });
    } else {
      var addData = {
        userid: self.data.userInfo.userid,
        bookids: self.data.bookid
      };
      wx.request({
        method: 'post',
        url: Api.addMyBooks(),
        data: addData,
        success: function (res) {
          var tmpData = res.data.data;
          if (tmpData && tmpData.code === 0) {
            console.log('该书添加已成功添加至书架');
            wx.showToast({
              title: '已添加至书架',
              icon: 'success',
              duration: 2000
            });
            setTimeout(function () {
              wx.hideToast();
            }, 1000);
            self.setData({isInList: 1});
          } else {
            Util.showErrMsg(self, '添加失败!', 1000);
          }
        },
        fail: function (err) {
          console.log(err);
          Util.showErrMsg(self, '添加失败!', 1000);
        }
      });
    }
  },
  goToReader: function () {
    wx.navigateTo({
      url: 'reader/reader?bookid=' + this.data.bookid
    });
  },
  //评论相关
  readMoreComments: function (e) {
    var self = this;
    var commentid = e.currentTarget.dataset.commentid;
    var hasOpenMoreComent = self.data.comments.some(function (item) {
      return commentid === item.rootComment.commentid && item.rootComment.isOpenMoreComment
    });
    var comments = self.data.comments;
    // 更新comments
    comments.forEach(function (item) {
      if (commentid === item.rootComment.commentid) {
        if (hasOpenMoreComent) {
          item.rootComment.isOpenMoreComment = 0;
        } else {
          item.rootComment.isOpenMoreComment = 1;
        }
      }
    })
    self.setData({comments: comments});
  },
  toWriteComment: function (e) {
    var commentid = e.currentTarget.dataset.commentid;
    var nickname = e.currentTarget.dataset.nickname;
    var userid = e.currentTarget.dataset.userid;
    if (commentid && nickname && userid) {
      this.setData({commentInputHide: false, commentType: {id: commentid, nickname: nickname, userid: userid}});
    } else {
      this.setData({commentInputHide: false, commentType: {id: 'root', nickname: '', userid: ''}});
    }
  },
  hideCommentBar: function () {
    this.setData({commentInputHide: true})
  },
  stageCommentValue: function (e) {
    this.setData({currentCommentValue: e.detail.value})
  },
  sendComment: function (e) {
    var self = this;
    var comments = self.data.comments;
    var content = e.detail.value;
    var addCommentData = {
      userid: self.data.userInfo.userid,
      bookid: self.data.bookid,
      father: self.data.commentType.id,
      content: content
    };
    // 不能给自己回复
    if (1 || self.data.userInfo.userid !== self.data.commentType.userid) {
      // 调用增加评论的接口
      wx.request({
        url: Api.addComment(),
        method: 'post',
        data: addCommentData,
        success: function (res) {
          var tmpData = res.data.data;
          if (tmpData && tmpData.code == 0) {
            // 评论成功
            if (self.data.commentType.id === 'root') {
              comments.unshift(
                {
                  rootComment: {
                    commentid: tmpData.commentid,
                    userid: self.data.userInfo.userid,
                    nickname: '我',
                    avatar: self.data.userInfo.avatar,
                    father: 'root',
                    content: content,
                    isLike: 0,
                    likenum: 0,
                    isOpenMoreComment: 0,
                    time: Util.formatDate3(new Date())
                  },
                  child: []
                }
              );
            } else {
              comments.forEach(function (item) {
                var isFind = false;
                // 先查找root
                if (item.rootComment.commentid === self.data.commentType.id) {
                  item.child.push({
                    commentid: tmpData.commentid,
                    userid: self.data.userInfo.userid,
                    nickname: '我',
                    avatar: self.data.userInfo.avatar,
                    father: self.data.commentType.id,
                    content: content,
                    reply: self.data.commentType.nickname,
                    time: Util.formatDate3(new Date())
                  });
                  isFind = true;
                } else {
                  // 再查找child
                  if (item.child.length > 0) {
                    item.child.forEach(function (item2, index, array) {
                      if (item2.commentid === self.data.commentType.id) {
                        array.push({
                          commentid: tmpData.commentid,
                          userid: self.data.userInfo.userid,
                          nickname: '我',
                          avatar: self.data.userInfo.avatar,
                          father: self.data.commentType.id,
                          content: content,
                          reply: self.data.commentType.nickname,
                          time: Util.formatDate3(new Date())
                        });
                      }
                    });
                    isFind = true;
                  }
                }
                //发表评论之后保证isOpenMoreComment是1，即可以看到详细回复
                if (isFind) {
                  item.rootComment.isOpenMoreComment = 1;
                }
              });
            }
            // 更新书评数组
            self.setData({comments: comments, currentCommentValue: ''});
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 0
            });
            setTimeout(function () {
              wx.hideToast();
            }, 1000)
          } else {
            console.log('发布....');
            Util.showErrMsg(self, '获取章节内容失败', 1000);
          }
        },
        fail: function (err) {
          console.log(err);
          Util.showErrMsg(self, '获取章节内容失败', 1000);
        }
      });
    } else {
      Util.showErrMsg(self, '请勿给自己回复!', 1000);
    }
  }
});