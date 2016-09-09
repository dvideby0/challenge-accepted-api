const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const response = [
  {id: 1, name: 'challenge 1', youtube_id: 'jdYJf_ybyVo'},
  {id: 2, name: 'Doing some crazy shit', youtube_id: 'a8dUPENLs70'},
  {id: 3, name: 'challenge 3', youtube_id: '7I6eI7hUruY'}
];

app.use(bodyParser.json({limit: '1mb'}));

app.get('/*', function(req, res) {
  console.log('I was called');
  res.status(200).json(response);
});

app.post('/*', function(req, res) {
  console.log(req.headers);
  res.status(200).json({success: true});
});

const port = process.env.PORT || 9088;
app.listen(port);
