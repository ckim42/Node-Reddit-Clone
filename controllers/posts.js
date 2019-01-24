const Post = require('../models/post');
const express = require('express');
const app = express();

module.exports = app => {

  // INDEX (also our root route)
  app.get('/', (req, res) => {
    Post.find({})
      .then(posts => {
        res.render("posts-index", { posts });
      })
      .catch(err => {
        console.log(err.message);
      });
  });

  // NEW
  app.get('/posts/new', (req, res) => {
    res.render('posts-new', {});
  });

  // CREATE
  app.post('/posts/new', (req, res) => {
    // console.log("req.body:", req.body);
    const post = new Post(req.body); //instantiate instance of post model
    post.save((err, post) => { //save instance of post model to db
      return res.redirect('/'); //redirects to the root
    })
  });

};
