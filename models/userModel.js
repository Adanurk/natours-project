const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

//! Creating mongoose model ----------------------------------------------
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide us your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //! This only works on create & save
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  //! Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  //! hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //! delete the confirmPassword field
  this.passwordConfirm = undefined;
  next();
});

//! an instance method is a function that will be available in all documents of a certain collection.

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  //False means NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
