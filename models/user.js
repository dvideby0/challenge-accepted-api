'use strict';

var mongoose = require('mongoose');
var  moment = require('moment');

var userSchema = new mongoose.Schema({
  name: {type: String},
  email: {type: String},
  facebook_id: {type: String}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'last_updated'
  }
});

module.exports = mongoose.model('User', userSchema);
