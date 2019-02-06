const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const express = require('express');
const app = express();

module.exports = function(app) {

  // FIXME: make the reply render to the user
  // This breaks when the user is not logged in, what if you
  // instead give an alert to the user to let them know they need to
  // log in?

  // CREATE

  app.post("/posts/:postId/comments", function (req, res) {
    console.log('***** Post id: ', req.params.postId);
      const comment = new Comment(req.body);
      comment.author = req.user._id;
      comment
          .save()
          .then(comment => {
              return Promise.all([
                  Post.findById(req.params.postId)
              ]);
          })
          .then(([post, user]) => {
              post.comments.unshift(comment);
              return Promise.all([
                  post.save()
              ]);
          })
          .then(post => {
              res.redirect(`/posts/${req.params.postId}`);
          })
          .catch(err => {
              console.log(err);
          });
  });

};
