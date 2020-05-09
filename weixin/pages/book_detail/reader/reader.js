//login.js
import { getMulu, getContentById, getContentByHistory } from '../../../utils/api/api';
import Util from '../../../utils/util';
var currentGesture = 0; //控制当一个手势进行的时候屏蔽其他的手势
var moveTime = null; //控制左滑右滑的动画
var isMoving = 0;
var leftTimmerCount = 0;
var rightTimmerCount = 0;
var hasRunTouchMove = false;

/**
 * 计算总页数函数，需要理解行高---line-height和字体大小font-size之间的关系，可以查考http://www.jianshu.com/p/f1019737e155，以及http://www.w3school.com.cn/cssref/pr_dim_line-height.asp
 * @param str 需要分页的内容
 * @param fontSize 当前的字体大小
 * @param lineHeight 当前的行高
 * @param windowW 当前window的宽度
 * @param windowH 当前window的高度
 * @param pixelRatio 当前分辨率，用来将rpx转换成px
 */
function countPageNum(str, fontSize, lineHeight, windowW, windowH, pixelRatio) {
  var returnNum = 0;
  fontSize = fontSize / pixelRatio;
  lineHeight = lineHeight / pixelRatio;
  //将str根据’\n‘截成数组
  var strArray = str.split(/\n+/);
  var splitArray = [];
  var reg = new RegExp('\n+', 'igm');
  var result = '';
  //这里写一个for循环去记录每处分隔符的\n的个数，这将会影响到计算换行的高度
  while ((result = reg.exec(str)) != null) {
    splitArray.push(result.toString().match(/\n/gim).length);
  }
  //spliArray比strArray少一，这里加一项使之数量一样
  splitArray.push(0);
  var totalHeight = 0;
  strArray.forEach(function (item, index) {
    //拒绝最后一项0
    var huanhangNum = splitArray[index] - 1 > 0 ? splitArray[index] - 1 > 0 : 0;
    totalHeight += Math.ceil(item.length / Math.floor((windowW - 80 / pixelRatio) / fontSize)) * lineHeight + huanhangNum * lineHeight;
  });
  return Math.ceil(totalHeight / windowH) + 1;
}

/**
 * 发送获取目录请求的方法
 * @param bookid 书籍的id
 * @param sectionnum 小说的当前章节
 * @param obj 操作的对象
 * @param success 接口完成的回调
 * @param fail 接口失败的回调
 * @param preOrNext 是向前翻页还是向后翻页
 */
function getMuluFun(bookid, sectionnum, obj, success, fail, preOrNext) {
  //发送ajax得到这本小说的所有章节
  var oldSectionData = obj.data.allSectionData;
  wx.request({
    url: getMulu(bookid, sectionnum), //仅为示例，并非真实的接口地址
    success: function (res) {
      try {
        var tmpData = res.data.data;
        //allSectionData像是一个队列，并不是一直加上接口获取的新数据，有一个最大值，当超过这个最大值，会在首尾删减多于的值
        if (oldSectionData.length == 0) {
          obj.setData({ allSectionData: tmpData.sectionArray, headImg: tmpData.headImg });
        } else {
          //如果是向前翻页，数据应该插到顶部
          if (preOrNext == 'pre') {
            obj.setData({ allSectionData: tmpData.sectionArray.concat(oldSectionData) });
          } else if (preOrNext == 'next') {
            obj.setData({ allSectionData: oldSectionData.concat(tmpData.sectionArray) });
          }
        }
        //处理回调
        if (typeof success == 'function') {
          success(obj);
        }
      } catch (e) {
        console.log(e);
        if (typeof fail == 'function') {
          fail(obj);
        }
      }
    },
    fail: function (err) {
      console.log(err);
      //处理回调
      if (typeof fail == 'function') {
        fail(obj);
      }
    }
  });
}

Page({
  data: {
    loaded: false,
    bookid: '',
    factionName: '',
    headImg: '', // 小说图像
    content: '',
    factionTitle: '八部浮屠',
    windows: { windows_height: 0, windows_width: 0, pixelRatio: 1 },
    touches: { lastX: 0, lastY: 0 },
    move_direction: 0, //0代表左滑动，1代表右滑动
    leftValue: 0,
    pageIndex: 1,
    maxPageNum: 0,
    newestSectionNum: 1450,
    allSliderValue: { section: 1431, bright: 80, font: 32 }, //font单位rpx
    isShowFontSelector: 0, //是否显示选择字体详情板块
    isUseBrightModel: 0,
    allFontFamily: ['微软雅黑', '黑体', 'Arial', '楷体', '等线'],
    currentFontFamily: '等线',
    lineHeight: 36, //单位rpx
    control: { all: 0, control_tab: 0, control_detail: 0, target: '' }, //all表示整个控制是否显示，第一点击显示，再一次点击不显示;target表示显示哪一个detail
    colorStyle: { content_bg: '#f5f9fc', styleNum: 1, slider_bg: '#fd9941', slider_none_bg: '#dbdbdb', control_bg: '#ffffff', control_fontColor: '#fd9941' }, //1、2、3、4分别对应四种颜色模式
    isShowMulu: 0, // 是否显示左侧栏
    muluSwiperNum: 0, //目录的滑块显示第几块
    allSectionData: [], // 所有章节数据
    err_tips_data: { err_tips_show: false, err_tips_text: '' }
  },
  onReady: function () {
    var self = this;
    //获取屏幕的高度和宽度，为分栏做准备
    wx.getSystemInfo({
      success: function (res) {
        self.setData({ windows: { windows_height: res.windowHeight, windows_width: res.windowWidth, pixelRatio: res.pixelRatio } });
      }
    });
  },
  onLoad: function (options) {
    var self = this;
    //动态设置标题
    var factionName = options.name || '超品战兵';
    var bookid = options.bookid;
    self.setData({ bookid: bookid, factionName: factionName });
    wx.setNavigationBarTitle({
      title: factionName
    });
    self.loadChapter(bookid);
  },
  //重新显示页面执行函数
  onShow: function () {
    var self = this;
    //读取用户设置
    wx.getStorage({
      key: 'reader_setting',
      success: function (res) {
        var userSetting = JSON.parse(res.data);
        self.setData({
          allSliderValue: userSetting.allSliderValue || self.data.allSliderValue,
          allFontFamily: userSetting.allFontFamily || self.data.allFontFamily,
          newestSectionNum: userSetting.newestSectionNum || self.data.newestSectionNum,
          pageIndex: userSetting.pageIndex || self.data.pageIndex,
          colorStyle: userSetting.colorStyle || self.data.colorStyle
        });
      }
    });
  },
  //跳出页面执行函数
  onHide: function () {
    var self = this;
    //onUnload方法在页面被关闭时触发，我们需要将用户的当前设置存下来
    try {
      var userSetting = {
        allSliderValue: self.data.allSliderValue, // 控制当前章节，亮度，字体大小
        allFontFamily: self.data.allFontFamily, // 已经存在的字体列表
        newestSectionNum: self.data.newestSectionNum, // 当前小说的最新章节
        pageIndex: self.data.pageIndex, // 当前第几页
        colorStyle: self.data.colorStyle //当前的主题
      };
      wx.setStorage('reader_setting', JSON.stringify(userSetting));
    } catch (e) {
      // console.log(e);
    }
  },
  loadChapter(bookid) {
    //显示loading
    wx.showToast({
      title: '内容加载中',
      icon: 'loading',
      duration: 100
    });

    var self = this;
    var userid = wx.getStorageSync('id').userid;
    //根据章节id去得到章节内容
    wx.request({
      url: getContentByHistory(userid, bookid),
      method: 'GET',
      success(res) {
        try {
          var tmpData = res.data.data;
          var newContent = tmpData.content;
          var sectionNum = tmpData.num;
          // //重新排版
          var maxPageNum = countPageNum(newContent, self.data.allSliderValue.font, self.data.lineHeight, self.data.windows.windows_width, self.data.windows.windows_height, self.data.windows.pixelRatio);
          self.setData({ content: newContent, maxPageNum: maxPageNum, allSliderValue: { section: sectionNum, bright: self.data.allSliderValue.bright, font: self.data.allSliderValue.font } });
          wx.hideToast();
          setTimeout(() => {
            self.setData({ loaded: true });
          }, 300);
        } catch (e) {
          wx.hideToast();
          console.log(e);
          Util.showErrMsg(self, '获取章节内容失败');
        }
      },
      fail(e) {
        wx.hideToast();
        Util.showErrMsg(self, '获取章节内容失败');
        console.error(e);
      }
    });
  },
  handletouchmove: function (event) {
    // console.log('正在执行touchmove, isMoving为：'+isMoving);
    var self = this;
    if (currentGesture != 0 || isMoving == 1) {
      return;
    }
    var currentX = event.touches[0].pageX;
    var currentY = event.touches[0].pageY;
    // 判断用没有滑动而是点击屏幕的动作
    hasRunTouchMove = true;
    // console.log('正在执行touchmove, isMoving为：' + isMoving + '------event: {x: ' + event.touches[0].pageX + ' ,y: ' + event.touches[0].pageY + '}');
    var direction = 0;
    if (currentX - self.data.touches.lastX < 0) {
      direction = 0;
    } else if (currentX - self.data.touches.lastX > 0) {
      direction = 1;
    }
    //需要减少或者增加的值
    var moreOrLessValue = Math.abs(currentX - self.data.touches.lastX);
    //将当前坐标进行保存以进行下一次计算
    self.setData({ touches: { lastX: currentX, lastY: currentY }, move_direction: direction });
    var currentIndex = self.data.pageIndex;
    if (direction == 0) {
      if (currentIndex < self.data.maxPageNum) {
        self.setData({ leftValue: self.data.leftValue - moreOrLessValue });
      }
    } else {
      if (currentIndex > 1) {
        self.setData({ leftValue: self.data.leftValue + moreOrLessValue });
      }
    }
  },
  handletouchtart: function (event) {
    // 判断用户的点击事件，如果不是滑动，将不会执行touchmove
    hasRunTouchMove = false;
    // console.log('正在执行touchtart, isMoving为：'+isMoving+'------event: {x: '+event.touches[0].pageX+' ,y: '+event.touches[0].pageY+'}');
    // console.log('正在执行touchtart, isMoving为：'+isMoving);
    if (isMoving == 0) {
      this.setData({ touches: { lastX: event.touches[0].pageX, lastY: event.touches[0].pageY } });
    }
  },
  handletouchend: function () {
    // console.log('正在执行touchend, isMoving为：' + isMoving);
    var self = this;
    // 判断用户的点击事件，决定是否显示控制栏
    if (hasRunTouchMove == false) {
      var y = self.data.touches.lastY;
      var x = self.data.touches.lastX;
      var h = self.data.windows.windows_height / 2;
      var w = self.data.windows.windows_width / 2;
      if (x && y && y >= h - 50 && y <= h + 50 && x >= w - 60 && x <= w + 60) {
        self.setData({ control: { all: self.data.control.all == '0' ? '1' : '0', control_tab: 1, control_detail: 0, target: '' }, isShowFontSelector: 0 });
        return;
      }
    }
    currentGesture = 0;
    //左滑动和有滑动的操作
    var currentIndex = self.data.pageIndex; //当前页数
    var targetLeftValue = null; //移动之后content的目标左值
    var pingjunValue = null; //500ms内平均每100ms移动的值
    if (isMoving == 0) {
      if (self.data.move_direction == 0) {
        if (currentIndex < self.data.maxPageNum) {
          targetLeftValue = -1 * self.data.windows.windows_width * currentIndex;
          // pingjunValue = Math.abs(targetLeftValue - self.data.leftValue) / 4; //500ms其实函数只执行了4次，第一次会等待100ms才会开始函数
          // isMoving = 1; //开始计时的时候将标志置1
          //使用计时器实现动画效果
          // console.log('开始向 左 滑动的计时器，isMoving为1');
          // moveTime = setInterval(function () {
          //   ++leftTimmerCount;
          //   var currentLeftValue = self.data.leftValue;
          //   //如果达到了目标值，立即停止计时器
          //   //调试发现有些时候这个if的跳转会莫名的不成立，所以做个限制，函数被执行了4次之后，无论条件是否成立，将leftValue设置为目标值，并结束计时器
          //   if (leftTimmerCount == 4) {
          //     clearInterval(moveTime);
          //     isMoving = 0;
          //     leftTimmerCount = 0;
              self.setData({ leftValue: targetLeftValue });
          //     return;
          //   }
          //   if (currentLeftValue == targetLeftValue) {
          //     clearInterval(moveTime);
          //     isMoving = 0;
          //     leftTimmerCount = 0;
          //     // console.log('向 左 滑动的计时器结束了，isMoving为0');
          //     return;
          //   }
          //   self.setData({ leftValue: currentLeftValue - pingjunValue });
          // }, 75);
          self.setData({ pageIndex: ++currentIndex });
        }
      } else {
        //前一页和后一页相差其实是2个-320px
        if (currentIndex > 1) {
          targetLeftValue = -1 * self.data.windows.windows_width * (currentIndex - 2);
          // pingjunValue = Math.abs(targetLeftValue - self.data.leftValue) / 4;
          // isMoving = 1;
          // console.log('开始向 左 滑动的计时器，isMoving为1');
          // moveTime = setInterval(function () {
          //   ++rightTimmerCount;
          //   var currentLeftValue = self.data.leftValue;
          //   if (rightTimmerCount == 4) {
          //     clearInterval(moveTime);
          //     isMoving = 0;
          //     rightTimmerCount = 0;
              self.setData({ leftValue: targetLeftValue });
          //     return;
          //   }
          //   if (currentLeftValue == targetLeftValue) {
          //     clearInterval(moveTime);
          //     isMoving = 0;
          //     rightTimmerCount = 0;
          //     // console.log('向 右 滑动的计时器结束了，isMoving为0');
          //     return;
          //   }
          //   self.setData({ leftValue: currentLeftValue + pingjunValue });
          // }, 75);
          self.setData({ pageIndex: --currentIndex });
        }
      }
    } else {
    }
  },
  sectionSliderChange: function (event) {
    var self = this;
    self.setData({ allSliderValue: { section: event.detail.value, bright: self.data.allSliderValue.bright, font: self.data.allSliderValue.font } });
  },
  brightSliderChange: function (event) {
    var self = this;
    self.setData({ allSliderValue: { section: self.data.allSliderValue.section, bright: event.detail.value, font: self.data.allSliderValue.font } });
    //亮度调节，其实是使用一个黑色的cover调节透明度，这里需要给出提示，使用亮度调节会失去当前颜色背景
    if (self.data.isUseBrightModel == '0') {
      wx.showModal({
        title: '提示',
        content: '使用亮度调节，会将背景模式还原至最初模式，建议使用系统的亮度调节',
        success: function (res) {
          if (res.confirm) {
            self.setData({ isUseBrightModel: 1, colorStyle: { content_bg: '#f5f9fc', styleNum: 1, slider_bg: '#fd9941', slider_none_bg: '#dbdbdb', control_bg: '#ffffff', control_fontColor: '#fd9941' } });
          }
        }
      });
    }
  },
  fontSliderChange: function (event) {
    var self = this;
    self.setData({ allSliderValue: { section: self.data.allSliderValue.section, bright: self.data.allSliderValue.section, font: event.detail.value } });
    //重新计算分页
    var maxPageNum = countPageNum(self.data.content, event.detail.value, self.data.lineHeight, self.data.windows.windows_width, self.data.windows.windows_height, self.data.windows.pixelRatio);
    self.setData({ maxPageNum: maxPageNum });
  },
  gotoControlDetail: function (event) {
    var self = this;
    var target = event.currentTarget.dataset.control;
    // 这里control_detail需要做两层判断，首先是control_detail之前是0还是1，0变成1,1变成0，其次是target在两次点击中是否相同，相同则继续上面的判断，否则取反
    var control_detail = null;
    if (self.data.control.control_detail == '0') {
      // 当control_detail不显示的时候不再判断两次点击的目标是否相同，直接统一显示
      control_detail = 1;
    } else {
      if (target && self.data.control.target == target) {
        control_detail = 0;
      } else {
        control_detail = 1;
      }
    }
    self.setData({ control: { all: self.data.control.all, control_tab: 1, control_detail: control_detail, target: target } });
  },
  //点击切换颜色
  switchColorStyle: function (event) {
    var self = this;
    var styleNum = event.currentTarget.dataset.stylenum;
    switch (styleNum) {
      case '1':
        self.setData({ colorStyle: { content_bg: '#f5f9fc', styleNum: 1, slider_bg: '#fd9941', slider_none_bg: '#dbdbdb', control_bg: '#ffffff', control_fontColor: '#fd9941' } });
        break;
      case '2':
        self.setData({ colorStyle: { content_bg: '#f5f0da', styleNum: 2, slider_bg: '#a6832f', slider_none_bg: '#dbd6c3', control_bg: '#f8f3e0', control_fontColor: '#a6832f' } });
        break;
      case '3':
        self.setData({ colorStyle: { content_bg: '#c0edc6', styleNum: 3, slider_bg: '#359112', slider_none_bg: '#a7ccab', control_bg: '#ccf1d0', control_fontColor: '#359112' } });
        break;
      case '4':
        self.setData({ colorStyle: { content_bg: '#1a1e21', styleNum: 4, slider_bg: '#bb7333', slider_none_bg: '#212528', control_bg: '#101417', control_fontColor: '#bb7333' } });
        break;
    }
  },
  selectFontFamily: function () {
    this.setData({ isShowFontSelector: 1 });
  },
  closeFontSelector: function () {
    this.setData({ isShowFontSelector: 0 });
  },
  changeFontFamily: function (event) {
    this.setData({ currentFontFamily: event.currentTarget.dataset.fontname });
    //todo 执行改变字体后的重新排版
  },
  //打开目录侧边栏
  openMulu: function () {
    var self = this;
    var bookid = self.data.bookid || '58cbc7c8618cec336c6e8a10';
    var sectionNum = self.data.allSliderValue.section || 1430;
    // var bookid = self.data.bookid || '58ad9056f5d3811cecea0149'; //home
    //此接口需要分页，不能每次拿到全部的章节数据
    //发送ajax得到这本小说的所有章节
    var success = function (obj) {
      obj.setData({ isShowMulu: 1 });
    };
    var fail = function (obj) {
      wx.showToast({ title: '获取目录失败', icon: 'none' });
    };
    getMuluFun(bookid, sectionNum, self, success, fail);
  },
  //目录向上滑动到顶部
  getPreMuluPage: function () {
    var self = this;
    var bookid = self.data.bookid || '58cbc7c8618cec336c6e8a10';
    var sectionNum = self.data.allSliderValue.section || 1430;
    sectionNum -= 20;
    // var bookid = self.data.bookid || '58ad9056f5d3811cecea0149'; //home
    var success = function (obj) {
      console.log('你向上翻了一页');
    };
    var fail = function (obj) {
      Util.showErrMsg(obj, '获取目录失败');
    };
    getMuluFun(bookid, sectionNum, self, success, fail, 'pre');
  },
  //目录向下滑动到底部
  getNextMuluPage: function () {
    var self = this;
    var bookid = self.data.bookid || '58cbc7c8618cec336c6e8a10';
    var sectionNum = self.data.allSliderValue.section || 1430;
    sectionNum += 20;
    // var bookid = self.data.bookid || '58ad9056f5d3811cecea0149'; //home
    var success = function (obj) {
      console.log('你向上翻了一页');
    };
    var fail = function (obj) {
      Util.showErrMsg(obj, '获取目录失败');
    };
    getMuluFun(bookid, sectionNum, self, success, fail, 'next');
  },
  //滑动目录swiper
  muluSwiper: function (event) {
    var self = this;
    var currentIndex = event.detail.current;
    self.setData({ muluSwiperNum: currentIndex });
  },
  closeMulu:function(e){
    this.setData({"isShowMulu": false});
  },
  //点击目录某一章
  showThisSection: function (event) {
    //显示loading
    wx.showToast({
      title: '内容加载中',
      icon: 'loading',
      duration: 100
    });

    var self = this;
    var sectionId = event.currentTarget.dataset.sectionid;
    var sectionNum = event.currentTarget.dataset.sectionnum;
    //根据章节id去得到章节内容
    wx.request({
      url: getContentById(sectionId),
      method: 'GET',
      success(res) {
        try {
          var tmpData = res.data.data;
          var newContent = tmpData.content.sectionContent;
          //重新排版
          var maxPageNum = countPageNum(newContent, self.data.allSliderValue.font, self.data.lineHeight, self.data.windows.windows_width, self.data.windows.windows_height, self.data.windows.pixelRatio);
          self.setData({ content: newContent, maxPageNum: maxPageNum, allSliderValue: { section: sectionNum, bright: self.data.allSliderValue.bright, font: self.data.allSliderValue.font } });
          wx.hideToast();
          self.closeMulu();
        } catch (e) {
          // console.log(e);
          wx.hideToast();
          Util.showErrMsg(self, '获取章节内容失败');
        }
        wx.hideToast();
      },
      fail(e) {
        wx.hideToast();
        Util.showErrMsg(self, '获取章节内容失败');
        console.error(e);
      }
    });
  }
});
