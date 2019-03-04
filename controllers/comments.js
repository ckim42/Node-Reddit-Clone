const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports = function (app) {

  // CREATE A COMMENT
  app.post('/posts/:postId/comments', (req, res) => {
    const comment = new Comment(req.body);
    comment.author = req.user._id;
    comment.save()
      .then(() => Post.findById(req.params.postId))
      .then((post) => {
        post.comments.unshift(comment);
        return post.save();
      })
      .then(post => res.redirect(`/posts/${post._id}`))
      .catch(err => console.log(err));
  });

};