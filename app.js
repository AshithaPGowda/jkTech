var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require("fs");

fs.access("Buckets", (error) => {
    if (error) {
      fs.mkdirSync("Buckets");
    }
  });

var bucketRouter = require('./routes/buckets');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/bucket', bucketRouter);

module.exports = app;
