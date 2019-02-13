const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Populate = require("../utils/autopopulate");

const CommentSchema = new Schema({
  content: { type: String, required: true },
  author : { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  postId: { type: Schema.Types.ObjectId, ref: 'Post'}
});

// Always populate the author field
CommentSchema.pre('findOne', Populate('author')).pre('find', Populate('author'))
CommentSchema.pre('findOne', Populate('comments')).pre('find', Populate('comments'))

module.exports = mongoose.model("Comment", CommentSchema);
