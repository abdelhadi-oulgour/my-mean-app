const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique:true }, //String here with an uppercase
  password: { type: String, required: false }
});

userSchema.plugin(uniqueValidator); //validation to have a unique user befor saving to database

module.exports = mongoose.model('User', userSchema);
