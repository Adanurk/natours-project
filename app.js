const fs = require('fs');
const express = require('express');
const app = express();
//adds a bunch of functions to our app variable

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

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  //object assign here allows us to combine two objects and gives one object, by merging them
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
      //201 means created
    }
  );
  //since we are in now a callback function and thats why we are running now in event loop, we shouldnt block the event loop so we have to use async version of the method here!
  //we always have to send back sth in order to complete request
};

const getOneTour = (req, res) => {
  console.log(req.params);
  //req.params is an object where  our all parameters are strored! => req.params => {id: 5}
  //if you want to make a parameter optional, put a question mark in the right end side => /:x?
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

//! put & patch these two methods are for updating data
//! put => app receives entirely new updated object
//! patch => app receives the only properties that updated in the object

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }

  res.status(204).json({
    //! 204 means no content
    status: 'success',
    data: null,
  });
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour here...>',
    },
  });
};

// app.get('/api/v1/tours/:id', getOneTour);
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getOneTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
