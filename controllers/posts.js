const Post = require('../models/post');
const express = require('express');
const app = express();

module.exports = app => {
  // NEW/Create
  app.post("/posts/new", (req, res) => {
    // instantiate instance of post model
    const post = new Post(req.body);

    // save instance of post model to db
    post.save((err, post) => {
      console.log("hi");
      // redirect to the root
      return res.redirect('/');
    })

  });
};
