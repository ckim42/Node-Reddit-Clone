// initializations
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const app = express();

// set db
require('./data/reddit-db');

// middleware
app.use(methodOverride('_method'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//    Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//    Add after body parser init!
app.use(expressValidator());

// models
const Post = require('./models/post');

// controllers
require('./controllers/posts.js')(app);
require('./controllers/comments.js')(app);

app.listen(3000, () => {
  console.log('App listening on port 3000!')
});

module.exports = app; //exports app variable - mocha needs for tests
