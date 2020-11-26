var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var apiRouter = require('./routes/api');



var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api', apiRouter);

module.exports = app;
