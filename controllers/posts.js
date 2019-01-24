const Post = require('../models/post');
const express = require('express');
const app = express();

module.exports = app => {

  // root route
  app.get('/', (req, res) => {
    res.send('Hello World!')
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
