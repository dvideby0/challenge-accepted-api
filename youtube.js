"use strict";
/**
 * This script uploads a video (specifically `video.mp4` from the current
 * directory) to YouTube,
 *
 * To run this script you have to create OAuth2 credentials and download them
 * as JSON and replace the `credentials.json` file. Then install the
 * dependencies:
 *
 * npm i r-json lien opn bug-killer
 *
 * Don't forget to run an `npm i` to install the `youtube-api` dependencies.
 * */

const Youtube = require("youtube-api"),
  fs = require("fs"),
  readJson = require("r-json"),
  Lien = require("lien"),
  Logger = require("bug-killer"),
  opn = require("opn"),
  prettyBytes = require("pretty-bytes"),
  Promise = require('bluebird');

module.exports = {
  bootstrap: bootstrap
};

function bootstrap() {
  return new Promise(
    (resolve, reject) => {
      const CREDENTIALS = readJson(`${__dirname}/credentials.json`);
      let server = new Lien({
        host: "localhost",
        port: 5000
      });

      let oauth = Youtube.authenticate({
        type: "oauth",
        client_id: CREDENTIALS.web.client_id,
        client_secret: CREDENTIALS.web.client_secret,
        redirect_url: CREDENTIALS.web.redirect_uris[0]
      });

      Logger.log("Got the tokens.");
      var creds = {
        access_token: "ya29.Ci9ZA4SF0rUA-LOtJH4TDgPImULokDq1cTCDF_-7CbiC4s_5GQpudOZ4PZ8-6UpSVA",
        token_type: "Bearer",
        expiry_date: 1473447768602
      };

      oauth.setCredentials(creds);
      console.log('YouTube initialized');
      resolve(Youtube);
    }
  );
}


// // lien.end("The video is being uploaded. Check out the logs in the terminal.");
//
// var req = Youtube.videos.insert({
//     resource: {
//         // Video title and description
//         snippet: {
//             title: "Testing YoutTube API NodeJS module",
//             description: "Test video upload via YouTube API"
//         }
//         // I don't want to spam my subscribers
//         ,
//         status: {
//             privacyStatus: "private"
//         }
//     }
//     // This is for the callback function
//     ,
//     part: "snippet,status"
//
//     // Create the readable stream to upload the video
//     ,
//     media: {
//         body: fs.createReadStream("video.m4v")
//     }
// }, (err, data) => {
//     console.log("Done.");
//     process.exit();
// });
//
// setInterval(function() {
//     Logger.log(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded.`);
// }, 250);

