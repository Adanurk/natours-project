const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel.js');

dotenv.config({ path: './config.env' });

console.log(process.env.DATABASE);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

//! READ JSON FILE------------------------------------
const tours = JSON.parse(fs.readFileSync(__dirname + '/tours.json', 'utf-8'));
// json.parse converts it into js object

//! IMPORT DATA TO DB---------------------------------
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

//! DELETE ALL DATA FROM COLLECTION------------------
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfuly deleted!');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
