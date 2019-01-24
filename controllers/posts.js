const Post = require('../models/post');
const User = require('../models/user');
const express = require('express');
const app = express();

module.exports = app => {

  // INDEX (also our root route)
  app.get('/', (req, res) => {
    Post.find({})
      .then(posts => {
        res.render("posts-index", {
          posts
        });
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

  // SHOW
  app.get('/posts/:id', function(req, res) {
    // LOOK UP THE POST
    Post.findById(req.params.id).populate('comments').then((post) => {
      res.render('posts-show', { post })
    }).catch(err => {
        console.log(err.message);
      });
  });

  // Subreddit
  app.get('/n/:subreddit', function(req, res) {
    Post.find({ subreddit: req.params.subreddit })
      .then(posts => {
        res.render('posts-index', { posts });
      }).catch(err => {
        console.log(err);
      });
  });

  // Sign up post
  app.post('/sign-up', (req, res) => {
    const user = new User(req.body);
    user
      .save()
      .then(user => {
        res.redirect('/');
      }).catch(err => {
        console.log(err.message);
      });
  });

};
