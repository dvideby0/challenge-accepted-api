const express = require('express');
const app = express();
const YouTubeInitializer = require('./youtube');
const multer  = require('multer');
var fs = require('fs');
var path = require('path');
var upload = multer({
  dest: './uploads'
});

const response = [
  {id: 1, name: 'challenge 1', youtube_id: 'jdYJf_ybyVo'},
  {id: 2, name: 'Doing some crazy shit', youtube_id: 'a8dUPENLs70'},
  {id: 3, name: 'challenge 3', youtube_id: '7I6eI7hUruY'}
];


app.get('/*', function(req, res) {
  console.log('I was called');
  res.status(200).json(response);
});

app.post('/media', upload.single('video'), function(req, res) {
  var video = fs.createReadStream(req.file.path);
  var youTubeUpload = YouTube.videos.insert({
    resource: {
      // Video title and description
      snippet: {
        title: "Testing YoutTube API NodeJS module",
        description: "Test video upload via YouTube API"
      },
      status: {
        privacyStatus: "private"
      }
    }
    // This is for the callback function
    ,
    part: "snippet,status"

    // Create the readable stream to upload the video
    ,
    media: {
      body: video
    }
  }, (err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(response);
    }
  });

  // setInterval(function () {
  //   Logger.log(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded.`);
  // }, 250);
});

YouTubeInitializer.bootstrap()
  .then(YouTube => {
    global.YouTube = YouTube;
    app.listen(9088);
  });
