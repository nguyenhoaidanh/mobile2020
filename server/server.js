'use strict';
require('dotenv').config();
const constant = require('./helper/constant');
const bcrypt = require('bcryptjs');
const db = require("./helper/db");
const role = require('./helper/role');
//mongoose file must be loaded before all other files in order to provide
// models to other modules
var express = require('express'),
  router = express.Router(),
  bodyParser = require('body-parser');
const jwt = require('./helper/jwt');
const errorHandler = require('./helper/error');
const cors = require('cors');
var app = express();
var User = db.User;
const expressSwagger = require('express-swagger-generator')(app);
//option swagger
let options = {
  swaggerDefinition: {
      info: {
          description: 'This is a sample server',
          title: 'Swagger',
          version: '1.0.0',
      },
      host: 'localhost:3000',
      basePath: '/',
      produces: [
          "application/json",
          "application/xml"
      ],
      schemes: ['http', 'https'],
      securityDefinitions: {
          JWT: {
              type: 'apiKey',
              in: 'header',
              name: 'Authorization',
              description: "",
          }
      }
  },
  basedir: __dirname, //app absolute path
  files: ['./controller/*.js','./model/*.js','./helper/error.js'] //Path to the API handle folder
};
expressSwagger(options)
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
//mail public api
app.use('/mails/', require('./controller/mail.controller'));

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
async function init(){
  var user = await User.findOne({gmail:constant.ADMIN_GMAIL});
  if(!user){
    var user_new = new User();
    console.log(constant.ADMIN_GMAIL)
    user_new.gmail=constant.ADMIN_GMAIL;
    user_new.hash=bcrypt.hashSync(constant.ADMIN_PASS, 10);
    user_new.role=role.Admin;
    user_new.avatar_link="null";
    user_new.fullname="admin";
    user_new.mssv="1111111"
    user_new.username="admin"
    user_new.phone="1111111"
    user_new.save();
    console.log("Create Admin");
  }else{
    console.log("Admin Exist");
  }
}
init();
// app.use('/static/',express.static('store'));
app.listen(3000, () => {
  console.log(`app is running on port ${3000}`);
});

module.exports = app;
