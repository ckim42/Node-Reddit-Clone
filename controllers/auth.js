const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

module.exports = (app) => {

  // SIGN UP FORM
  app.get('/sign-up', (req, res) => {
    res.render("sign-up");
  });

  // SIGN UP POST
  app.post('/sign-up', (req, res) => {
    // Create user & JWT
    const user = new User(req.body);
    user.save().then((user) => {
        var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" });
        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        res.redirect("/");
      }).catch(err => {
        console.log(err.message);
        return res.status(400).send({ err: err });
      });
  });

  // LOGOUT
  app.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    res.redirect('/');
  });

  // LOGIN FORM
  app.get('/login', (req, res) => {
    res.render('login');
  });

  // ACTUALLY LOGGING IN
  app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = new User(req.body); //DO I REALLY NEED THIS? THERE MUST BE A WAY TO WORK WITHOUT IT

    // Find this user name
    User.findOne({ username }, "username password")
      .then(user => {
        if (!user) { // User not found
          return res.status(401).send({ message: "Wrong Username or Password" });
        }
        user.comparePassword(password, (err, isMatch) => { // Checks password
          if (!isMatch) { // Password doesn't match
            return res.status(401).send({ message: "Wrong Username or password" });
          }
          const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, { // Creates a token
            expiresIn: "60 days"
          });
          res.cookie("nToken", token, { maxAge: 900000, httpOnly: true }); // Sets a cookie and redirects to root view
          res.redirect("/");
        });
      }).catch(err => {
        console.log(err);
      });
  });

}
