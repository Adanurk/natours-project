const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

//!
dotenv.config({ path: './config.env' });
// console.log(app.get('env'));
// console.log(process.env);

//! Configuration of Mongodb----------------
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    // this is for hosted database
    // .connect(process.env.DATABASE_LOCAL, { //This is for using local database
    //!in order to deal deprecation warnings
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

//! Creating mongoose model example---------
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: { type: Number, default: 4.5 },
  price: { type: String, required: [true, 'A tour must have price'] },
});
const Tour = mongoose.model('Tour', tourSchema);

//! creating a new document and save it to our db
//? this testtour is an instance of our tour model. So it has a couple of methods that we can use to interact with db.
const testTour = new Tour({
  name: 'The Park Camper',
  price: 997,
});

//? this will save it to the tours collection in the database, it saves the document to the database; this save here will return a promise that we can consume later. In there we have access to document that we sent to database.
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(`ERROR: ${err}`);
  });

//! Starting server-------------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
