const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
//adds a bunch of functions to our app variable

//! 1-MIDDLEWARES

app.use(morgan('dev'));

app.use(express.json());
//!this is also a middleware
//* with this method we make sure that the data from user will be saved in request object
// app.use(express.urlencoded({ extended: true }));

//routing
//* to determine how an application response to certain client requests/to certain url or http methods

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  // it is executed at each request
  next();
});

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

//! 4-SERVER LISTENER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
