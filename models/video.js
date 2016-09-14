'use strict';

var mongoose = require('mongoose');
var  moment = require('moment');

var videoSchema = new mongoose.Schema({
    challenge_id: {type: mongoose.Schema.Types.ObjectId},
    created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    youtube_id: {type: String},
    created_at: {type: Date},
    score: {type: Number}
  }
);

module.exports = mongoose.model('Video', videoSchema);
