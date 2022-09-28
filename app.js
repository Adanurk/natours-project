const fs = require('fs');
const express = require('express');
const app = express();
//adds a bunch of functions to our app variable

app.use(express.json());
//* with this method we make sure that the data from user will be saved in request object
// app.use(express.urlencoded({ extended: true }));
//routing
//* to determine how an application response to certain client requests/to certain url or http methods

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
