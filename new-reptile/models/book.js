import mongoose from 'mongoose'

const BookSchema = new mongoose.Schema(
  {
    headerImage: String,
    updateTime: Date,
    author: String,
    des: String,
    factionName: String,
    newest: Number,
    comments: Array,
    source: [{ type: String }],
  },
  { versionKey: false }
)

BookSchema.index({ name: 1 })

/**
 * 将字母id装换成mongodb的ObjectId对象的静态函数
 */
BookSchema.statics.transId = async function(id) {
  return mongoose.Types.ObjectId(id)
}


let Book = mongoose.model('Book', BookSchema)

export { Book }
