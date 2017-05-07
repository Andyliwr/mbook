//login.js
// import showErrMsg from '../../../utils/util';
import { getMulu, getContentById } from '../../../utils/api/api';
var currentGesture  = 0; //控制当一个手势进行的时候屏蔽其他的手势
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
function countPageNum(str, fontSize, lineHeight, windowW, windowH, pixelRatio){
  var returnNum = 0;
  fontSize = fontSize/pixelRatio;
  lineHeight = lineHeight/pixelRatio;
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
  strArray.forEach(function(item, index){
    //拒绝最后一项0
    var huanhangNum = (splitArray[index]-1) > 0? (splitArray[index]-1) > 0: 0;
    totalHeight += Math.ceil(item.length/Math.floor((windowW-80/pixelRatio)/fontSize))*lineHeight + huanhangNum*lineHeight;
  });
  return Math.ceil(totalHeight/windowH)+1;
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
function getMuluFun(bookid, sectionnum, obj, success, fail, preOrNext){
  //发送ajax得到这本小说的所有章节
  var oldSectionData = obj.data.allSectionData;
  wx.request({
    url: getMulu(bookid, sectionnum), //仅为示例，并非真实的接口地址
    success: function(res) {
      try{
        var tmpData = res.data.data;
        //allSectionData像是一个队列，并不是一直加上接口获取的新数据，有一个最大值，当超过这个最大值，会在首尾删减多于的值
        if(oldSectionData.length == 0){
          obj.setData({allSectionData: tmpData.sectionArray, headImg: tmpData.headImg});
        }else{
          //如果是向前翻页，数据应该插到顶部
          if(preOrNext == 'pre'){
            obj.setData({allSectionData: tmpData.sectionArray.concat(oldSectionData)});
          }else if(preOrNext == 'next'){
            obj.setData({allSectionData: oldSectionData.concat(tmpData.sectionArray)});
          }
        }
        //处理回调
        if(typeof success == "function"){
          success(obj);
        }
      }catch(e){
        console.log(e);
          if(typeof fail == "function"){
          fail(obj);
        }
      }
    },
    fail: function(err){
      console.log(err);
      //处理回调
      if(typeof fail == "function"){
        fail(obj);
      }
    }
  })
}

Page({
    data: {
      bookid: '',
      factionName: '',
      headImg: '', // 小说图像
      content: '第一千四百一十二章\n\n\n当牧尘的身影落在了黑光长老所在的那座白玉石台时，整个天地间，依旧还处于先前的震撼之中，所有人都是一片沉默。\n\n这种沉默持续了许久，终于是有着人有些艰难的开口喃喃道：“那是...传闻中大千世界三十六道绝世神通之一的八部浮屠吧？”\n\n在场的这些各方超级势力，自然也是阅历非凡，所以很快的，也是渐渐的认出了先前牧尘所施展出来的那惊天动地的神通。\n\n那道幽黑光束所具备的毁灭力，看得众多天至尊都是头皮发麻，而如此威能的神通之术，除了那名震大千世界的三十六道绝世神通外，还能是什么？\n\n“没想到，他竟然真的将八部浮屠修炼成功了。”那些浮屠古族的长老，特别是玄脉与墨脉的，更是眼睛通红，无比嫉妒的望着牧尘，那模样，仿佛是恨不得将这般神通抢夺过来一般。\n\n因为身为天至尊，他们非常清楚那三十六道绝世神通对于他们而言究竟代表着什么，若是拥有，他们同样是能够无敌于同级之中。\n\n想想看，大千世界究竟有多少天至尊，然而那最顶尖的神通，却唯有这三十六道，由此可见其价值。\n\n就算是他们浮屠古族这深不可测的底蕴，能够媲美这三十六道绝世神通的神通之术，都是屈指可数。\n\n在那先前牧尘所在的山峰，清霜玉手紧紧的捂住嘴巴，此时的激动，连她素来的冰冷都是再维持不住，娇躯颤抖。\n\n原本以为他们清脉此次将会是毁灭般的打击，但谁料到竟会峰回路转，牧尘的横空出世，居然有着要将这般大势扭转过来的迹象。\n\n“牧尘，加油啊！”清霜喃喃道。\n\n在她身旁，灵溪倒是微笑着拍了拍她的香肩，让得后者有些不好意思的一笑，渐渐的冷静下来。\n\n“灵溪姐，牧尘能赢吗？”清霜带着一丝期盼的问道，虽然她知道，即便赢了两场，但牧尘接下来要面对的对手，却会更强。\n\n灵溪清浅一笑，温婉优雅，道：“放心吧，牧尘既然会出手，那自然有着他的把握，我们只需要等着便行了。”\n\n清霜用力的点了点头，美目凝视着远处那道身影，眸子中异彩流溢。\n\n而在另外一座山峰上，林静拍着玉手用力的鼓掌，笑盈盈的道：“牧尘赢得太漂亮了。”\n\n这两场战斗，牧尘完全没有丝毫试探的意思，一出手便是倾尽全力，甚至不惜暴露底牌，而如此一来，那战绩也是辉煌震撼得很，两招下来，赢得干脆利落，让人看得也是有些热血沸腾。\n\n一旁的萧潇也是螓首轻点，眸子中满是欣赏之色。\n\n“看来牧尘对这浮屠古族怨气很大啊。”倒是一旁的药尘呵呵一笑，他的眼力何等的老辣，一眼就看了出来，这是牧尘故意为之，因为他今日而来，本就是为了心中那口隐忍二十多年的一口气，这口气，为了他，为了他那夫妻分离，孤寂多年的爹，也为了他那被囚禁多年，不见天日的母亲，所以他要的胜利，不是那种势均力敌的激战，而是干脆利落，雷霆万钧。\n\n这样一来，那玄脉的脸面，可就丢得有点大了。\n\n“不过这种战斗方式，只能在有着绝对把握的情况下，若是两者战斗相仿，谁先暴露底牌，怕就得失去一些先机了。”林貂也是点评道，不过虽然这样说着，他的脸庞上，同样是有着欣赏之色，因为牧尘会选择这种战斗方式，那也就说明了他对自身的一种自信。\n\n这种自信，他也曾经在林动的身上见到过。\n\n...\n\n在那沉默的天地间，白玉石台上的黑光长老，也是面色有些阴沉的望着眼前信步而来的青年，望着后者，他眼神深处，也是掠过浓浓的忌惮之色。\n\n先前牧尘展现出来的手段，不管是那诡异的紫色火炎，还是那霸道无比的八部浮屠，都让得黑光长老心中泛着一丝惧意。\n\n他的实力，比玄海，玄风都要强，乃是灵品后期，但在面对着此时锐气逼人的牧尘时，他依旧是没有多少的底气。\n\n“该死，这个家伙怎么现在变得如此之强！”\n\n黑光心中怒骂，旋即生出一些后悔之意，他后悔的并不是为什么要招惹牧尘，而是后悔当初牧尘只是大圆满时，他为何不果决一些，直接出杀手。\n\n即便不必真的将其斩杀，但起码也要将其一身修为给废了，让得他从此变成一个废物，如此的话，也就没了今日的灾劫。\n\n“你是在想为什么当初没杀了我吗？”而在黑光目光闪烁的时候，牧尘盯着他，却是一笑，说道。\n\n黑光闻言，顿时哆嗦了一下，他能够感觉到，牧尘虽然在笑，在那言语间，却是弥漫着无尽的寒气甚至杀意。\n\n不过他毕竟也是浮屠古族的长老，地位显赫，很快渐渐的平复了心情，阴沉的盯着牧尘，道：“牧尘，你做事可不要太过分了，年轻人有锐气是好事，但若是太过，恐怕就得过刚易折了。”\n\n“你玄脉若是有本事，那就折给我看看吧。”牧尘漫不经心的道。\n\n“你！”\n\n黑光一怒，但瞧得牧尘那冰冷目光时，心头又是一悸，不由得羞恼至极。\n\n“还不出手吗？”牧尘盯着他，语气淡漠，然后他伸出手掌，修长如白玉，其上灵光跳跃：“若是不出手的话，那我就要动手了。”\n\n黑光闻言，恼怒得咬牙切齿，而就当他准备运转灵力时，忽有一道传音，落入耳中：“黑光，催动秘法，全力出手，即便不胜，也要将其锐气尽挫，接下来，自会有人收拾他。”\n\n听到这道传音，黑光目光顿时一闪，眼睛不着痕迹的扫了玄脉脉首玄光一眼，这道传音，显然就是来自于后者。\n\n“要催动秘法吗？”黑光踌躇了一下，一旦如此做的话，就算是以他天至尊的恢复力，也起码得虚弱大半年的时间。\n\n不过他也明白玄光的意图，现在的牧尘锐气太甚了，他一场场的打下来，就算到时候无法取胜四场，但也足以让他们玄脉搞得灰头土脸。\n\n眼下众多超级势力在观礼，若是传出去的话，说他们玄脉，被一个罪子横扫，这无疑会将他们玄脉的颜面丢光。\n\n所以，不管如何，黑光都不能再让牧尘如先前那般取得势如破竹般的战绩。\n\n必须将其阻拦下来，破其锐气，而接下来的第四场，他们玄脉，就能够派出仙品天至尊，到时候，要收拾这牧尘，自然是易如反掌。\n\n“好！”\n\n心中踌躇了一下，黑光终于是狠狠一咬牙，在见识了先前牧尘的手段后，即便是他，也是没把握能够接下牧尘的攻势，既然如此，还不如拼命一搏。\n\n“小辈，今日就让你知晓，什么叫做过刚易折！”\n\n黑光心中冷声说道，旋即他身形陡然暴射而退，同时讥讽冷笑道：“牧尘，休要得意，今日你也接我一招试试！”\n\n轰！\n\n随着其音落，只见得黑光身后，亿万道灵光交织，一座巨大的至尊法相现出身来，浩瀚的灵力风暴，肆虐在天地间。\n\n这至尊法相一出现，黑光也是深深的吸了一口气，双手陡然结出一道古怪印法。\n\n同时，其身后的至尊法相，也是双手结印。\n\n在那远处，清天，清萱等长老见到这一幕，瞳孔顿时一缩，骇然道：“无耻！竟然是化灵秘法！”\n\n在他们骇然失声时，那黑光则是对着牧尘露出狠辣笑容，森然道：“既然你咄咄逼人，那也怪不得老夫心狠手辣了。”\n\n话音落下，他的肚子陡然鼓胀起来，同时他身后的至尊法相，也是鼓起巨大的肚子，下一刻，他张开嘴巴，猛然一吐。\n\n黑光与身后的至尊法相嘴中，竟是有着星辰般的洪流远远不断的奔腾而出，那等声势，犹如是能够磨灭万古。\n\n而随着那星河般的洪流不断的呼啸而出，只见得黑光的身躯迅速的干枯，而那至尊法相，也是开始黯淡无光，仿佛两者之中的所有力量，都是化为了那无尽星辰洪流。\n\n天地间，众多天至尊见到这一幕，都是忍不住的面色一变，失声道：“这黑光疯了，竟然将至尊法相都是分解了？！”\n\n至尊法相乃是天至尊最强的战力之一，若是自我分解，那就得再度重新凝炼，那所需要消耗的时间与精力可是不少，而且说不定还会有着损伤。\n\n所以一般这种手段，极少人会动用，那是真正的损人不利己，杀敌一千，自损一千的同归于尽之法。\n\n呼呼！\n\n天地间，星辰洪流呼啸而过，对着牧尘笼罩而去，那等威势，仿佛就算是日月，都将会被消磨而灭。\n\n众多强者神色凝重，先前牧尘的锐气太甚，所以这黑光才会以这种极端的方式，试图将其阻扰，坏其锐气，保住玄脉的颜面。\n\n“黑光可真是狠辣，这下子，那牧尘可是遇见麻烦了。”\n\n...\n\n...',
      factionTitle: '八部浮屠',
      windows: {windows_height: 0, windows_width: 0, pixelRatio: 1},
      touches: {lastX: 0, lastY: 0},
      move_direction: 0, //0代表左滑动，1代表右滑动
      leftValue: 0,
      pageIndex: 1,
      maxPageNum: 0,
      newestSectionNum: 1450,
      allSliderValue: {section: 1431, bright: 80, font: 32}, //font单位rpx
      isShowFontSelector: 0, //是否显示选择字体详情板块
      isUseBrightModel: 0,
      allFontFamily: ['微软雅黑','黑体','Arial','楷体', '等线'],
      currentFontFamily: '等线',
      lineHeight: 36, //单位rpx
      control: {all: 0, control_tab: 0, control_detail: 0, target: ''}, //all表示整个控制是否显示，第一点击显示，再一次点击不显示;target表示显示哪一个detail
      colorStyle: {content_bg: '#f5f9fc', styleNum:1, slider_bg: '#fd9941', slider_none_bg: '#dbdbdb', control_bg: '#ffffff', control_fontColor: '#fd9941'}, //1、2、3、4分别对应四种颜色模式
      isShowMulu: 0, // 是否显示左侧栏
      muluSwiperNum: 0, //目录的滑块显示第几块
      allSectionData: [], // 所有章节数据
      err_tips_data: {err_tips_show: false, err_tips_text: ''}
    },
    onReady: function(){
      var self = this;
      //获取屏幕的高度和宽度，为分栏做准备
      wx.getSystemInfo({
        success: function(res) {
          self.setData({windows: {windows_height: res.windowHeight, windows_width: res.windowWidth, pixelRatio: res.pixelRatio}});
        }
      });
      var maxPageNum = countPageNum(self.data.content, self.data.allSliderValue.font, self.data.lineHeight, self.data.windows.windows_width, self.data.windows.windows_height, self.data.windows.pixelRatio);
      self.setData({maxPageNum: maxPageNum});
    },
    onLoad: function(options) {
        var self = this;
        //动态设置标题
        var factionName = options.factionName || "超品战兵";
        var bookid = options.bookid;
        self.setData({bookid: bookid, factionName: factionName});
        wx.setNavigationBarTitle({
          title: factionName,
          fail: function(){
            //todo 显示错误页面
          }
        });
    },
    //重新显示页面执行函数
    onShow: function(){
      var self = this;
      //读取用户设置
      wx.getStorage({
        key: 'reader_setting',
        success: function(res) {
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
    onHide: function(){
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
        console.log(e);
      }
    },
    handletouchmove: function(event){
      // console.log('正在执行touchmove, isMoving为：'+isMoving);
      var self = this;
      if (currentGesture != 0 || isMoving == 1){
        return;
      }
      var currentX = event.touches[0].pageX;
      var currentY = event.touches[0].pageY;
      // 判断用没有滑动而是点击屏幕的动作
      hasRunTouchMove = true;
      console.log('正在执行touchmove, isMoving为：'+isMoving+'------event: {x: '+event.touches[0].pageX+' ,y: '+event.touches[0].pageY+'}');
      var direction = 0;
      if ((currentX - self.data.touches.lastX) < 0){
        direction = 0;
      }else if(((currentX - self.data.touches.lastX) > 0)){
        direction = 1;
      }
      //需要减少或者增加的值
      var moreOrLessValue = Math.abs(currentX - self.data.touches.lastX);
      //将当前坐标进行保存以进行下一次计算
      self.setData({touches: {lastX: currentX, lastY: currentY}, move_direction: direction});
      var currentIndex = self.data.pageIndex;
      if(direction == 0){
        if(currentIndex < self.data.maxPageNum){
          self.setData({leftValue: self.data.leftValue - moreOrLessValue});
        }
      }else{
        if(currentIndex > 1){
          self.setData({leftValue: self.data.leftValue + moreOrLessValue});
        }
      }
    },
    handletouchtart: function(event){
      // 判断用户的点击事件，如果不是滑动，将不会执行touchmove
      hasRunTouchMove = false;
      // console.log('正在执行touchtart, isMoving为：'+isMoving+'------event: {x: '+event.touches[0].pageX+' ,y: '+event.touches[0].pageY+'}');
      // console.log('正在执行touchtart, isMoving为：'+isMoving);
      if(isMoving == 0){
        this.setData({touches: {lastX: event.touches[0].pageX, lastY: event.touches[0].pageY}});
      }
    },
    handletouchend: function(){
      console.log('正在执行touchend, isMoving为：'+isMoving);
      var self = this;
      // 判断用户的点击事件，决定是否显示控制栏
      if(hasRunTouchMove == false){
      	var y = self.data.touches.lastY;
      	var x = self.data.touches.lastX;
      	var h = self.data.windows.windows_height/2;
      	var w = self.data.windows.windows_width/2;
      	if(x && y && y >= (h-50) && y <= (h+50) && x >= (w-60) && x <= (w+60)){
      		self.setData({control: {all: self.data.control.all == '0'? '1': '0', control_tab: 1, control_detail: 0, target: ''}, isShowFontSelector: 0});
      		return;
      	}
      }
      currentGesture = 0;
      //左滑动和有滑动的操作
      var currentIndex = self.data.pageIndex; //当前页数
      var targetLeftValue = null; //移动之后content的目标左值
      var pingjunValue = null; //500ms内平均每100ms移动的值
      if(isMoving == 0){
        if(self.data.move_direction == 0){
          if(currentIndex < self.data.maxPageNum){
            targetLeftValue = (-1)*self.data.windows.windows_width*currentIndex;
            pingjunValue = Math.abs(targetLeftValue - self.data.leftValue)/4;//500ms其实函数只执行了4次，第一次会等待100ms才会开始函数
            isMoving = 1; //开始计时的时候将标志置1
            //使用计时器实现动画效果
            // console.log('开始向 左 滑动的计时器，isMoving为1');
            moveTime = setInterval(function(){
              ++ leftTimmerCount;
              var currentLeftValue = self.data.leftValue;
              //如果达到了目标值，立即停止计时器
              //调试发现有些时候这个if的跳转会莫名的不成立，所以做个限制，函数被执行了4次之后，无论条件是否成立，将leftValue设置为目标值，并结束计时器
              if(leftTimmerCount == 4){
                clearInterval(moveTime);
                isMoving = 0;
                leftTimmerCount = 0;
                self.setData({leftValue: targetLeftValue});
                return;
              }
              if(currentLeftValue == targetLeftValue){
                clearInterval(moveTime);
                isMoving = 0;
                leftTimmerCount = 0;
                // console.log('向 左 滑动的计时器结束了，isMoving为0');
                return;
              }
              self.setData({leftValue: currentLeftValue-pingjunValue});
            },75);
            self.setData({pageIndex: ++currentIndex});
          }
        }else{
          //前一页和后一页相差其实是2个-320px
          if(currentIndex > 1){
            targetLeftValue = (-1)*self.data.windows.windows_width*(currentIndex-2);
            pingjunValue = Math.abs(targetLeftValue - self.data.leftValue)/4;
            isMoving = 1;
            // console.log('开始向 左 滑动的计时器，isMoving为1');
            moveTime = setInterval(function(){
              ++ rightTimmerCount;
              var currentLeftValue = self.data.leftValue;
              if(rightTimmerCount == 4){
                clearInterval(moveTime);
                isMoving = 0;
                rightTimmerCount = 0;
                self.setData({leftValue: targetLeftValue});
                return;
              }
              if(currentLeftValue == targetLeftValue){
                clearInterval(moveTime);
                isMoving = 0;
                rightTimmerCount = 0;
                // console.log('向 右 滑动的计时器结束了，isMoving为0');
                return;
              }
              self.setData({leftValue: currentLeftValue + pingjunValue});
            },75);
            self.setData({pageIndex: --currentIndex});
          }
        }
      }else{

      }
    },
    sectionSliderChange: function(event){
      var self = this;
      self.setData({allSliderValue: {section: event.detail.value, bright: self.data.allSliderValue.bright, font: self.data.allSliderValue.font}});
    },
    brightSliderChange: function(event){
      var self = this;
      self.setData({allSliderValue: {section: self.data.allSliderValue.section, bright: event.detail.value, font: self.data.allSliderValue.font}});
      //亮度调节，其实是使用一个黑色的cover调节透明度，这里需要给出提示，使用亮度调节会失去当前颜色背景
      if(self.data.isUseBrightModel == '0'){
        wx.showModal({
          title: '提示',
          content: '使用亮度调节，会将背景模式还原至最初模式，建议使用系统的亮度调节',
          success: function(res) {
            if (res.confirm) {
              self.setData({isUseBrightModel: 1, colorStyle: {content_bg: '#f5f9fc', styleNum:1, slider_bg: '#fd9941', slider_none_bg: '#dbdbdb', control_bg: '#ffffff', control_fontColor: '#fd9941'}});
            }
          }
        });
      }
    },
    fontSliderChange: function(event){
      var self = this;
      self.setData({allSliderValue: {section: self.data.allSliderValue.section, bright: self.data.allSliderValue.section, font: event.detail.value}});
      //重新计算分页
      var maxPageNum = countPageNum(self.data.content, event.detail.value, self.data.lineHeight, self.data.windows.windows_width, self.data.windows.windows_height, self.data.windows.pixelRatio);
      self.setData({maxPageNum: maxPageNum});
    },
    gotoControlDetail: function(event){
    	var self = this;
    	var target = event.currentTarget.dataset.control;
    	// 这里control_detail需要做两层判断，首先是control_detail之前是0还是1，0变成1,1变成0，其次是target在两次点击中是否相同，相同则继续上面的判断，否则取反
    	var control_detail = null;
    	if(self.data.control.control_detail == '0'){
    		// 当control_detail不显示的时候不再判断两次点击的目标是否相同，直接统一显示
    		control_detail = 1;
    	}else{
    		if(target && self.data.control.target == target){
    			control_detail = 0;
    		}else{
    			control_detail = 1;
    		}
    	}
    	self.setData({control: {all: self.data.control.all, control_tab: 1, control_detail: control_detail, target: target}});
    },
    //点击切换颜色
    switchColorStyle: function(event){
    	var self = this;
    	var styleNum = event.currentTarget.dataset.stylenum;
    	switch(styleNum){
    		case '1':
    			self.setData({colorStyle: {content_bg: '#f5f9fc', styleNum:1, slider_bg: '#fd9941', slider_none_bg: '#dbdbdb', control_bg: '#ffffff', control_fontColor: '#fd9941'}});
    			break;
    		case '2':
    			self.setData({colorStyle: {content_bg: '#f5f0da', styleNum:2, slider_bg: '#a6832f', slider_none_bg: '#dbd6c3', control_bg: '#f8f3e0', control_fontColor: '#a6832f'}});
    			break;
    		case '3':
    			self.setData({colorStyle: {content_bg: '#c0edc6', styleNum:3, slider_bg: '#359112', slider_none_bg: '#a7ccab', control_bg: '#ccf1d0', control_fontColor: '#359112'}});
    			break;
        case '4':
          self.setData({colorStyle: {content_bg: '#1a1e21', styleNum:4, slider_bg: '#bb7333', slider_none_bg: '#212528', control_bg: '#101417', control_fontColor: '#bb7333'}});
          break;
    	}
    },
    selectFontFamily: function(){
      this.setData({isShowFontSelector: 1});
    },
    closeFontSelector: function(){
      this.setData({isShowFontSelector: 0});
    },
    changeFontFamily: function(event){
      this.setData({currentFontFamily: event.currentTarget.dataset.fontname});
      //todo 执行改变字体后的重新排版
    },
    //打开目录侧边栏
    openMulu: function(){
      var self = this;
      var bookid = self.data.bookid || '58cbc7c8618cec336c6e8a10';
      var sectionNum = self.data.allSliderValue.section || 1430;
      // var bookid = self.data.bookid || '58ad9056f5d3811cecea0149'; //home
      //此接口需要分页，不能每次拿到全部的章节数据
      //发送ajax得到这本小说的所有章节
      var success = function(obj){
        obj.setData({isShowMulu: 1});
      };
      var fail = function(obj){
        showErrMsg(obj, '获取目录失败')
      };
      getMuluFun(bookid, sectionNum, self, success, fail);
    },
    //目录向上滑动到顶部
    getPreMuluPage: function(){
      var self = this;
      var bookid = self.data.bookid || '58cbc7c8618cec336c6e8a10';
      var sectionNum = self.data.allSliderValue.section || 1430;
      sectionNum -= 20;
      // var bookid = self.data.bookid || '58ad9056f5d3811cecea0149'; //home
      var success = function(obj){
        console.log('你向上翻了一页');        
      };
      var fail = function(obj){
        showErrMsg(obj, '获取目录失败')
      };
      getMuluFun(bookid, sectionNum, self, success, fail, 'pre');
    },
    //目录向下滑动到底部
    getNextMuluPage: function(){
      var self = this;
      var bookid = self.data.bookid || '58cbc7c8618cec336c6e8a10';
      var sectionNum = self.data.allSliderValue.section || 1430;
      sectionNum += 20;
      // var bookid = self.data.bookid || '58ad9056f5d3811cecea0149'; //home
      var success = function(obj){
        console.log('你向上翻了一页');        
      };
      var fail = function(obj){
        showErrMsg(obj, '获取目录失败')
      };
      getMuluFun(bookid, sectionNum, self, success, fail, 'next');
    },
    //滑动目录swiper
    muluSwiper: function(event){
      var self = this;
      var currentIndex = event.detail.current;
      self.setData({ muluSwiperNum: currentIndex });
    },
    //点击目录某一章
    showThisSection: function(event){
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
        method:'GET',
        success (res) {
          try{
            var tmpData = res.data.data;
            var newContent = tmpData.content.sectionContent;
            //重新排版
            var maxPageNum = countPageNum(newContent, self.data.allSliderValue.font, self.data.lineHeight, self.data.windows.windows_width, self.data.windows.windows_height, self.data.windows.pixelRatio);
            self.setData({content: newContent, maxPageNum: maxPageNum, allSliderValue: {section: sectionNum, bright: self.data.allSliderValue.bright, font: self.data.allSliderValue.font}});
            wx.hideToast();
          }catch(e){
            console.log(e);
            wx.hideToast();
            showErrMsg(self, '获取章节内容失败');
          }
          wx.hideToast();
        },
        fail (e) {
          wx.hideToast();
          showErrMsg(self, '获取章节内容失败');
          console.error(e)
        }
      })
    }
});