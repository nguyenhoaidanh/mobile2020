const express = require('express');
const router = express.Router();
const toolService = require('../service/tool.service');
const authorize = require('../helper/authorize');
const role = require('../helper/role');

module.exports = router;

router.post('/uploadfile', authorize(), upload_file);
router.post('/', authorize(role.Student), update_image_for_user);
router.post('/avatars', authorize(role.Student), update_avatar);
router.post('/bucket', authorize(role.Student), create_bucket);
function upload_file(req, res, next) {
  toolService
    .updateFileExpress(req, res);
}
function update_image_for_user(req, res, next) {
  toolService
    .updateImageForUser(req, res)
    .then((result) => res.json({ result: result }))
    .catch((err) => next(err));
}
function update_avatar_for_user(req, res, next) {
  toolService
    .updateAvatar(req, res)
    .then((result) => res.json({ result: result }))
    .catch((err) => next(err));
}
function create_bucket(req, res, next) {
  toolService
    .createBucket()
    .then((result) => res.json({ result: result }))
    .catch((err) => next(err));
}
function update_avatar(req, res, next) {
  toolService
    .updateAvatar(req,res)
    .then((result) => res.json({ result: result }))
    .catch((err) => err=="Loi upload file"?
    res.status(400).send({message:err}):err=="Khong tim thay user"?
    res.status(404).send({message:err}):res.status(404).send({message:err}));
}
// function upload_file(req,res,next){
//     toolService.updateFileExpress(req,res)
//     .then((result)=>res.json({"result":result}))
//     .catch(err => next(err));
// }
