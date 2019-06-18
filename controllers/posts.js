const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports = function (app) {

  // INDEX AKA DISPLAY ALL POSTS (also our root route)
  app.get('/', (req, res) => {
    var currentUser = req.user;
    console.log(req.cookies);
    Post.find().populate('author')
      .then(posts => {
        res.render('posts-index', {
          posts,
          currentUser
        });
      }).catch(err => {
        console.log(err.message);
      });
  });

  // NEW POST FORM
  app.get('/posts/new', (req, res) => {
    res.render('posts-new', {});
  });

  // CREATE THE NEW POST
  app.post('/posts/new', (req, res) => {
    if (req.user) {
      let post = new Post(req.body);
      post.author = req.user._id;
      post.upVotes = [];
      post.downVotes = [];
      post.voteScore = 0;
      post.save()
        .then(post => {
          return User.findById(post.author); // using post.author in place of req.user._id
        }).then(user => {
          user.posts.unshift(post);
          user.save();
          return res.redirect('/posts/' + post._id); // thanks to Connor Cahill for the "+" trick
        }).catch(err => {
          console.log(err.message);
        });
    } else {
      return res.status(401); // unauthorized
    }
  });

  // SHOW A SINGLE POST
  app.get('/posts/:id', function (req, res) {
    var currentUser = req.user;
    Post.findById(req.params.id).populate('comments').lean()
      .then(post => {
        res.render("posts-show", {
          post,
          currentUser,
          postId: post._id,
        });
      }).catch(err => {
        console.log(err.message);
      });
  });

  // DELETE A POST
  app.delete('/posts/:id', function (req, res) {
    console.log("DELETE POST")
    Post.findByIdAndRemove(req.params.id)
      .then((post) => {
        res.redirect('/')
      }).catch((err) => {
        console.log(err.message);
      });
  });

  // Subreddit
  app.get('/n/:subreddit', function (req, res) {
    var currentUser = req.user;
    Post.find({
        subreddit: req.params.subreddit
    }).lean() // lean() will return queries in plain JavaScript w/o mongoose https://thecodebarbarian.com/mongoose-4.11-lean-virtuals
      .then(posts => {
        res.render("posts-index", {
          posts,
          currentUser
        });
      }).catch(err => {
        console.log(err);
      });
  });

  // Why PUT? --> Because an upvote EDITS an existing resource
  app.put('/posts/:id/vote-up', function (req, res) {
    Post.findById(req.params.id).exec(function (err, post) {
      post.upVotes.push(req.user._id);
      post.voteScore = post.voteScore + 1;
      return post.save();
      res.status(200);
    });
  });

  // Why PUT? --> Because a downvote EDITS an existing resource
  app.put('/posts/:id/vote-down', function (req, res) {
    Post.findById(req.params.id).exec(function (err, post) {
      post.downVotes.push(req.user._id);
      post.voteScore = post.voteScore - 1;
      return post.save();
      res.status(200);
    });
  });

};