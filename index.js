const express = require('express');
const app = express();
//const YouTubeInitializer = require('./youtube');
const multer  = require('multer');
const Youtube = require("youtube-api"),
  fs = require("fs"),
  readJson = require("r-json"),
  Lien = require("lien"),
  Logger = require("bug-killer"),
  opn = require("opn"),
  prettyBytes = require("pretty-bytes");

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

app.post('/media', upload.any(), function(req, res) {
  var video = fs.createReadStream(__dirname + '/' + req.files[0].path);
  console.log('parsing video');
  const CREDENTIALS = readJson(`${__dirname}/credentials.json`);
  var oauth = Youtube.authenticate({
    type: "oauth",
    client_id: CREDENTIALS.web.client_id,
    client_secret: CREDENTIALS.web.client_secret,
    redirect_url: CREDENTIALS.web.redirect_uris[0]
  });

  var creds = {
    access_token: "ya29.Ci9ZAzzMq0ps_1T3-sp0pjGjBu61dum9oFOfi9sbDxJ33LdSiITeoF7tqZWeHoRCrw",
    token_type: "Bearer",
    expiry_date: 1473458341502
  };

  oauth.setCredentials(creds);

  var youTubeUpload = Youtube.videos.insert({
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
      //body: fs.createReadStream("video.m4v")
    }
  }, (err, data) => {
    if (err) {
      console.log('error');
      res.status(500).json(err);
    } else {
      console.log('success');
      res.status(200).json(response);
    }
  });

  // setInterval(function () {
  //   Logger.log(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded.`);
  // }, 250);
});

const port = process.env.PORT || 9088;
app.listen(port);

// YouTubeInitializer.bootstrap()
//   .then(YouTube => {
//     global.YouTube = YouTube;
//     app.listen(9088);
//   });
