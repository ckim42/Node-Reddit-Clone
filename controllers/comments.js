const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const express = require('express');
const app = express();

module.exports = function(app) {

  // CREATE
  app.post("/posts/:postId/comments", (req, res) => {
    if (req.user) {
      var comment = new Comment(req.body);
      comment.author = req.user._id;
      comment.save().then(comment => {
        return User.findById(req.user._id);
      }).then(user => {
        user.comments.unshift(comment);
        user.save();
        return Post.findById(req.params.postId);
      }).then(post => {
        post.comments.unshift(comment)
        return post.save();
      }).then(post => {
        res.redirect('/posts/${req.params.postId}');
      }).catch(err => {
        console.log(err.message);
      });
    } else {
      return res.status(401);
    }
  });

};
