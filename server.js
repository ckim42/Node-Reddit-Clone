// initializations
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const app = express();

// middleware
app.use(methodOverride('_method'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//    Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//    Add after body parser init!
app.use(expressValidator());

// controllers
require('./controllers/posts.js')(app);
//    Set db
require('./data/reddit-db');

//home
app.get('/', (req, res) => {
  res.send('Hello World!')
});

//NEW
app.get('/posts/new', (req, res) => {
  res.render('posts-new', {});
});

app.listen(3000, () => {
  console.log('App listening on port 3000!')
});

module.exports = app;
