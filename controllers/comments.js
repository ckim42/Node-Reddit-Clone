const Post = require('../models/post');
const Comment = require('../models/comment');
const express = require('express');
const app = express();

module.exports = function(app) {

  // CREATE
  app.post("/posts/:postId/comments", function(req, res) {
    const comment = new Comment(req.body); // instantiate instance of model
    comment // save instance of comment model to db
      .save()
      .then(comment => {
        return Post.findById(req.params.postId);
      })
      .then(post => {
        post.comments.unshift(comment); // 'unshift' adds element to front of array; 'push' adds to end. prioritize new, like canonical Reddit
        return post.save();
      })
      .then(post => {
        res.redirect('/');
      })
      .catch(err => {
        console.log(err);
      });
  });

};
