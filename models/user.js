'use strict';

var mongoose = require('mongoose');
var  moment = require('moment');

var userSchema = new mongoose.Schema({
  name: {type: String},
  profile_picture: {type: String},
  email: {type: String}
});

module.exports = mongoose.model('User', userSchema);
