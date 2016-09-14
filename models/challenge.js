'use strict';

var mongoose = require('mongoose');
var moment = require('moment');

var challengeSchema = new mongoose.Schema({
  name: {type: String},
  created_at: {type: Date},
  Description: {type: String},
  score: {type: Number},
  created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  preview_img: {type: String}
});

module.exports = mongoose.model('Challenge', challengeSchema);
