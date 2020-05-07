import { Book } from './models';
import { MONGO_URL } from './config';
import mongoose from 'mongoose';

const BOOKS = [
  {
    headerImage:
      "https://www.rzlib.net/files/article/image/52/52352/52352s.jpg",
    updateTime: "2020-05-03T13:27:19.283Z",
    author: "梁不凡",
    des:
      "九千年前，仙武帝尊率领百万神将打入太古洪荒，却无一人归来，只有一缕真火遗留世间。 九千年后，门派废徒叶辰，被赶出宗门，无以为家，机缘巧合之下偶得真火，再踏仙武之路。 这是一个神魔仙佛并立的世界，这是一个诸天万域混乱的年代，叶辰的逆天征途，由此开始。 …",
    factionName: "武道神帝",
    newest: 0,
    comments: [{}],
    source: ["https://www.rzlib.net/b/52/52352/"],
  },
  {
    headerImage:
      "https://www.rzlib.net/files/article/image/0/9/9s.jpg",
    updateTime: "2020-05-03T13:27:19.283Z",
    author: "缘分0",
    des:
      "一个边陲小镇上走出的少年，历尽千辛万苦，靠着自己的努力一步步登上强者之路。 诞龙镇上的一个普通的少年，被误断为不能修炼星力，却是身怀天赋异禀。在一次的奇遇当中，得知自身的天赋，并得到了一本神秘的神书。不仅使他可以修炼星力，更是拥有了踏上这强者巅峰，立足宇宙之巅之本。 且看一个无权无势的少年如何凭着自己的努力走出一条不一样的强者之路。如何在这强者林立的大陆上翱翔九天，俯瞰世界。",
    factionName: "混沌灵修",
    newest: 0,
    comments: [{}],
    source: ["https://www.rzlib.net/b/0/9/"],
  },
  {
    headerImage: "https://www.rzlib.net/files/article/image/0/2/2s.jpg",
    updateTime: "2020-05-03T13:27:19.283Z",
    author: "盘龙",
    des:
      "大陆上传说中的四大终极战士之一的‘龙血战士’已经千年没有再出现过了，而唯一有着龙血战士血脉的家族也渐渐衰败了下来，成为了一个小镇的普通贵族。而这个衰败家族中的继承人，年仅八岁的小林雷在踏入已经布满灰尘的祖屋当中的时候，却无意当中得到一枚看似极为普通的戒指——盘龙戒指！ …",
    factionName: "原血神座",
    newest: 0,
    comments: [{}],
    source: ["https://www.rzlib.net/b/0/2/"],
  },
  {
    headerImage:
      "https://www.rzlib.net/files/article/image/63/63870/63870s.jpg",
    updateTime: "2020-05-03T13:27:19.283Z",
    author: "龙七二十一",
    des:
      "人死的时候会有意识吗？会，因为我经历过。 这个世界上真的有鬼吗？有，因为，我就是。 借体重生后，发现他有一个美到窒息的老婆，睡，还是不睡？ …",
    factionName: "林羽江颜",
    newest: 0,
    comments: [{}],
    source: ["https://www.rzlib.net/b/63/63870/"],
  },
  {
    headerImage:
      "https://www.rzlib.net/files/article/image/47/47446/47446s.jpg",
    updateTime: "2020-05-03T13:27:19.283Z",
    author: "烈焰滔滔",
    des:
      "老赵是一名48岁的驾校教练，而他的班上，有一堆年轻貌美的女大学生…… …",
    factionName: "驾校情缘",
    newest: 0,
    comments: [{}],
    source: ["https://www.rzlib.net/b/47/47446/"],
  },
  {
    headerImage:
      "https://www.rzlib.net/files/article/image/3/3244/3244s.jpg",
    updateTime: "2020-05-03T13:27:19.283Z",
    author: "风起夏天",
    des:
      "凌云渡劫失败，降临地球末法时代，从都市中修真，一步步逆天崛起。同修佛魔道！丹田蕴真龙！拥有太古龙神血脉，获得上古三皇传承！凌云战天斗地，斩妖除魔，一路逆天修行！他从修真世界而来，他将武碎虚空而去！他是龙皇武神！",
    factionName: "龙皇武神",
    newest: 0,
    comments: [{}],
    source: ["https://www.rzlib.net/b/3/3244/"],
  },
];

async function connectMongo() {
  mongoose.Promise = global.Promise;
  mongoose.connection.on('error', console.error.bind(console, '连接数据库失败'));
  return await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
}

// 执行爬虫
connectMongo().then(async () => {
  // 每过5s打印一次cpu和内存占用，如果当亲cpu占用超过30%，立即停止进程
  try {
  	for(let i=0; i<BOOKS.length; i++) {
  	  const book = await Book.create(BOOKS[i]);
  	  console.log(`已经创建书籍 - ${book.factionName}`);
  	}
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
});

