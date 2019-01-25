const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const express = require('express');
const app = express();

module.exports = function(app) {

  // INDEX (also our root route)
  app.get('/', (req, res) => {
    var currentUser = req.user;
    console.log(req.cookies);
    Post.find().populate('author')
      .then(posts => {
        res.render('posts-index', { posts, currentUser });
      }).catch(err => {
        console.log(err.message);
      });
  });

  // NEW
  app.get('/posts/new', (req, res) => {
    res.render('posts-new', {});
  });

  // CREATE
  app.post('/posts/new', (req, res) => {
    if (req.user) {
      var post = new Post(req.body);
      post.author = req.user._id;
      post.save().then(post => {
        return User.findById(req.user._id);
      }).then(user => {
        user.posts.unshift(post);
        user.save();
        res.redirect('/posts/' + post._id) // thanks to Connor Cahill for the "+" trick
      }).catch(err => {
        console.log(err.message);
      });
    } else {
      return res.status(401); // unauthorized
    }
  });

  // SHOW
  app.get('/posts/:id', function(req, res) {
    var currentUser = req.user;
    // LOOK UP THE POST
    Post.findById(req.params.id).populate('comments').populate('author').then((post) => {
      res.render('posts-show', { post })
    }).catch(err => {
        console.log(err.message);
    });
  });

  // Subreddit
  app.get('/n/:subreddit', function(req, res) {
    var currentUser = req.user;
    Post.find({ subreddit: req.params.subreddit }).populate('author')
      .then(posts => {
        res.render('posts-index', { posts, currentUser });
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
