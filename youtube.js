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

// lien.end("The video is being uploaded. Check out the logs in the terminal.");

const CREDENTIALS = readJson(`${__dirname}/credentials.json`);
var oauth = Youtube.authenticate({
  type: "oauth",
  client_id: CREDENTIALS.web.client_id,
  client_secret: CREDENTIALS.web.client_secret,
  redirect_url: CREDENTIALS.web.redirect_uris[0]
});

Logger.log("Got the tokens.");
var creds = {
  access_token: "ya29.Ci9ZAzzMq0ps_1T3-sp0pjGjBu61dum9oFOfi9sbDxJ33LdSiITeoF7tqZWeHoRCrw",
  token_type: "Bearer",
  expiry_date: 1473458341502
};

oauth.setCredentials(creds);

var req = Youtube.videos.insert({
    resource: {
        // Video title and description
        snippet: {
            title: "Testing YoutTube API NodeJS module",
            description: "Test video upload via YouTube API"
        }
        // I don't want to spam my subscribers
        ,
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
        body: fs.createReadStream("video.m4v")
    }
}, (err, data) => {
    console.log("Done.");
    process.exit();
});

setInterval(function() {
    Logger.log(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded.`);
}, 250);

