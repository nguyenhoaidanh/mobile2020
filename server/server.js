'use strict';

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

  

// var mongoose = require('mongoose'),
//   Schema = mongoose.Schema;

// mongoose.connect('mongodb+srv://root:root@cluster0-yz9ak.mongodb.net/test?retryWrites=true&w=majority');

// var UserSchema = new Schema({
//   email: {
//     type: String, required: true,
//     trim: true, unique: true,
//     match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
//   },
//   firstName: {type: String},
//   lastName: {type: String}
// });

// mongoose.model('User', UserSchema);
// var User = require('mongoose').model('User');

var app = express();

// //rest API requirements
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());
// //middleware for create
// var createUser = function (req, res, next) {
//   var user = new User(req.body);

//   user.save(function (err) {
//     if (err) {
//       next(err);
//     } else {
//       res.json(user);
//     }
//   });
// };

// var updateUser = function (req, res, next) {
//   User.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, user) {
//     if (err) {
//       next(err);
//     } else {
//       res.json(user);
//     }
//   });
// };

// var deleteUser = function (req, res, next) {
//   req.user.remove(function (err) {
//     if (err) {
//       next(err);
//     } else {
//       res.json(req.user);
//     }
//   });
// };

// var getAllUsers = function (req, res, next) {
//   User.find(function (err, users) {
//     if (err) {
//       next(err);
//     } else {
//       res.json(users);
//     }
//   });
// };

// var getOneUser = function (req, res) {
//   res.json(req.user);
// };

// var getByIdUser = function (req, res, next, id) {
//   User.findOne({_id: id}, function (err, user) {
//     if (err) {
//       next(err);
//     } else {
//       req.user = user;
//       next();
//     }
//   });
// };

// router.route('/user')
//   .post(createUser)
//   .get(getAllUsers);

// router.route('/users/:userId')
//   .get(getOneUser)
//   .put(updateUser)
//   .delete(deleteUser);
 
// router.param('userId', getByIdUser);

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use('/api/v1', router);
//jwt
app.use(jwt());
app.use(errorHandler);
//route
app.use('/users', require('./controller/auth.controller'));
app.use('/classes', require('./controller/class.controller'));
app.use('/rooms', require('./controller/room.controller'));
app.use('/sessions', require('./controller/session.controller'));

app.listen(3000);
module.exports = app;

