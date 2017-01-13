'use strict';

var mongoose = require('mongoose');
var moment = require('moment');

var challengeSchema = new mongoose.Schema({
  name: {type: String},
  description: {type: String},
  score: {type: Number},
  created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  preview_img: {type: String}
}, {
  timestamps: {
    createdAt: 'created_at'
  }
});

module.exports = mongoose.model('Challenge', challengeSchema);
