var connectDB = require('./connectDB');
var myAppTools = require('../tools/myAppTools');

connectDB.configLog('ixdzsReptile');

// connectDB.saveFaction({
//   factionName: '天影',
//   sectionNum: 1,
//   sectionTitle: '测试章节01',
//   sectionContent: '你到了没有知识的荒野...',
//   sectionResource: '爱下电子书',
//   recentUpdateTime: myAppTools.formatDate(new Date())
// })

//测试清空某部小说
// connectDB.emptyFaction('天影', '爱下电子书');

//测试整理更新小说的方法
// connectDB.updateSectionList('天影', '爱下电子书');

//测试tool中的去重函数
// var jsonArr = [
//   {
//     a: 1,
//     sectionNum: 0
//   },
//   {
//     a: 2,
//     sectionNum: 2
//   },
//   {
//     a: 3,
//     sectionNum: 1
//   },{
//     a: 4,
//     sectionNum: 2
//   }
// ];
// console.log(JSON.stringify(myAppTools.removeDuplicate(jsonArr, 'sectionNum')));

//初始化数组库
// connectDB.initDB();

//获取断层章节
connectDB.getSlipSection('大主宰', '爱下电子书', function(idArr){
  console.log(idArr);
})