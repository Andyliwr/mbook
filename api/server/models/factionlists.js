'use strict';
var app = require('../server.js');
var Tools = require('../tools/tool');
var uuid = require('uuid'); //用于生成sessionid
var promise = require('bluebird');
var Eventproxy = require('eventproxy');

module.exports = function (Factionlists) {
  Factionlists.getBookById = function (bookid, cb) {
    var returnData = {};
    var app = Factionlists.app;
    app.models.factionlists.findById(bookid, {}, {}, function (err, res) {
      if (err) {
        console.log('查询小说列表失败....' + err);
        cb(null, {code: -1, errMsg: '查询小说列表失败, bookid不合法'})
      } else {
        if (res) {
          console.log(res.sectionArray.toString());
          returnData.code = 0; //标志位
          returnData.name = res.factionName;
          returnData.author = res.author;
          if (res.headerImage.indexOf('http') < 0) {
            returnData.headImg = Tools.getQdTrueImgUrl(res.headerImage);
          } else {
            returnData.headImg = res.headerImage;
          }
          returnData.des = Tools.overflowDeal(res.des);
          /*只取这本小说的所有的章节的章节数和章节名，当具体点某章节的时候再去根据章节id获取它的内容*/
          var sectionEp = new Eventproxy();
          sectionEp.after('hasGotContent', res.sectionArray.length, function (allSections) {
            returnData.sectionArray = allSections;
            //获取小说的最新章节
            var newestSection = {sectionNum: 0};
            allSections.forEach(function (sectionItem) {
              if (sectionItem.sectionNum > newestSection.sectionNum) {
                newestSection = sectionItem;
              }
            });
            returnData.newestSection = newestSection;
            //调用callback把数据传出去
            cb(null, returnData);
          });
          res.sectionArray.forEach(function (sectionItem) {
            app.models.factioncontents.findById(sectionItem, {}, function (err, sectionRes) {
              var returnData = {sectionId: null, sectionNum: null, sectionTitle: null};
              if (err) {
                console.log('查询小说内容失败....' + err);
                sectionEp.emit('hasGotContent', returnData);
              } else {
                returnData.sectionId = sectionRes.id;
                returnData.sectionNum = sectionRes.sectionNum;
                returnData.sectionTitle = sectionRes.sectionTitle;
                /**
                 * 这里暂时没有考虑多个不同的来源的问题，按照以前设定的想法，小说应该允许多个来源同时存在，并且会对不同来源
                 * 的小说做层次分析，选取最优的来源，当然这是后期的工作。同时这里不同来源的小说共同存储在一个factionContent
                 * 表中，所以很有可能同一章节会存在不同来源的，所以需要设定一个默认来源，同时应该设定一个来源的优先级，当前一
                 * 个来源没有数据的时候，采用后一个来源的数据，依次类推
                 */
                returnData.sectionResource = sectionRes.sectionResource;
                sectionEp.emit('hasGotContent', returnData);
              }
            });
          });
        } else {
          cb(null, {code: -1, errMsg: '找不到该书籍'})
        }
      }
    });
  };
  //register getBookById
  Factionlists.remoteMethod(
    'getBookById', {
      accepts: {
        arg: 'bookid',
        type: 'string',
        description: 'the id of a book'
      },
      returns: {
        arg: 'data',
        type: 'object',
        description: '返回的结果对象'
      },
      http: {path: '/getBookById', verb: 'get'}
    });

  /**
   * 根据书籍id和当前阅读章节获取章节目录
   * @param bookId 书籍id
   * @param sectionNum 当前正在阅读的章节数
   * @method 直接根据sectionNum大于小于查询
   */
  Factionlists.getMulu = function (bookId, sectionNum, cb) {
    var returnData = {};
    var app = Factionlists.app;
    app.models.factionlists.findById(bookId, {}, {}, function (err, res) {
      if (err) {
        console.log('查询小说列表失败....' + err);
        cb(null, {code: -1, errMsg: '查询小说列表失败'})
      } else {
        returnData.code = 0; //标志位
        returnData.author = res.author;
        if (res.headerImage.indexOf('http') < 0) {
          returnData.headImg = Tools.getQdTrueImgUrl(res.headerImage);
        } else {
          returnData.headImg = res.headerImage;
        }
        returnData.des = Tools.overflowDeal(res.des);
        /*只取这本小说的所有的章节的章节数和章节名，当具体点某章节的时候再去根据章节id获取它的内容*/
        var sectionEp = new Eventproxy();
        sectionEp.after('hasGotContent', res.sectionArray.length, function (allSections) {
          returnData.sectionArray = [];
          //刷选sectionNum前后20章
          allSections.forEach(function (item, index) {
            if (item.sectionNum >= (sectionNum - 10) && item.sectionNum <= (sectionNum + 10)) {
              returnData.sectionArray.push(item);
            }
          });
          //排序
          returnData.sectionArray.sort(function (faction1, faction2) {
            return faction1.sectionNum - faction2.sectionNum;
          });
          //调用callback把数据传出去
          cb(null, returnData);
        });
        res.sectionArray.forEach(function (sectionItem) {
          app.models.factioncontents.findById(sectionItem, {}, function (err, sectionRes) {
            var returnData = {sectionId: null, sectionNum: null, sectionTitle: null};
            if (err) {
              console.log('查询小说内容失败....' + err);
              sectionEp.emit('hasGotContent', returnData);
            } else {
              returnData.sectionId = sectionRes.id;
              returnData.sectionNum = sectionRes.sectionNum;
              returnData.sectionTitle = sectionRes.sectionTitle;
              /**
               * 这里暂时没有考虑多个不同的来源的问题，按照以前设定的想法，小说应该允许多个来源同时存在，并且会对不同来源
               * 的小说做层次分析，选取最优的来源，当然这是后期的工作。同时这里不同来源的小说共同存储在一个factionContent
               * 表中，所以很有可能同一章节会存在不同来源的，所以需要设定一个默认来源，同时应该设定一个来源的优先级，当前一
               * 个来源没有数据的时候，采用后一个来源的数据，依次类推
               */
              sectionEp.emit('hasGotContent', returnData);
            }
          });
        });

      }
    });
  };
  //register getBookById
  Factionlists.remoteMethod(
    'getMulu', {
      accepts: [{
        arg: 'bookId',
        type: 'string',
        description: 'the id of a book'
      },
        {
          arg: 'sectionNum',
          type: 'number',
          description: 'the num of a book section'
        }
      ],
      returns: {
        arg: 'data',
        type: 'object',
        description: '返回的结果对象'
      },
      http: {path: '/getMulu', verb: 'get'}
    });

  /**
   * add commnets
   * @param userid
   * @param bookid
   * @param father the id of what this comment belongs to, the father of this comment. when father == root, this comment is the child of the root(this book)
   * @param content
   */
  Factionlists.addComment = function (userid, bookid, father, content, cb) {
    // query according userid to get username, if userid is error, give up to add this comment
    var app = Factionlists.app;
    app.models.myAppUser.findById(userid)
      .then(function (res) {
        const nickName = res.nickName || 'unkown';
        const avatar = res.avatar || 'https://olpkwt43d.qnssl.com/myApp/unknown_headimg.png';
        // query the comments all existed
        Factionlists.findById(bookid)
          .then(function (listRes) {
            const oldComments = listRes.comments;
            var newComments = oldComments || [];
            var nowTime = new Date();
            const nowTimeset = nowTime.getTime();
            const commentId = uuid.v1();

            // find current comment's father
            // when commentid == root, this comment is the child of the root(this book)
            if (father && content) {
              // if father is ‘root’, need to add a like param
              if (father === 'root') {
                newComments.push({
                  commentid: commentId,
                  userid: userid,
                  nickname: nickName,
                  avatar: avatar,
                  time: nowTimeset,
                  father: father,
                  content: content,
                  likenum: 0
                });
              } else {
                newComments.push({
                  commentid: commentId,
                  userid: userid,
                  nickname: nickName,
                  avatar: avatar,
                  time: nowTimeset,
                  father: father,
                  content: content
                });
              }
              Factionlists.update({id: bookid}, {comments: newComments})
                .then(function (updateRes) {
                  if (updateRes) {
                    cb(null, {code: 0, commentid: commentId});
                  } else {
                    cb(null, {code: -1, errMsg: '更新书单的书评失败'});
                  }
                })
                .catch(function (updateErr) {
                  console.log(updateErr);
                  cb(null, {code: -1, errMsg: '更新书单的书评失败'});
                })
            } else {
              cb(null, {code: -1, errMsg: '参数father和content不合法'});
            }
          })
          .catch(function (listErr) {
            console.log(listErr);
            cb(null, {code: -1, errMsg: 'bookid不合法'});
          });
      })
      .catch(function (err) {
        console.log(err);
        cb(null, {code: -1, errMsg: 'userid不合法'});
      });
  };
  Factionlists.remoteMethod(
    'addComment', {
      accepts: [
        {
          arg: 'userid',
          type: 'string'
        }, {
          arg: 'bookid',
          type: 'string'
        }, {
          arg: 'father',
          type: 'string',
          description: 'id of belonging comments'
        }, {
          arg: 'content',
          type: 'string',
          description: 'content of this comments'
        }
      ],
      returns: {
        arg: 'data',
        type: 'object',
        description: 'result object'
      },
      http: {path: '/addComment', verb: 'post'}
    });

  //delete comment
  Factionlists.deleteComment = function (userid, bookid, commentid, cb) {
    var app = Factionlists.app;
    app.models.myAppUser.findById(userid)
      .then(function (res) {
        // query the comments all existed
        Factionlists.findById(bookid)
          .then(function (listRes) {
            const oldComments = listRes.comments || [];
            // judge commentid is existed
            var isExisted = oldComments.some(function (item) {
              return commentid === item.commentid
            });
            if (isExisted) {
              //delete the comment and the child of this comment
              var newComments = oldComments.filter(function (item) {
                return !((commentid === item.commentid) || (commentid === item.father))
              });
              Factionlists.update({id: bookid}, {comments: newComments})
                .then(function (updateRes) {
                  if (updateRes) {
                    cb(null, {code: 0, successMsg: '删除书评成功'});
                  } else {
                    cb(null, {code: -1, errMsg: '删除书评失败'});
                  }
                })
                .catch(function (updateErr) {
                  console.log(updateErr);
                  cb(null, {code: -1, errMsg: '删除书评失败'});
                })
            } else {
              cb(null, {code: -1, errMsg: '书评id错误'});
            }
          })
          .catch(function (listErr) {
            console.log(listErr);
            cb(null, {code: -1, errMsg: 'bookid不合法'});
          });
      })
      .catch(function (err) {
        console.log(err);
        cb(null, {code: -1, errMsg: 'userid不合法'});
      });
  }

  Factionlists.remoteMethod(
    'deleteComment', {
      accepts: [
        {
          arg: 'userid',
          type: 'string'
        }, {
          arg: 'bookid',
          type: 'string'
        }, {
          arg: 'commentid',
          type: 'string',
          description: 'id of belonging comments'
        }
      ],
      returns: {
        arg: 'data',
        type: 'object',
        description: 'result object'
      },
      http: {path: '/deleteComment', verb: 'post'}
    });

  // list all comments of one book
  Factionlists.listComments = function (bookid, cb) {
    Factionlists.findById(bookid)
      .then(function (res) {
        // deal comment tree
        var comments = (res.comments instanceof Array) ? res.comments : [];
        var result = [];
        // find the comment which the father is root
        comments.forEach(function (item, index) {
          if (item.father === 'root') {
            result.push({rootComment: item, child: []});
          }
        });
        var noRootComments = Tools.removeElement(comments, result);

        // find the comment whitch facther is not root, pack them into an array
        result.forEach(function (resultItem) {
          var resultArr = [];
          var findChildAndSon = function (commentid, nickname) {
            var tmpArr = noRootComments.filter(function (notRootItem) {
              return notRootItem.father === commentid
            });
            tmpArr.forEach(function (tmpItem) {
              tmpItem.reply = nickname;
            });
            resultArr = resultArr.concat(tmpArr);
            // when this comment has child
            if (tmpArr.length > 0) {
              tmpArr.forEach(function (childItem) {
                findChildAndSon(childItem.commentid, childItem.nickname);
              });
            }
          };
          findChildAndSon(resultItem.rootComment.commentid, resultItem.rootComment.nickname);
          resultItem.child = resultArr;
        });
        // 评论排序
        result.sort(function (comment1, comment2) {
          return comment2.rootComment.time - comment1.rootComment.time
        });
        cb(null, {code: 0, comments: result});
      })
      .catch(function (err) {
        console.log(err);
        cb(null, {code: -1, errMsg: 'bookid不合法'});
      })
  }

  Factionlists.remoteMethod(
    'listComments', {
      accepts: {
        arg: 'bookid',
        type: 'string'
      },
      returns: {
        arg: 'data',
        type: 'object',
        description: 'result object'
      },
      http: {path: '/listComments', verb: 'get'}
    });

  // add like num
  Factionlists.addLikeNum = function (bookid, commentid, cb) {
    Factionlists.findById(bookid)
      .then(function (res) {
        if (res) {
          var commentArr = res.comments;
          commentArr.forEach(function (item, index) {
            if (item.commentid === commentid && item.father === 'root') {
              item.likenum++;
              console.log('点赞成功');
            }
          });
          Factionlists.update({id: bookid}, {comments: commentArr})
            .then(function (updateRes) {
              if (updateRes) {
                cb(null, {code: 0, successMsg: "点赞成功"});
              } else {
                cb(null, {code: -1, errMsg: '点赞失败，更新list失败'});
              }
            })
            .catch(function (updateErr) {
              console.log(updateErr);
              cb(null, {code: -1, errMsg: '点赞失败，bookid不合法'});
            })
        } else {
          cb(null, {code: -1, errMsg: "点赞失败，bookid不合法"})
        }
      })
      .catch(function (err) {
        console.log(err);
        cb(null, {code: -1, errMsg: "点赞失败，bookid不合法"})
      })
  }

  Factionlists.remoteMethod(
    'addLikeNum', {
      accepts: [{
        arg: 'bookid',
        type: 'string'
      }, {
        arg: 'commentid',
        type: 'string'
      }],
      returns: {
        arg: 'data',
        type: 'object',
        description: 'result object'
      },
      http: {path: '/addLikeNum', verb: 'post'}
    });

  // get book detail by id
  Factionlists.getBookDetail = function (bookid, cb) {
    var app = Factionlists.app;
    Factionlists.findById(bookid)
      .then(function (res) {
        var result = {};
        result.name = res.factionName;
        result.author = res.author;
        //处理起点小说网的图片url
        var urlReg = new RegExp('^\/\/.*\\r\\n$', 'ig');
        var headImage = res.headerImage;
        if (urlReg.test(headImage)) {
          headImage = 'http:' + headImage.substring(0, headImage.length - 2);
        }
        result.headImage = headImage;
        result.des = res.des;
        result.updateTime = res.updateTime.getTime();
        result.newest = res.newest;
        cb(null, {code: 0, detail: result});
        // get newest section infomation
        // var factionNameReg = new RegExp(res.factionName, 'ig');
        // app.models.Factioncontents.find({des: factionNameReg, sectionNum: res.newest}, {_id: 0, sectionNum: 0, sectionContent: 0, sectionTitle: 1}, function(contentErr, contentRes){
        //   if(contentErr || !contentRes){
        //     console.log('查询最新章节章节名失败，'+contentErr);
        //   }else{
        //     result.newest = {num: res.newest, title: contentRes.sectionTitle}
        //   }
        //   cb(null, {code: 0, detail: result});
        // });
      })
      .catch(function (err) {
        console.log(err);
        cb(null, {code: -1, errMsg: 'bookid不合法'});
      })
  }

  Factionlists.remoteMethod(
    'getBookDetail', {
      accepts: {
        arg: 'bookid',
        type: 'string'
      },
      returns: {
        arg: 'data',
        type: 'object',
        description: 'result object'
      },
      http: {path: '/getBookDetail', verb: 'get'}
    });
};
