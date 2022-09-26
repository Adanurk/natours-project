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
  console.log(req.body);
  res.send('Done');
  //we always have to send back sth in order to complete request
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
