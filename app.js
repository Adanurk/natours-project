const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
//adds a bunch of functions to our app variable

//! 1-MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
//!this is also a middleware
//* with this method we make sure that the data from user will be saved in request object
// app.use(express.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));

//routing
//* to determine how an application response to certain client requests/to certain url or http methods

app.use((req, res, next) => {
  //! we manipulated request object with a middleware
  req.requestTime = new Date().toISOString();
  next();
});

//! 2-ROUTE HANDLERS

//! 3-ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// so it is actually a middleware

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
