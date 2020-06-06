'use strict';
require('dotenv').config();
//mongoose file must be loaded before all other files in order to provide
// models to other modules
var express = require('express'),
  router = express.Router(),
  bodyParser = require('body-parser'),
  swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json');
const jwt = require('./helper/jwt');
const errorHandler = require('./helper/error');
const cors = require('cors');
var app = express();

// //rest API requirements
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());

// logger
app.use('/**', (req, res, next) => {
  if (req.method != 'OPTIONS')
    console.log(`[${req.method}] ${req.originalUrl}
[Query] ${JSON.stringify(req.query)}
[Body] ${JSON.stringify(req.body)}
[Authorization] ${req.headers.authorization}\n`);
  next();
});

//testtttt
app.get('/test', async (req, res) => {
  let data = await require('./helper/db').User.find({});
  res.send(data);
});
//end testttt
app.use('/static', express.static('public'));
app.use('/', express.static('classify'));

//jwt
app.use(jwt());
app.use(errorHandler);
//route
app.use('/users', require('./controller/auth.controller'));
app.use('/users/images', require('./controller/user.controller'));
app.use('/classes', require('./controller/class.controller'));
app.use('/rooms', require('./controller/room.controller'));
app.use('/sessions', require('./controller/session.controller'));
app.use('/users/classify', require('./controller/classify.controller'));
app.get('/models', (req, res) => {
  res.sendFile(__dirname+'/classify/model.json');
});

// app.use('/static/',express.static('store'));
app.listen(3000, () => {
  console.log(`app is running on port ${3000}`);
});

module.exports = app;
