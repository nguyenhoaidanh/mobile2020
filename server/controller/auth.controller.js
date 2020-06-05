const express = require('express');
const router = express.Router();
const userService = require('../service/user.service');
router.post('/authenticate', authenticate);
router.post('/register', registerForStudent);
router.post('/teachers/register', registerForTeacher);
router.get('/:id', getOneUser);

module.exports = router;

function authenticate(req, res, next) {
  console.log(req.body);
  userService
    .authenticate(req.body)
    .then((user) => (user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' })))
    .catch((err) => next(err));
}
function registerForStudent(req, res, next) {
  userService
    .createStudent(req.body)
    .then(() => res.json({ result: 'dang ky thanh cong' }))
    .catch((err) => next(err));
}
function registerForTeacher(req, res, next) {
  console.log(req.body);
  userService
    .createTeacher(req.body)
    .then(() => res.json({ result: 'dang ky thanh cong' }))
    .catch((err) => next(err));
}
function getOneUser(req, res, next) {
  userService
    .getById(req.body.id)
    .then((result) => res.json({ result: result }))
    .catch((err) => res.status(404).json({ message: err }));
}
// var getOneUser = function (req, res) {
//   res.json(req.user);
// };
