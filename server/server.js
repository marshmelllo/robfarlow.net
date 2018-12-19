require('babel-polyfill');
require('dotenv').config({ path: '.env.production' });
const debug = require('debug');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const database = require('./database');

const log = debug('robfarlow.com:sever');

const app = express();
const html = path.join(__dirname, 'index.html');


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use('/static', express.static(__dirname));
app.use('*/js',express.static(__dirname));
app.enable('trust proxy', true);
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

app.get('/', (req, res, next) => {
  res.sendFile(html);
  next();
});

app.get('*', (req, res, next) => {
  const now = new Date();
  log('connection', req.ip, `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
  next();
});

app.listen(5000, () => {
  log('listening on port 5000');
});