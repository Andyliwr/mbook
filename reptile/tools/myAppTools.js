var Compare = require('./compareJSON');

//判断是否有重复项
var isInArray = function(array, sameElement){
    if(!(array instanceof Array)){
        return false;
    }else{
        for(var i=0; i<array.length; i++){
            //json1={a:1}, json2={a:1}, json1 != json2
            if(sameElement instanceof Object){
                // console.log("我是一个对象");
                // console.log('此次比对结果是：'+Compare(array[i], sameElement));
                // console.log('原告人：');
                // console.log(sameElement);
                // console.log('被告人：');
                // console.log(array[i]);
                if(Compare(array[i], sameElement) == true){
                    return true;
                }else{
                    continue;
                }
            }else{
                if(array[i] == sameElement){
                    return true;
                }
            }
        }
        return false;
    }
};

//于千军万马中挑出中意的小说内容
var selectCorrect = function(array){
    if(!(array instanceof Array)){
        return '';
    }else{
        for(var i=0; i<array.length; i++){
            if(array[i].length>300 && array[i].match('第*章')){
                return array[i];
            }
        }
        return '';
    }
};

//联合两个JSON数组, 比如JSON1=[{a:1, b:2}],JSON2=[{c:3, d:4}], concatJSON(JSON1, JSON2)结果为[{a:1, b:2, c:3, d:4}]
var concatJSON = function(JSONArray1, JSONArray2){
    var finalJSONArray = [];
    if(JSONArray1.length != JSONArray2.length){
        console.log('两个JSON数组长度不一致！！');
        return null;
    }
    for(var i=0; i<JSONArray1.length; i++){
        if((!JSONArray1[i] instanceof Array) || (!JSONArray2 instanceof Array)){
            console.log('不是JSON数组');
            return null;
        }
        var finalJSONArrayTemp = {};

        for(var attr in JSONArray1[i]){
            finalJSONArrayTemp[attr]=JSONArray1[i][attr];
        }
        for(var attr in JSONArray2[i]){
            finalJSONArrayTemp[attr]=JSONArray2[i][attr];
        }
        finalJSONArray.push(finalJSONArrayTemp);
    }
    return finalJSONArray;
};

//提取JSON数组里某个特殊字段形成数组
var getElementArray = function(jsonArray, element){
    if(!jsonArray instanceof Object){
        console.log("提取json数组中特定值时传入的json数组格式错误1！");
        return null;
    }
    var resultArray = [];
    for(var i=0; i<jsonArray.length; i++){
        //这个地方不能直接用变量来引用json的属性，会出现undefined的错误
        if(jsonArray[i][element] == undefined){
            console.log("提取json数组中特定值时传入的json数组格式错误2！");
            return null;
        }else{
             resultArray[i] = jsonArray[i][element];
        }
    }
    return resultArray;
};

//去掉第和章之间的非数字
var removeNaN = function(str){
  var standardNum = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '千', '百', '万', '亿'];
  if(typeof str == 'string'){
    var strArray = str.split("");
    for(var i=0; i<strArray.length; i++){
      if(!isInArray(standardNum, strArray[i])){
        strArray[i] = '';
      }
    }
    return strArray.join('');
  }else{
    console.log('你传给removeNaN的参数格式错误，不是一个string！');
    return '';
  }
};

exports.isInArray = isInArray;
exports.selectCorrect = selectCorrect;
exports.concatJSON = concatJSON;
exports.getElementArray = getElementArray;
exports.removeNaN = removeNaN;
