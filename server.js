// Ops are generally actions for endpoints, meta is for help/error message output
const { ops, meta } = require('./commands')
// REMINDER: ops[CMD](input, disJsMessage, disJsClient)

// TODO: npm i --save express
// TODO: check all this lmao writing blind here
const espresso = require('express');
const app = espresso();

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('', (req, res) => {
  
});

app.get('/coin', (req, res) => {
  const response = ops['coin']();
  res.send(response);
});
