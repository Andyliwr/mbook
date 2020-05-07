import mongoose from 'mongoose';
import { Chapter } from './chapter';

const BookSchema = new mongoose.Schema(
  {
    headerImage: String,
    updateTime: Date,
    author: String,
    des: String,
    factionName: String,
    newest: Number,
    comments: Array,
    source: [{ type: String }]
  },
  { versionKey: false }
);

BookSchema.index({ name: 1 });

/**
 * 更改书籍更新时间
 */
BookSchema.statics.updateTime = function (id) {
  if (!id) {
    return false;
  }
  this.findById(id, async (merr, mres) => {
    if (merr) {
      console.log('更改书籍更新时间失败，找不到此书籍', merr);
      return false;
    }
    const newestChapter = await Chapter.findOne({ bookid: id }, 'num').sort({ num: -1 }).limit(1);
    if (newestChapter && newestChapter.num) {
      const updateResult = await this.update(
        { _id: id },
        {
          $set: {
            newest: newestChapter.num,
            updateTime: new Date()
          }
        }
      );
      if (updateResult.ok === 1) {
        return true;
      } else {
        console.log('更改书籍更新时间失败', updateResult);
        return false;
      }
    } else {
      console.log('更改书籍更新时间失败', newestChapter);
      return false;
    }
  });
};

/**
 * 将字母id装换成mongodb的ObjectId对象的静态函数
 */
BookSchema.statics.transId = async function (id) {
  return mongoose.Types.ObjectId(id);
};

let Book = mongoose.model('book', BookSchema, 'book');

export { Book };
