global.Promise = require('bluebird');
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
const bodyParser = require('body-parser')
const opn = require("opn");
const prettyBytes = require("pretty-bytes");
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Users = require('./models/user');
const Challenges = require('./models/challenge');
const Videos = require('./models/video');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/challenge-accepted', {});
mongoose.connection.on('error', function(err) {
  console.log(err);
});
mongoose.connection.on('connected', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('CONNECTION TO MONGODB ESTABLISHED');

    var path = require('path');
    var upload = multer({
      dest: './uploads'
    });

    app.use(session({secret: 'Hackathon lolol'}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bodyParser.json());

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

    app.post('/login', function(req, res) {
      Users.findOneAndUpdate({facebook_id: req.body.facebook_id}, {$set: req.body}, {upsert: true, new: true})
        .then(user => {
          res.status(200).json(user.toObject());
        })
        .catch(err => {
          res.status(500).json({error: err});
        });

    });
    app.get('/challenges', function(req, res) {
      Challenges.find({})
        .populate('created_by', '-email')
        .limit(20)
        .then(function(challenges) {
          res.status(200).json(challenges);
        });
    });

    app.post('/challenges', function(req, res) {
      Challenges.insert({$set: req.body})
        .then(function(challenge) {
          res.status(200).json(challenge.toObject());
        })
        .catch(function(err) {
          res.status(500).json({error: err});
        });
    });

    app.get('/challenges/:challenge_id/videos', function(req, res) {
      Videos.find({challenge_id: req.params.challenge_id})
        .sort({score: -1})
        .limit(20)
        .populate('created_by', '-email')
        .then(function(videos) {
          res.status(200).json(videos);
        });
    });

    app.get('users/:user_id/videos', function(req, res) {
      Videos.find({created_by: req.params.user_id})
        .limit(20)
        .populate('created_by', '-email')
        .then(function(videos) {
          res.status(200).json(videos);
        });
    });

    app.get('/users/:user_id', function(req, res) {
      Users.findOne({_id: req.params.user_id}, {email: 0})
        .then(function(user) {
          res.status(200).json(user);
        });
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
  }
});