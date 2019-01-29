var Post = require("../models/post");
var Comment = require("../models/comment");
var User = require("../models/user");

module.exports = app => {

  // NEW REPLY
  app.get("/posts/:postId/comments/:commentId/replies/new", (req, res) => {
    let post;
    Post.findById(req.params.postId)
      .then(p => {
        post = p;
        return Comment.findById(req.params.commentId);
      })
      .then(comment => {
        res.render("replies-new", { post, comment });
      })
      .catch(err => {
        console.log(err.message);
      });
  });


app.post('/posts/:postId/comments/:commentId/replies', (req, res) => {
  const reply = new Comment(req.body);
  reply.author = req.user._id;
  reply.save()
  .then(() => Comment.findById(req.params.commentId))
  .then((comment) => {
    comment.comments.unshift(reply);
    return comment.save();
  })
  .then(() => res.redirect(`/posts/${req.params.postId}`))
  .catch(console.error)
});

}
