var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
    name  : { type: String, unique: true },
    posts : [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});
var User = mongoose.model('User', UserSchema);

var PostSchema = new Schema({
    poster   : { type: Schema.Types.ObjectId, ref: 'User' },
    comments : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    title    : String,
    content  : String
});
var Post = mongoose.model('Post', PostSchema);

var CommentSchema = new Schema({
    post      : { type: Schema.Types.ObjectId, ref: "Post" },
    commenter : { type: Schema.Types.ObjectId, ref: 'User' },
    content   : String
});
var Comment = mongoose.model('Comment', CommentSchema);


// 连接数据库
mongoose.connect('mongodb://localhost/population-test', function (err){
    if (err) throw err;
    createData();
    //填充所有 users 的 posts
User.find()
    .populate('posts', 'title', null, {sort: { title: -1 }})
    .exec(function(err, docs) {
        console.log(docs[0].posts[0].title); // post-by-aikin
    });
});

function createData() {

    var userIds    = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
    var postIds    = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
    var commentIds = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];

    var users    = [];
    var posts    = [];
    var comments = [];

    users.push({
        _id   : userIds[0],
        name  : 'aikin',
        posts : [postIds[0]]
    });
    users.push({
        _id   : userIds[1],
        name  : 'luna',
        posts : [postIds[1]]
    });
    users.push({
        _id   : userIds[2],
        name  : 'luajin',
        posts : [postIds[2]]
    });

    posts.push({
        _id      : postIds[0],
        title    : 'post-by-aikin',
        poster   : userIds[0],
        comments : [commentIds[0]]
    });
    posts.push({
        _id      : postIds[1],
        title    : 'post-by-luna',
        poster   : userIds[1],
        comments : [commentIds[1]]
    });
    posts.push({
        _id      : postIds[2],
        title    : 'post-by-luajin',
        poster   : userIds[2],
        comments : [commentIds[2]]
    });

    comments.push({
        _id       : commentIds[0],
        content   : 'comment-by-luna',
        commenter : userIds[1],
        post      : postIds[0]
    });
    comments.push({
        _id       : commentIds[1],
        content   : 'comment-by-luajin',
        commenter : userIds[2],
        post      : postIds[1]
    });
    comments.push({
        _id       : commentIds[2],
        content   : 'comment-by-aikin',
        commenter : userIds[1],
        post      : postIds[2]
    });

    User.create(users, function(err, docs) {
        Post.create(posts, function(err, docs) {
            Comment.create(comments, function(err, docs) {
            });
        });
    });
}

//填充所有 users 的 posts
User.find()
    .populate('posts', 'title', null, {sort: { title: -1 }})
    .exec(function(err, docs) {
        console.log(docs[0].posts[0].title); // post-by-aikin
    });

//填充 user 'luajin'的 posts
User.findOne({name: 'luajin'})
    .populate({path: 'posts', select: { title: 1 }, options: {sort: { title: -1 }}})
    .exec(function(err, doc) {
        console.log(doc.posts[0].title);  // post-by-luajin
    });

//这里的 populate 方法传入的参数形式不同，其实实现的功能是一样的，只是表示形式不一样。
