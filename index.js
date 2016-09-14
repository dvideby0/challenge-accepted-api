const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const YouTubeV3Strategy = require('passport-youtube-v3').Strategy;
const multer = require('multer');
const Youtube = require("youtube-api");
const fs = require("fs");
const readJson = require("r-json");
const Lien = require("lien");
const Logger = require("bug-killer");
const opn = require("opn");
const prettyBytes = require("pretty-bytes");

var path = require('path');
var upload = multer({
  dest: './uploads'
});

const response = [
  {id: 1, name: 'challenge 1', youtube_id: 'jdYJf_ybyVo', profile_picture: 'http://www.american.edu/uploads/profiles/large/chris_palmer_profile_11.jpg', has_challenges: true},
  {id: 2, name: 'Doing some crazy shit', youtube_id: 'a8dUPENLs70', profile_picture: 'https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg', has_challenges: true},
  {id: 3, name: 'challenge 3', youtube_id: '7I6eI7hUruY', profile_picture: 'http://www.american.edu/uploads/profiles/large/chris_palmer_profile_11.jpg', has_challenges: false},
  {id: 4, name: 'Fail at Life', youtube_id: 'ijfvh_-bA8w', profile_picture: 'https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg', has_challenges: true}
];

app.use(session({secret: 'Hackathon lolol'}));
app.use(passport.initialize());
app.use(passport.session());

// YouTube OAuth
passport.use(new YouTubeV3Strategy({
    clientID: '860173744538-b0aqlks6lpg6u1j1o1krree26j217qc3.apps.googleusercontent.com',
    clientSecret: '80TX8Qlsyky2cTyG1zvZR7ut',
    callbackURL: 'http://localhost:9088/auth/youtube/callback',
    scope: ['https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtube.upload']
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, {
      accessToken: accessToken,
      refreshToken: refreshToken,
      profile: profile
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/auth/youtube', passport.authenticate('youtube'));
app.get('/auth/youtube/callback', passport.authenticate('youtube', {
  successRedirect: '/auth/youtube/success',
  failureRedirect: '/auth/youtube/error'
}));
app.get('/auth/youtube/success', function(req, res) {
  console.log(req.user);
  res.status(200).json(req.user);
});
app.get('/auth/youtube/error', function(req, res) {
  res.status(401).json({message: 'OH NOES'});
});

app.get('/', function(req, res) {
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
    access_token: "ya29.Ci9aA57WYy2USKtxsbIezkCS-g13TwqiFmuTQwh1niN5Dff0X6HrSK75-jNaPgCUKg",
    token_type: "Bearer"
  };

  oauth.setCredentials(creds);

  var youTubeUpload = Youtube.videos.insert({
    resource: {
      // Video title and description
      snippet: {
        title: "Testing YouTube API NodeJS module",
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
console.log('App started on port ' + port);

// YouTubeInitializer.bootstrap()
//   .then(YouTube => {
//     global.YouTube = YouTube;
//     app.listen(9088);
//   });
