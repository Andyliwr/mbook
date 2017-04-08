### 接口文档
+ 获取所有的小说列表
```
  + REST: get
  + addr: http://localhost:3000/api/xs_list
  + return:
    [{
        "headerImage": "http://res.cloudinary.com/idwzx/image/upload/v1472746056/dazhuzai_y6428k.jpg",
        "updateTime": "2017-02-17T14:59:59.744Z",
        "author": "天蚕土豆",
        "des": "大千世界，位面交汇，万族林立，群雄荟萃，一位位来自下位面的天之至尊，在这无尽世界，演绎着令人向往的传奇，追求着那主宰之路。 无尽火域，炎帝执掌，万火焚苍穹。 武境之内，武祖之威，震慑乾坤。 西天之殿，百战之皇，战威无可敌。 北荒之丘，万墓之地，不死之主镇天地。 ...... 少年自北灵境而出，骑九幽冥雀，闯向了那精彩绝伦的纷纭世界，主宰之路，谁主沉浮？ 大千世界，万道争锋，吾为大主宰。",
        "factionName": "大主宰",
        "sectionArray": [
          "58a70fef56d84738783c5fe8"
        ],
        "id": "58a70fef56d84738783c5fe9"
      },
      ........
    ]
```
+ 获取所有的小说内容
```
  + REST: get
  + addr: http://localhost:3000/api/xs_content
  + return:
    [
      {
        "sectionNum": 1,
        "sectionTitle": "测试章节",
        "sectionContent": "这是我存进去的第一章，仅供测试",
        "sectionResource": "百度贴吧",
        "recentUpdateTime": "2017-02-17T14:59:59.737Z",
        "id": "58a70fef56d84738783c5fe8"
      },
      ........
    ]
```
+ ### 登录

```
+ REST: post
+ addr: http://localhost:3000/api/myappuser/login
+ param: {"username":"lidikang", "password":"123456"},或者使用邮箱登录{"email":"andyliwr@outlook.com", "password":"123456"}
+ return:
    {
      "id": "iHVbNBiF3qZ7xJGozV8L4TiFr74OzRFgM5h4Ghf9AbHJkr0fZ3lQcCrLF5djIa5F",
      "ttl": 1209600,
      "created": "2017-02-18T05:46:48.473Z",
      "userId": "58a7bac76b2a300b88e22535"
    }
```

+ ### 注册
```
+ REST: post
+ addr: http://localhost:3000/api/myappuser
+ param: {
            "realm": "李迪康",
            "username": "lidikang",
            "password": "123456",
            "email": "andyliwr@outlook.com",
            "emailVerified": true,
          }
+ return:
    {
      "realm": "吴艳倩",
      "username": "wuyanqian",
      "email": "wuyanqian@myhexin.com",
      "emailVerified": false,
      "id": "58a7e0eff7cc7b0e84ad42fd"
    }
```

+ ### 获取排行榜
```
+ REST: get
+ addr: http://localhost:3000/api/xs_rank/getRank?rankType=zh
+ param: rankType=qd或者zh，分别代表获取起点排行榜，和纵横排行榜
+ return:
      "data": [
        {
          "standard": "汇总",
          "engName": "total",
          "zhRank": [
            {
              "num": 1,
              "factionName": "超品战兵",
              "author": "梁不凡",
              "headImg": "http://static.zongheng.com/upload/cover/10/1e/101ecef1545403f69722d665c41c7122.jpeg",
              "des": "萧兵原本是雇佣界的王者，却为了红颜知己而回归平凡都市，他一切从头开始，扮猪吃虎，逆流而上，脚底踩尸骨，怀搂美人腰，铸就王途霸业！    （微信公众号：梁不凡）",
              "url": "http://book.zongheng.com/book/512263.html"
            },
            .....
```

+ ### 获取我的书单
```
+ REST: get
+ addr: http://localhost:3000/api/myappuser/getMyBooks?userid=58d9c09b8262150de8b3c2e6
+ param: userid为已经注册的用户id
+ return:
      "data": {
      "code": 0,
      "data": [
        {
          "name": "极品驸马",
          "headImage": "http://static.zongheng.com/upload/cover/2013/12/1388323690134.jpg",
          "bookid": "58cbc7e8753ae423a4aaf8d6",
          "hasRead": 0
        }
      ]
    }
```

  + ### 新增加书单
  ```
  + REST: post
  + addr: http://localhost:3000/api/myappuser/addMyBooks?userid=58d9c09b8262150de8b3c2e6
  + data: 单个书单：{"userid":"58d9c09b8262150de8b3c2e6","bookids":"58cbc7e8753ae423a4aaaf8dc"}
          多个书单：{"userid":"58d9c09b8262150de8b3c2e6","bookids":"58cbc7e8753ae423a4aaaf8dc,58cbc7e8753ae423a4aaf8d6,58cbc7e8753ae423a4aaf8d8"}，使用逗号隔开，中间不要带空格
  + param: userid为已经注册的用户id， bookids为书单id数组
  + return:
      操作成功的返回：
      {
        "data": {
          "code": 0,
          "successMsg": "书单添加成功"
        }
      }
      错误返回：
      {
        "error": {
          "statusCode": 500,
          "message": "Internal Server Error"
        }
      }
  ```

  + ### 删除书单
  ```
  + REST: post
  + addr: http://localhost:3000/api/myappuser/deleteMyBooks?userid=58d9c09b8262150de8b3c2e6
  + data: 单个书单：{"userid":"58d9c09b8262150de8b3c2e6","bookids":"58cbc7e8753ae423a4aaaf8dc"}
          多个书单：{"userid":"58d9c09b8262150de8b3c2e6","bookids":"58cbc7e8753ae423a4aaaf8dc,58cbc7e8753ae423a4aaf8d6,58cbc7e8753ae423a4aaf8d8"}，使用逗号隔开，中间不要带空格
  + param: userid为已经注册的用户id， bookids为书单id数组
  + return:
      操作成功的返回：
      {
        "data": {
          "code": 0,
          "successMsg": "删除书单成功"
        }
      }
      错误返回：
      {
        "error": {
          "statusCode": 500,
          "message": "Internal Server Error"
        }
      }
  ```

  + ### 更新用户已经阅读的章节
  ```
  + REST: post
  + addr: http://localhost:3000/api/myappuser/updateHasRead
  + data: 单个书单：{"userid":"58d9c09b8262150de8b3c2e6","bookid":"58cbc7e8753ae423a4aaaf8dc","hasRead":4}
  + param: userid为已经注册的用户id， bookid为要更新的书籍id，hasRead为用户已阅读章节
  + return:
      操作成功的返回：
      {
        "result": {
          "code": 0,
          "successMsg": "用户已阅读章节更新成功"
        }
      }
  ```
