// initializations
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    const token = req.cookies.nToken;
    const decodedToken = jwt.decode(token, {
      complete: true
    }) || {};
    req.user = decodedToken.payload;
  }
  next();
};
const jwt = require('jsonwebtoken');
const app = express();

// dotenv
require('dotenv').config();

// set db
require('./data/reddit-db');

// middleware
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/reddit-clone');
app.use(methodOverride('_method'));
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(cookieParser());
//    Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
//    Add after body parser init!
app.use(expressValidator());
app.use(checkAuth);
//    This tells it to look for static files in public folder
app.use(express.static('public'));

// controllers
require('./controllers/posts.js')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);
require('./controllers/replies.js')(app);

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost.27017/reddit-clone";
mongoose.connect(mongoUri, {
  useNewUrlParser: true
});

app.listen(port, () => {
  console.log('App listening on port 3000!')
});

module.exports = app; //exports app variable - mocha needs for tests