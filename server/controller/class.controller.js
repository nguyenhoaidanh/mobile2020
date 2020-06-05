const express = require('express');
const router = express.Router();
const classServie = require('../service/class.service');
const authorize = require('../helper/authorize');
const role = require('../helper/role');

module.exports = router;

router.post('/', authorize(role.Teacher), createClass);
router.put('/', authorize(role.Teacher), updateClass);
router.put('/update-class-for-user', authorize(), updateClassForUser);
router.delete('/', authorize(role.Teacher), removeClass);
router.get('/joined', authorize(), getAllClassOfStudent);

router.get('/:id', getOneClass);
router.get('/', authorize(role.Teacher), getAllClassOfTeacher);

function createClass(req, res, next) {
  classServie
    .create(req)
    .then((result) => res.json({ result: result }))
    .catch((err) => next(err));
}
function updateClassForUser(req, res, next) {
  classServie
    .updateClassForUser(req)
    .then((result) => res.json({ result: result }))
    .catch((err) => next(err));
}
function removeClass() {}
function updateClass() {}
function getOneClass(req, res, next) {
  classServie
    .getById(req.params.id)
    .then((result) => res.json({ result: result }))
    .catch((err) => res.status(404).json({ message: err }));
}
function getAllClassOfTeacher(req, res, next) {
  classServie
    .getAllRoleTeacher(req)
    .then((result) => res.json({ result }))
    .catch((err) => res.status(404).json({ message: err }));
}
function getAllClassOfStudent(req, res, next) {
  classServie
    .getAllRoleStudent(req)
    .then((result) => res.json({ result }))
    .catch((err) => res.status(404).json({ message: err }));
}
