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

//! Starting server-------------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
