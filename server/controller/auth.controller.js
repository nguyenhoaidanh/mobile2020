const express = require('express');
const router = express.Router();
const userService = require('../service/user.service');
const authorize = require('../helper/authorize');
const role = require('../helper/role');


router.post('/authenticate', authenticate);
router.post('/register',authorize(role.Admin), registerForStudent);
router.post('/teachers/register',authorize(role.Admin), registerForTeacher);
router.get('/:id', getOneUser);
router.get('/admin',authorize(role.Admin), getOneUser);

module.exports = router;
/**
 * @typedef Product
 * @property {integer} x.required
 * @property {integer} y.required - Some description for point - eg: 1234
 * @property {string} color
 * @property {enum} status - Status values that need to be considered for filter - eg: available,pending
 */

/**
 * This function comment is parsed by doctrine
 * sdfkjsldfkj
 * @route POST /users
 * @param {Product.model} point.body.required - the new point
 * @group foo - Operations about user
 * @param {string} email.query.required - username or email
 * @param {string} password.query.required - user's password.
 * @param {enum} status.query.required - Status values that need to be considered for filter - eg: available,pending
 * @operationId retrieveFooInfo
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {Response.model} 200 - An array of user info
 * @returns {Product.model}  default - Unexpected error
 * @returns {Array.<Point>} Point - Some description for point
 * @headers {integer} 200.X-Rate-Limit - calls per hour allowed by the user
 * @headers {string} 200.X-Expires-After - 	date in UTC when token expires
 * @security JWT
 */
function authenticate(req, res, next) {
  console.log(req.body);
  userService
    .authenticate(req.body)
    .then((result) => res.json(result))
    .catch((err) => res.status(err.code).send({message:err.message}));
}
function registerForStudent(req, res, next) {
  userService
    .createStudent(req.body)
    .then((result) => res.json(result))
    .catch((err) => res.status(err.code).send({message:err.message}));
}
function registerForTeacher(req, res, next) {
  console.log(req.body);
  userService
    .createTeacher(req.body)
    .then((result) => res.json(result))
    .catch((err) => res.status(err.code).send({message:err.message}));
}
function getOneUser(req, res, next) {
  userService
    .getById(req.body.id)
    .then((result) => res.json(result))
    .catch((err) => res.status(err.code).send({message:err.message}));
}
// var getOneUser = function (req, res) {
//   res.json(req.user);
// };
