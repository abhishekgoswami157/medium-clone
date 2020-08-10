var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

// var session = require("express-session");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articlesRouter = require('./routes/articles');
var commentsRouter = require('./routes/comments');
var auth = require('./middlewares/auth');


var mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost/medium-clone-app",
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  err => {
    console.log("connected", err ? err : true);
  }
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(session({
  secret: "sdfdghggfdsa",
  resave: false,
  saveUninitialized: false,
  // store: new MongoStore(options)
  store: new MongoStore({ mongooseConnection: mongoose.connection })
})
);

app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

app.use(auth.userInfo);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/comments', commentsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
