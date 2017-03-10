/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _stringify = __webpack_require__(2);

	var _stringify2 = _interopRequireDefault(_stringify);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//login.js
	var Api = __webpack_require__(5);
	var Util = __webpack_require__(40);
	var currentGesture = 0; //控制当一个手势进行的时候屏蔽其他的手势
	var moveTime = null; //控制左滑右滑的动画
	var isMoving = 0;
	var leftTimmerCount = 0;
	var rightTimmerCount = 0;
	var hasRunTouchMove = false;

	//计算总页数函数，需要理解行高---line-height和字体大小font-size之间的关系，可以查考http://www.jianshu.com/p/f1019737e155，以及http://www.w3school.com.cn/cssref/pr_dim_line-height.asp
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
	    splitArray.push(result.toString().match(/\n/img).length);
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

	Page({
	  data: {
	    content: '第一千四百一十二章\n\n\n当牧尘的身影落在了黑光长老所在的那座白玉石台时，整个天地间，依旧还处于先前的震撼之中，所有人都是一片沉默。\n\n这种沉默持续了许久，终于是有着人有些艰难的开口喃喃道：“那是...传闻中大千世界三十六道绝世神通之一的八部浮屠吧？”\n\n在场的这些各方超级势力，自然也是阅历非凡，所以很快的，也是渐渐的认出了先前牧尘所施展出来的那惊天动地的神通。\n\n那道幽黑光束所具备的毁灭力，看得众多天至尊都是头皮发麻，而如此威能的神通之术，除了那名震大千世界的三十六道绝世神通外，还能是什么？\n\n“没想到，他竟然真的将八部浮屠修炼成功了。”那些浮屠古族的长老，特别是玄脉与墨脉的，更是眼睛通红，无比嫉妒的望着牧尘，那模样，仿佛是恨不得将这般神通抢夺过来一般。\n\n因为身为天至尊，他们非常清楚那三十六道绝世神通对于他们而言究竟代表着什么，若是拥有，他们同样是能够无敌于同级之中。\n\n想想看，大千世界究竟有多少天至尊，然而那最顶尖的神通，却唯有这三十六道，由此可见其价值。\n\n就算是他们浮屠古族这深不可测的底蕴，能够媲美这三十六道绝世神通的神通之术，都是屈指可数。\n\n在那先前牧尘所在的山峰，清霜玉手紧紧的捂住嘴巴，此时的激动，连她素来的冰冷都是再维持不住，娇躯颤抖。\n\n原本以为他们清脉此次将会是毁灭般的打击，但谁料到竟会峰回路转，牧尘的横空出世，居然有着要将这般大势扭转过来的迹象。\n\n“牧尘，加油啊！”清霜喃喃道。\n\n在她身旁，灵溪倒是微笑着拍了拍她的香肩，让得后者有些不好意思的一笑，渐渐的冷静下来。\n\n“灵溪姐，牧尘能赢吗？”清霜带着一丝期盼的问道，虽然她知道，即便赢了两场，但牧尘接下来要面对的对手，却会更强。\n\n灵溪清浅一笑，温婉优雅，道：“放心吧，牧尘既然会出手，那自然有着他的把握，我们只需要等着便行了。”\n\n清霜用力的点了点头，美目凝视着远处那道身影，眸子中异彩流溢。\n\n而在另外一座山峰上，林静拍着玉手用力的鼓掌，笑盈盈的道：“牧尘赢得太漂亮了。”\n\n这两场战斗，牧尘完全没有丝毫试探的意思，一出手便是倾尽全力，甚至不惜暴露底牌，而如此一来，那战绩也是辉煌震撼得很，两招下来，赢得干脆利落，让人看得也是有些热血沸腾。\n\n一旁的萧潇也是螓首轻点，眸子中满是欣赏之色。\n\n“看来牧尘对这浮屠古族怨气很大啊。”倒是一旁的药尘呵呵一笑，他的眼力何等的老辣，一眼就看了出来，这是牧尘故意为之，因为他今日而来，本就是为了心中那口隐忍二十多年的一口气，这口气，为了他，为了他那夫妻分离，孤寂多年的爹，也为了他那被囚禁多年，不见天日的母亲，所以他要的胜利，不是那种势均力敌的激战，而是干脆利落，雷霆万钧。\n\n这样一来，那玄脉的脸面，可就丢得有点大了。\n\n“不过这种战斗方式，只能在有着绝对把握的情况下，若是两者战斗相仿，谁先暴露底牌，怕就得失去一些先机了。”林貂也是点评道，不过虽然这样说着，他的脸庞上，同样是有着欣赏之色，因为牧尘会选择这种战斗方式，那也就说明了他对自身的一种自信。\n\n这种自信，他也曾经在林动的身上见到过。\n\n...\n\n在那沉默的天地间，白玉石台上的黑光长老，也是面色有些阴沉的望着眼前信步而来的青年，望着后者，他眼神深处，也是掠过浓浓的忌惮之色。\n\n先前牧尘展现出来的手段，不管是那诡异的紫色火炎，还是那霸道无比的八部浮屠，都让得黑光长老心中泛着一丝惧意。\n\n他的实力，比玄海，玄风都要强，乃是灵品后期，但在面对着此时锐气逼人的牧尘时，他依旧是没有多少的底气。\n\n“该死，这个家伙怎么现在变得如此之强！”\n\n黑光心中怒骂，旋即生出一些后悔之意，他后悔的并不是为什么要招惹牧尘，而是后悔当初牧尘只是大圆满时，他为何不果决一些，直接出杀手。\n\n即便不必真的将其斩杀，但起码也要将其一身修为给废了，让得他从此变成一个废物，如此的话，也就没了今日的灾劫。\n\n“你是在想为什么当初没杀了我吗？”而在黑光目光闪烁的时候，牧尘盯着他，却是一笑，说道。\n\n黑光闻言，顿时哆嗦了一下，他能够感觉到，牧尘虽然在笑，在那言语间，却是弥漫着无尽的寒气甚至杀意。\n\n不过他毕竟也是浮屠古族的长老，地位显赫，很快渐渐的平复了心情，阴沉的盯着牧尘，道：“牧尘，你做事可不要太过分了，年轻人有锐气是好事，但若是太过，恐怕就得过刚易折了。”\n\n“你玄脉若是有本事，那就折给我看看吧。”牧尘漫不经心的道。\n\n“你！”\n\n黑光一怒，但瞧得牧尘那冰冷目光时，心头又是一悸，不由得羞恼至极。\n\n“还不出手吗？”牧尘盯着他，语气淡漠，然后他伸出手掌，修长如白玉，其上灵光跳跃：“若是不出手的话，那我就要动手了。”\n\n黑光闻言，恼怒得咬牙切齿，而就当他准备运转灵力时，忽有一道传音，落入耳中：“黑光，催动秘法，全力出手，即便不胜，也要将其锐气尽挫，接下来，自会有人收拾他。”\n\n听到这道传音，黑光目光顿时一闪，眼睛不着痕迹的扫了玄脉脉首玄光一眼，这道传音，显然就是来自于后者。\n\n“要催动秘法吗？”黑光踌躇了一下，一旦如此做的话，就算是以他天至尊的恢复力，也起码得虚弱大半年的时间。\n\n不过他也明白玄光的意图，现在的牧尘锐气太甚了，他一场场的打下来，就算到时候无法取胜四场，但也足以让他们玄脉搞得灰头土脸。\n\n眼下众多超级势力在观礼，若是传出去的话，说他们玄脉，被一个罪子横扫，这无疑会将他们玄脉的颜面丢光。\n\n所以，不管如何，黑光都不能再让牧尘如先前那般取得势如破竹般的战绩。\n\n必须将其阻拦下来，破其锐气，而接下来的第四场，他们玄脉，就能够派出仙品天至尊，到时候，要收拾这牧尘，自然是易如反掌。\n\n“好！”\n\n心中踌躇了一下，黑光终于是狠狠一咬牙，在见识了先前牧尘的手段后，即便是他，也是没把握能够接下牧尘的攻势，既然如此，还不如拼命一搏。\n\n“小辈，今日就让你知晓，什么叫做过刚易折！”\n\n黑光心中冷声说道，旋即他身形陡然暴射而退，同时讥讽冷笑道：“牧尘，休要得意，今日你也接我一招试试！”\n\n轰！\n\n随着其音落，只见得黑光身后，亿万道灵光交织，一座巨大的至尊法相现出身来，浩瀚的灵力风暴，肆虐在天地间。\n\n这至尊法相一出现，黑光也是深深的吸了一口气，双手陡然结出一道古怪印法。\n\n同时，其身后的至尊法相，也是双手结印。\n\n在那远处，清天，清萱等长老见到这一幕，瞳孔顿时一缩，骇然道：“无耻！竟然是化灵秘法！”\n\n在他们骇然失声时，那黑光则是对着牧尘露出狠辣笑容，森然道：“既然你咄咄逼人，那也怪不得老夫心狠手辣了。”\n\n话音落下，他的肚子陡然鼓胀起来，同时他身后的至尊法相，也是鼓起巨大的肚子，下一刻，他张开嘴巴，猛然一吐。\n\n黑光与身后的至尊法相嘴中，竟是有着星辰般的洪流远远不断的奔腾而出，那等声势，犹如是能够磨灭万古。\n\n而随着那星河般的洪流不断的呼啸而出，只见得黑光的身躯迅速的干枯，而那至尊法相，也是开始黯淡无光，仿佛两者之中的所有力量，都是化为了那无尽星辰洪流。\n\n天地间，众多天至尊见到这一幕，都是忍不住的面色一变，失声道：“这黑光疯了，竟然将至尊法相都是分解了？！”\n\n至尊法相乃是天至尊最强的战力之一，若是自我分解，那就得再度重新凝炼，那所需要消耗的时间与精力可是不少，而且说不定还会有着损伤。\n\n所以一般这种手段，极少人会动用，那是真正的损人不利己，杀敌一千，自损一千的同归于尽之法。\n\n呼呼！\n\n天地间，星辰洪流呼啸而过，对着牧尘笼罩而去，那等威势，仿佛就算是日月，都将会被消磨而灭。\n\n众多强者神色凝重，先前牧尘的锐气太甚，所以这黑光才会以这种极端的方式，试图将其阻扰，坏其锐气，保住玄脉的颜面。\n\n“黑光可真是狠辣，这下子，那牧尘可是遇见麻烦了。”\n\n...\n\n...',
	    factionTitle: '八部浮屠',
	    windows: { windows_height: 0, windows_width: 0, pixelRatio: 1 },
	    touches: { lastX: 0, lastY: 0 },
	    move_direction: 0, //0代表左滑动，1代表右滑动
	    leftValue: 0,
	    pageIndex: 1,
	    maxPageNum: 0,
	    newestSectionNum: 1412,
	    allSliderValue: { section: 200, bright: 80, font: 32 }, //font单位rpx
	    isShowFontSelector: 0, //是否显示选择字体详情板块
	    isUseBrightModel: 0,
	    allFontFamily: ['微软雅黑', '黑体', 'Arial', '楷体', '等线'],
	    currentFontFamily: '等线',
	    lineHeight: 36, //单位rpx
	    control: { all: 0, control_tab: 0, control_detail: 0, target: '' }, //all表示整个控制是否显示，第一点击显示，再一次点击不显示;target表示显示哪一个detail
	    colorStyle: { content_bg: '#f5f9fc', styleNum: 1, slider_bg: '#fd9941', slider_none_bg: '#dbdbdb', control_bg: '#ffffff', control_fontColor: '#fd9941' } },
	  onReady: function onReady() {
	    var self = this;
	    //获取屏幕的高度和宽度，为分栏做准备
	    wx.getSystemInfo({
	      success: function success(res) {
	        self.setData({ windows: { windows_height: res.windowHeight, windows_width: res.windowWidth, pixelRatio: res.pixelRatio } });
	      }
	    });
	    var maxPageNum = countPageNum(self.data.content, self.data.allSliderValue.font, self.data.lineHeight, self.data.windows.windows_width, self.data.windows.windows_height, self.data.windows.pixelRatio);
	    self.setData({ maxPageNum: maxPageNum });
	  },
	  onLoad: function onLoad(options) {
	    var self = this;
	    //动态设置标题
	    var factionName = options.factionName || "大主宰";
	    wx.setNavigationBarTitle({
	      title: factionName,
	      fail: function fail() {
	        //todo 显示错误页面
	      }
	    });
	  },
	  //重新显示页面执行函数
	  onShow: function onShow() {
	    var self = this;
	    //读取用户设置
	    wx.getStorage({
	      key: 'reader_setting',
	      success: function success(res) {
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
	  onHide: function onHide() {
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
	      wx.setStorage('reader_setting', (0, _stringify2.default)(userSetting));
	    } catch (e) {
	      console.log(e);
	    }
	  },
	  handletouchmove: function handletouchmove(event) {
	    // console.log('正在执行touchmove, isMoving为：'+isMoving);
	    var self = this;
	    if (currentGesture != 0 || isMoving == 1) {
	      return;
	    }
	    var currentX = event.touches[0].pageX;
	    var currentY = event.touches[0].pageY;
	    // 判断用没有滑动而是点击屏幕的动作
	    hasRunTouchMove = true;
	    console.log('正在执行touchmove, isMoving为：' + isMoving + '------event: {x: ' + event.touches[0].pageX + ' ,y: ' + event.touches[0].pageY + '}');
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
	  handletouchtart: function handletouchtart(event) {
	    // 判断用户的点击事件，如果不是滑动，将不会执行touchmove
	    hasRunTouchMove = false;
	    // console.log('正在执行touchtart, isMoving为：'+isMoving+'------event: {x: '+event.touches[0].pageX+' ,y: '+event.touches[0].pageY+'}');
	    // console.log('正在执行touchtart, isMoving为：'+isMoving);
	    if (isMoving == 0) {
	      this.setData({ touches: { lastX: event.touches[0].pageX, lastY: event.touches[0].pageY } });
	    }
	  },
	  handletouchend: function handletouchend() {
	    console.log('正在执行touchend, isMoving为：' + isMoving);
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
	          pingjunValue = Math.abs(targetLeftValue - self.data.leftValue) / 4; //500ms其实函数只执行了4次，第一次会等待100ms才会开始函数
	          isMoving = 1; //开始计时的时候将标志置1
	          //使用计时器实现动画效果
	          // console.log('开始向 左 滑动的计时器，isMoving为1');
	          moveTime = setInterval(function () {
	            ++leftTimmerCount;
	            var currentLeftValue = self.data.leftValue;
	            //如果达到了目标值，立即停止计时器
	            //调试发现有些时候这个if的跳转会莫名的不成立，所以做个限制，函数被执行了4次之后，无论条件是否成立，将leftValue设置为目标值，并结束计时器
	            if (leftTimmerCount == 4) {
	              clearInterval(moveTime);
	              isMoving = 0;
	              leftTimmerCount = 0;
	              self.setData({ leftValue: targetLeftValue });
	              return;
	            }
	            if (currentLeftValue == targetLeftValue) {
	              clearInterval(moveTime);
	              isMoving = 0;
	              leftTimmerCount = 0;
	              // console.log('向 左 滑动的计时器结束了，isMoving为0');
	              return;
	            }
	            self.setData({ leftValue: currentLeftValue - pingjunValue });
	          }, 75);
	          self.setData({ pageIndex: ++currentIndex });
	        }
	      } else {
	        //前一页和后一页相差其实是2个-320px
	        if (currentIndex > 1) {
	          targetLeftValue = -1 * self.data.windows.windows_width * (currentIndex - 2);
	          pingjunValue = Math.abs(targetLeftValue - self.data.leftValue) / 4;
	          isMoving = 1;
	          // console.log('开始向 左 滑动的计时器，isMoving为1');
	          moveTime = setInterval(function () {
	            ++rightTimmerCount;
	            var currentLeftValue = self.data.leftValue;
	            if (rightTimmerCount == 4) {
	              clearInterval(moveTime);
	              isMoving = 0;
	              rightTimmerCount = 0;
	              self.setData({ leftValue: targetLeftValue });
	              return;
	            }
	            if (currentLeftValue == targetLeftValue) {
	              clearInterval(moveTime);
	              isMoving = 0;
	              rightTimmerCount = 0;
	              // console.log('向 右 滑动的计时器结束了，isMoving为0');
	              return;
	            }
	            self.setData({ leftValue: currentLeftValue + pingjunValue });
	          }, 75);
	          self.setData({ pageIndex: --currentIndex });
	        }
	      }
	    } else {}
	  },
	  sectionSliderChange: function sectionSliderChange(event) {
	    var self = this;
	    self.setData({ allSliderValue: { section: event.detail.value, bright: self.data.allSliderValue.bright, font: self.data.allSliderValue.font } });
	  },
	  brightSliderChange: function brightSliderChange(event) {
	    var self = this;
	    self.setData({ allSliderValue: { section: self.data.allSliderValue.section, bright: event.detail.value, font: self.data.allSliderValue.font } });
	    //亮度调节，其实是使用一个黑色的cover调节透明度，这里需要给出提示，使用亮度调节会失去当前颜色背景
	    if (self.data.isUseBrightModel == '0') {
	      wx.showModal({
	        title: '提示',
	        content: '使用亮度调节，会将背景模式还原至最初模式，建议使用系统的亮度调节',
	        success: function success(res) {
	          if (res.confirm) {
	            self.setData({ isUseBrightModel: 1, colorStyle: { content_bg: '#f5f9fc', styleNum: 1, slider_bg: '#fd9941', slider_none_bg: '#dbdbdb', control_bg: '#ffffff', control_fontColor: '#fd9941' } });
	          }
	        }
	      });
	    }
	  },
	  fontSliderChange: function fontSliderChange(event) {
	    var self = this;
	    self.setData({ allSliderValue: { section: self.data.allSliderValue.section, bright: self.data.allSliderValue.section, font: event.detail.value } });
	    //重新计算分页
	    var maxPageNum = countPageNum(self.data.content, event.detail.value, self.data.lineHeight, self.data.windows.windows_width, self.data.windows.windows_height, self.data.windows.pixelRatio);
	    self.setData({ maxPageNum: maxPageNum });
	  },
	  gotoControlDetail: function gotoControlDetail(event) {
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
	  switchColorStyle: function switchColorStyle(event) {
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
	  selectFontFamily: function selectFontFamily() {
	    this.setData({ isShowFontSelector: 1 });
	  },
	  closeFontSelector: function closeFontSelector() {
	    this.setData({ isShowFontSelector: 0 });
	  },
	  changeFontFamily: function changeFontFamily(event) {
	    this.setData({ currentFontFamily: event.currentTarget.dataset.fontname });
	    //todo 执行改变字体后的重新排版
	  },
	  testSaveUserSetting: function testSaveUserSetting() {
	    wx.navigateTo({
	      url: '/pages/shop/shop'
	    });
	  }
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(3), __esModule: true };

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(4)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// 处理数据的请求
	'use strict';

	var _keys = __webpack_require__(6);

	var _keys2 = _interopRequireDefault(_keys);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var HOST_URL = 'http://localhost:3000/api';
	var LOGIN = '/as_users/login';
	var GET_FACTION_LIST = '/factionlists';
	var GET_FACTION_DETAIL_BY_ID = '/factionlists/';
	var GET_CONTENT_BY_ID = '/factioncontents/';
	var GET_EMAILS_PAGEID = '/emails';
	var GET_BOOKS_SORTBY_TIME = '/xxxx';
	var GET_RANK = '/xs_rank/getRank';

	function obj2url(obj) {
		if (obj instanceof Object) {
			return (0, _keys2.default)(obj).map(function (k) {
				return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
			}).join('&');
		} else {
			console.err(obj + "，不是一个对象!");
			return '';
		}
	}

	module.exports = {
		//获取列表数据
		getFactionList: function getFactionList() {
			return HOST_URL + GET_FACTION_LIST;
		},
		getFactionDetailById: function getFactionDetailById(id) {
			return HOST_URL + GET_FACTION_DETAIL_BY_ID + id;
		},
		//获取页面数据内容
		// getTopicByID: function(id, obj){
		// 	return HOST_URL + GET_CONTENT_BY_ID + id + '?' + obj2url(obj);
		// }
		getContentByID: function getContentByID(id) {
			return HOST_URL + GET_CONTENT_BY_ID + id;
		},
		login: function login(umt, password) {
			return HOST_URL + LOGIN;
		},
		getEmailsByPageid: function getEmailsByPageid(pageid) {
			return HOST_URL + GET_FACTION_DETAIL_BY_ID + '?pageid=' + pageid;
		},
		//根据时间分类用户的书籍
		getBooksSortByTime: function getBooksSortByTime(timeObj) {
			if (timeObj.timeType && timeObj.timeValue) {
				return HOST_URL + GET_BOOKS_SORTBY_TIME + '?timeType=' + timeObj.timeType + '&timeValue=' + timeObj.timeValue;
			} else {
				console.log('根据时间分类用户的书籍 传入参数错误');
			}
		},
		getRank: function getRank(rankType) {
			return HOST_URL + GET_RANK + '?rankType=' + rankType;
		}
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(7), __esModule: true };

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(8);
	module.exports = __webpack_require__(4).Object.keys;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(9)
	  , $keys    = __webpack_require__(11);

	__webpack_require__(26)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(10);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(12)
	  , enumBugKeys = __webpack_require__(25);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(13)
	  , toIObject    = __webpack_require__(14)
	  , arrayIndexOf = __webpack_require__(17)(false)
	  , IE_PROTO     = __webpack_require__(21)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(15)
	  , defined = __webpack_require__(10);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(16);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(14)
	  , toLength  = __webpack_require__(18)
	  , toIndex   = __webpack_require__(20);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(19)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(19)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(22)('keys')
	  , uid    = __webpack_require__(24);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(23)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 24 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(27)
	  , core    = __webpack_require__(4)
	  , fails   = __webpack_require__(36);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(23)
	  , core      = __webpack_require__(4)
	  , ctx       = __webpack_require__(28)
	  , hide      = __webpack_require__(30)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(29);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(31)
	  , createDesc = __webpack_require__(39);
	module.exports = __webpack_require__(35) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(32)
	  , IE8_DOM_DEFINE = __webpack_require__(34)
	  , toPrimitive    = __webpack_require__(38)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(35) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(33);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(35) && !__webpack_require__(36)(function(){
	  return Object.defineProperty(__webpack_require__(37)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(36)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(33)
	  , document = __webpack_require__(23).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(33);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _es6Promise = __webpack_require__(41);

	var _es6Promise2 = _interopRequireDefault(_es6Promise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//判断用户填写的是username还是email
	function judgeTelOrName(str) {
	  var phoneRegExp = new RegExp('^1[3|4|5|8][0-9]\d{4,8}$', 'g');
	  var usernameRegExp = new RegExp('^(?![^a-zA-Z_]+$)(?!\D+$).{6,18}$', 'g');
	  if (usernameRegExp.test(str)) {
	    return 'using_name';
	  } else if (phoneRegExp.test(str)) {
	    return 'using_email';
	  } else {
	    return 'error';
	  }
	}

	function eNumToCNum(num) {
	  if (typeof num == "number") {
	    switch (num) {
	      case 0:
	        return '一';
	        break;
	      case 1:
	        return '二';
	        break;
	      case 2:
	        return '三';
	        break;
	      case 3:
	        return '四';
	        break;
	      case 4:
	        return '五';
	        break;
	      case 5:
	        return '六';
	        break;
	      case 6:
	        return '七';
	        break;
	      case 7:
	        return '八';
	        break;
	      case 8:
	        return '九';
	        break;
	      case 9:
	        return '十';
	        break;
	      case 10:
	        return '十一';
	        break;
	      case 11:
	        return '十二';
	        break;
	    }
	  } else {
	    console.log("传入的参数不是数字.");
	    return '';
	  }
	}
	//格式化时间函数01
	function formatTime(date) {
	  var year = date.getFullYear();
	  var month = date.getMonth() + 1;
	  var day = date.getDate();

	  var hour = date.getHours();
	  var minute = date.getMinutes();
	  var second = date.getSeconds();

	  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
	}
	//格式化时间函数02
	function formatTime2(time) {
	  if (typeof time !== 'number' || time < 0) {
	    return time;
	  }

	  var hour = parseInt(time / 3600);
	  time = time % 3600;
	  var minute = parseInt(time / 60);
	  time = time % 60;
	  var second = time;

	  return [hour, minute, second].map(function (n) {
	    n = n.toString();
	    return n[1] ? n : '0' + n;
	  }).join(':');
	}

	function formatNumber(n) {
	  n = n.toString();
	  return n[1] ? n : '0' + n;
	}

	function getDateStr(date) {
	  if (!date) return '';
	  return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
	}

	/**
	 * 生成GUID序列号
	 * @returns {string} GUID
	 */
	function guid() {
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	    var r = Math.random() * 16 | 0,
	        v = c == 'x' ? r : r & 0x3 | 0x8;
	    return v.toString(16);
	  });
	}

	/**
	 * 记录日志
	 * @param {Mixed} 记录的信息
	 * @returns {Void}
	 */
	function log(msg) {
	  if (!msg) return;
	  if (getApp().settings['debug']) console.log(msg);
	  var logs = wx.getStorageSync('logs') || [];
	  logs.unshift(msg);
	  wx.setStorageSync('logs', logs);
	}

	/**
	 * @param {Function} func 接口
	 * @param {Object} options 接口参数
	 * @returns {Promise} Promise对象
	*/
	function promiseHandle(func, options) {
	  options = options || {};
	  return new _es6Promise2.default(function (resolve, reject) {
	    if (typeof func !== 'function') reject();
	    options.success = resolve;
	    options.fail = reject;
	    func(options);
	  });
	}

	//导出以上函数
	module.exports = {
	  formatTime: formatTime,
	  formatTime2: formatTime2,
	  judgeTelOrName: judgeTelOrName,
	  eNumToCNum: eNumToCNum,
	  guid: guid,
	  log: log,
	  promiseHandle: promiseHandle,
	  getDateStr: getDateStr,
	  formatNumber: formatNumber
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;/* WEBPACK VAR INJECTION */(function(process, global) {"use strict";

	var _typeof2 = __webpack_require__(43);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	!function (t, e) {
	  "object" == ( false ? "undefined" : (0, _typeof3.default)(exports)) && "undefined" != typeof module ? module.exports = e() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (e), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : t.ES6Promise = e();
	}(undefined, function () {
	  "use strict";
	  function t(t) {
	    return "function" == typeof t || "object" == (typeof t === "undefined" ? "undefined" : (0, _typeof3.default)(t)) && null !== t;
	  }function e(t) {
	    return "function" == typeof t;
	  }function n(t) {
	    I = t;
	  }function r(t) {
	    J = t;
	  }function o() {
	    return function () {
	      return process.nextTick(a);
	    };
	  }function i() {
	    return "undefined" != typeof H ? function () {
	      H(a);
	    } : c();
	  }function s() {
	    var t = 0,
	        e = new V(a),
	        n = document.createTextNode("");return e.observe(n, { characterData: !0 }), function () {
	      n.data = t = ++t % 2;
	    };
	  }function u() {
	    var t = new MessageChannel();return t.port1.onmessage = a, function () {
	      return t.port2.postMessage(0);
	    };
	  }function c() {
	    var t = setTimeout;return function () {
	      return t(a, 1);
	    };
	  }function a() {
	    for (var t = 0; t < G; t += 2) {
	      var e = $[t],
	          n = $[t + 1];e(n), $[t] = void 0, $[t + 1] = void 0;
	    }G = 0;
	  }function f() {
	    try {
	      var t = require,
	          e = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"vertx\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));return H = e.runOnLoop || e.runOnContext, i();
	    } catch (n) {
	      return c();
	    }
	  }function l(t, e) {
	    var n = arguments,
	        r = this,
	        o = new this.constructor(p);void 0 === o[et] && k(o);var i = r._state;return i ? !function () {
	      var t = n[i - 1];J(function () {
	        return x(i, o, t, r._result);
	      });
	    }() : E(r, o, t, e), o;
	  }function h(t) {
	    var e = this;if (t && "object" == (typeof t === "undefined" ? "undefined" : (0, _typeof3.default)(t)) && t.constructor === e) return t;var n = new e(p);return g(n, t), n;
	  }function p() {}function v() {
	    return new TypeError("You cannot resolve a promise with itself");
	  }function d() {
	    return new TypeError("A promises callback cannot return that same promise.");
	  }function _(t) {
	    try {
	      return t.then;
	    } catch (e) {
	      return it.error = e, it;
	    }
	  }function y(t, e, n, r) {
	    try {
	      t.call(e, n, r);
	    } catch (o) {
	      return o;
	    }
	  }function m(t, e, n) {
	    J(function (t) {
	      var r = !1,
	          o = y(n, e, function (n) {
	        r || (r = !0, e !== n ? g(t, n) : S(t, n));
	      }, function (e) {
	        r || (r = !0, j(t, e));
	      }, "Settle: " + (t._label || " unknown promise"));!r && o && (r = !0, j(t, o));
	    }, t);
	  }function b(t, e) {
	    e._state === rt ? S(t, e._result) : e._state === ot ? j(t, e._result) : E(e, void 0, function (e) {
	      return g(t, e);
	    }, function (e) {
	      return j(t, e);
	    });
	  }function w(t, n, r) {
	    n.constructor === t.constructor && r === l && n.constructor.resolve === h ? b(t, n) : r === it ? j(t, it.error) : void 0 === r ? S(t, n) : e(r) ? m(t, n, r) : S(t, n);
	  }function g(e, n) {
	    e === n ? j(e, v()) : t(n) ? w(e, n, _(n)) : S(e, n);
	  }function A(t) {
	    t._onerror && t._onerror(t._result), T(t);
	  }function S(t, e) {
	    t._state === nt && (t._result = e, t._state = rt, 0 !== t._subscribers.length && J(T, t));
	  }function j(t, e) {
	    t._state === nt && (t._state = ot, t._result = e, J(A, t));
	  }function E(t, e, n, r) {
	    var o = t._subscribers,
	        i = o.length;t._onerror = null, o[i] = e, o[i + rt] = n, o[i + ot] = r, 0 === i && t._state && J(T, t);
	  }function T(t) {
	    var e = t._subscribers,
	        n = t._state;if (0 !== e.length) {
	      for (var r = void 0, o = void 0, i = t._result, s = 0; s < e.length; s += 3) {
	        r = e[s], o = e[s + n], r ? x(n, r, o, i) : o(i);
	      }t._subscribers.length = 0;
	    }
	  }function M() {
	    this.error = null;
	  }function P(t, e) {
	    try {
	      return t(e);
	    } catch (n) {
	      return st.error = n, st;
	    }
	  }function x(t, n, r, o) {
	    var i = e(r),
	        s = void 0,
	        u = void 0,
	        c = void 0,
	        a = void 0;if (i) {
	      if (s = P(r, o), s === st ? (a = !0, u = s.error, s = null) : c = !0, n === s) return void j(n, d());
	    } else s = o, c = !0;n._state !== nt || (i && c ? g(n, s) : a ? j(n, u) : t === rt ? S(n, s) : t === ot && j(n, s));
	  }function C(t, e) {
	    try {
	      e(function (e) {
	        g(t, e);
	      }, function (e) {
	        j(t, e);
	      });
	    } catch (n) {
	      j(t, n);
	    }
	  }function O() {
	    return ut++;
	  }function k(t) {
	    t[et] = ut++, t._state = void 0, t._result = void 0, t._subscribers = [];
	  }function Y(t, e) {
	    this._instanceConstructor = t, this.promise = new t(p), this.promise[et] || k(this.promise), B(e) ? (this._input = e, this.length = e.length, this._remaining = e.length, this._result = new Array(this.length), 0 === this.length ? S(this.promise, this._result) : (this.length = this.length || 0, this._enumerate(), 0 === this._remaining && S(this.promise, this._result))) : j(this.promise, q());
	  }function q() {
	    return new Error("Array Methods must be provided an Array");
	  }function F(t) {
	    return new Y(this, t).promise;
	  }function D(t) {
	    var e = this;return new e(B(t) ? function (n, r) {
	      for (var o = t.length, i = 0; i < o; i++) {
	        e.resolve(t[i]).then(n, r);
	      }
	    } : function (t, e) {
	      return e(new TypeError("You must pass an array to race."));
	    });
	  }function K(t) {
	    var e = this,
	        n = new e(p);return j(n, t), n;
	  }function L() {
	    throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
	  }function N() {
	    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	  }function U(t) {
	    this[et] = O(), this._result = this._state = void 0, this._subscribers = [], p !== t && ("function" != typeof t && L(), this instanceof U ? C(this, t) : N());
	  }function W() {
	    var t = void 0;if ("undefined" != typeof global) t = global;else if ("undefined" != typeof self) t = self;else try {
	      t = Function("return this")();
	    } catch (e) {
	      throw new Error("polyfill failed because global object is unavailable in this environment");
	    }var n = t.Promise;if (n) {
	      var r = null;try {
	        r = Object.prototype.toString.call(n.resolve());
	      } catch (e) {}if ("[object Promise]" === r && !n.cast) return;
	    }t.Promise = U;
	  }var z = void 0;z = Array.isArray ? Array.isArray : function (t) {
	    return "[object Array]" === Object.prototype.toString.call(t);
	  };var B = z,
	      G = 0,
	      H = void 0,
	      I = void 0,
	      J = function J(t, e) {
	    $[G] = t, $[G + 1] = e, G += 2, 2 === G && (I ? I(a) : tt());
	  },
	      Q = "undefined" != typeof window ? window : void 0,
	      R = Q || {},
	      V = R.MutationObserver || R.WebKitMutationObserver,
	      X = "undefined" == typeof self && "undefined" != typeof process && "[object process]" === {}.toString.call(process),
	      Z = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
	      $ = new Array(1e3),
	      tt = void 0;tt = X ? o() : V ? s() : Z ? u() : void 0 === Q && "function" == "function" ? f() : c();var et = Math.random().toString(36).substring(16),
	      nt = void 0,
	      rt = 1,
	      ot = 2,
	      it = new M(),
	      st = new M(),
	      ut = 0;return Y.prototype._enumerate = function () {
	    for (var t = this.length, e = this._input, n = 0; this._state === nt && n < t; n++) {
	      this._eachEntry(e[n], n);
	    }
	  }, Y.prototype._eachEntry = function (t, e) {
	    var n = this._instanceConstructor,
	        r = n.resolve;if (r === h) {
	      var o = _(t);if (o === l && t._state !== nt) this._settledAt(t._state, e, t._result);else if ("function" != typeof o) this._remaining--, this._result[e] = t;else if (n === U) {
	        var i = new n(p);w(i, t, o), this._willSettleAt(i, e);
	      } else this._willSettleAt(new n(function (e) {
	        return e(t);
	      }), e);
	    } else this._willSettleAt(r(t), e);
	  }, Y.prototype._settledAt = function (t, e, n) {
	    var r = this.promise;r._state === nt && (this._remaining--, t === ot ? j(r, n) : this._result[e] = n), 0 === this._remaining && S(r, this._result);
	  }, Y.prototype._willSettleAt = function (t, e) {
	    var n = this;E(t, void 0, function (t) {
	      return n._settledAt(rt, e, t);
	    }, function (t) {
	      return n._settledAt(ot, e, t);
	    });
	  }, U.all = F, U.race = D, U.resolve = h, U.reject = K, U._setScheduler = n, U._setAsap = r, U._asap = J, U.prototype = { constructor: U, then: l, "catch": function _catch(t) {
	      return this.then(null, t);
	    } }, U.polyfill = W, U.Promise = U, U;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(42), (function() { return this; }())))

/***/ },
/* 42 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(44);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(64);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(45), __esModule: true };

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(46);
	__webpack_require__(59);
	module.exports = __webpack_require__(63).f('iterator');

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(47)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(48)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(19)
	  , defined   = __webpack_require__(10);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(49)
	  , $export        = __webpack_require__(27)
	  , redefine       = __webpack_require__(50)
	  , hide           = __webpack_require__(30)
	  , has            = __webpack_require__(13)
	  , Iterators      = __webpack_require__(51)
	  , $iterCreate    = __webpack_require__(52)
	  , setToStringTag = __webpack_require__(56)
	  , getPrototypeOf = __webpack_require__(58)
	  , ITERATOR       = __webpack_require__(57)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(30);

/***/ },
/* 51 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(53)
	  , descriptor     = __webpack_require__(39)
	  , setToStringTag = __webpack_require__(56)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(30)(IteratorPrototype, __webpack_require__(57)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(32)
	  , dPs         = __webpack_require__(54)
	  , enumBugKeys = __webpack_require__(25)
	  , IE_PROTO    = __webpack_require__(21)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(37)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(55).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(31)
	  , anObject = __webpack_require__(32)
	  , getKeys  = __webpack_require__(11);

	module.exports = __webpack_require__(35) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(23).document && document.documentElement;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(31).f
	  , has = __webpack_require__(13)
	  , TAG = __webpack_require__(57)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(22)('wks')
	  , uid        = __webpack_require__(24)
	  , Symbol     = __webpack_require__(23).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(13)
	  , toObject    = __webpack_require__(9)
	  , IE_PROTO    = __webpack_require__(21)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(60);
	var global        = __webpack_require__(23)
	  , hide          = __webpack_require__(30)
	  , Iterators     = __webpack_require__(51)
	  , TO_STRING_TAG = __webpack_require__(57)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(61)
	  , step             = __webpack_require__(62)
	  , Iterators        = __webpack_require__(51)
	  , toIObject        = __webpack_require__(14);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(48)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(57);

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(65), __esModule: true };

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(66);
	__webpack_require__(77);
	__webpack_require__(78);
	__webpack_require__(79);
	module.exports = __webpack_require__(4).Symbol;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(23)
	  , has            = __webpack_require__(13)
	  , DESCRIPTORS    = __webpack_require__(35)
	  , $export        = __webpack_require__(27)
	  , redefine       = __webpack_require__(50)
	  , META           = __webpack_require__(67).KEY
	  , $fails         = __webpack_require__(36)
	  , shared         = __webpack_require__(22)
	  , setToStringTag = __webpack_require__(56)
	  , uid            = __webpack_require__(24)
	  , wks            = __webpack_require__(57)
	  , wksExt         = __webpack_require__(63)
	  , wksDefine      = __webpack_require__(68)
	  , keyOf          = __webpack_require__(69)
	  , enumKeys       = __webpack_require__(70)
	  , isArray        = __webpack_require__(73)
	  , anObject       = __webpack_require__(32)
	  , toIObject      = __webpack_require__(14)
	  , toPrimitive    = __webpack_require__(38)
	  , createDesc     = __webpack_require__(39)
	  , _create        = __webpack_require__(53)
	  , gOPNExt        = __webpack_require__(74)
	  , $GOPD          = __webpack_require__(76)
	  , $DP            = __webpack_require__(31)
	  , $keys          = __webpack_require__(11)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(75).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(72).f  = $propertyIsEnumerable;
	  __webpack_require__(71).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(49)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(30)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(24)('meta')
	  , isObject = __webpack_require__(33)
	  , has      = __webpack_require__(13)
	  , setDesc  = __webpack_require__(31).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(36)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(23)
	  , core           = __webpack_require__(4)
	  , LIBRARY        = __webpack_require__(49)
	  , wksExt         = __webpack_require__(63)
	  , defineProperty = __webpack_require__(31).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(11)
	  , toIObject = __webpack_require__(14);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(11)
	  , gOPS    = __webpack_require__(71)
	  , pIE     = __webpack_require__(72);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 71 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 72 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(16);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(14)
	  , gOPN      = __webpack_require__(75).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(12)
	  , hiddenKeys = __webpack_require__(25).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(72)
	  , createDesc     = __webpack_require__(39)
	  , toIObject      = __webpack_require__(14)
	  , toPrimitive    = __webpack_require__(38)
	  , has            = __webpack_require__(13)
	  , IE8_DOM_DEFINE = __webpack_require__(34)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(35) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 77 */
/***/ function(module, exports) {

	

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(68)('asyncIterator');

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(68)('observable');

/***/ }
/******/ ]);