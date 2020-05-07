import mongoose from 'mongoose'

const ChapterSchema = new mongoose.Schema(
  {
    bookid: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }, 
    name: String, // 章节名
    num: { type: Number, unique: true }, // 章节数
    content: String, // 内容
    create_time: Date // 创建时间
  },
  { versionKey: false }
)

ChapterSchema.index({ bookid: 1, num: 1 })

/**
 * 将字母id装换成mongodb的ObjectId对象的静态函数
 */
ChapterSchema.statics.transId = async function(id) {
  return mongoose.Types.ObjectId(id)
}

// 使用bookid和num作为索引
ChapterSchema.index({ bookid: 1, num: 1 })

let Chapter = mongoose.model('Chapter', ChapterSchema)

export { Chapter }
