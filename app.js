// Importing required modules
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require("fs");

// Creating Buckets directory if it doesn't exist
fs.access("Buckets", (error) => {
if (error) {
fs.mkdirSync("Buckets");
}
});

// Importing bucket router
var bucketRouter = require('./routes/buckets');

// Initializing the app
var app = express();

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routing requests to the bucketRouter
app.use('/bucket', bucketRouter);

module.exports = app; // Exporting the app module