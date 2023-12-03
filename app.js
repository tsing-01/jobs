const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');

const { notFound, setHeader, errorHandler } =  require('./middeware');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(setHeader);
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
