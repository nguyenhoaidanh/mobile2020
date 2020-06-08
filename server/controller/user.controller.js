const express = require('express');
const router = express.Router();
const toolService = require('../service/tool.service');
const userService = require('../service/user.service');

const authorize = require('../helper/authorize');
const role = require('../helper/role');

module.exports = router;

router.post('/uploadfile', authorize(), upload_file);
// router.post('/', authorize(role.Student), update_image_for_user);
router.put('/avatars', update_avatar);
router.post('/bucket', authorize(role.Admin), create_bucket);
router.get('/infor', get_self);
/**
 * @typedef Response_Image
 * @property {string} message
 * @property {Array.<String>} object
 */
/**
 * @typedef Object_Images
 * @property {Array.<String>} String
 */
/**
 * Update image to training
 * @route POST /users/uploadfile
 * @group User - API information user
 * @param  {images} - a file jpg, minimum = 10
 * @returns {Response_Image.model} 200 - Update success
 * @returns {Error_401.model} 401 - Invalid Token
 * @security JWT
 */

function upload_file(req, res, next) {
  toolService
    .updateFileExpress(req, res);
}
// function update_image_for_user(req, res, next) {
//   toolService
//     .updateImageForUser(req, res)
//     .then((result) => res.json({ result: result }))
//     .catch((err) => res.status(err.code==null?500:err.code).send({message:err.message}));
// }
function create_bucket(req, res, next) {
  toolService
    .createBucket()
    .then((result) => res.json(result))
    .catch((err) => res.status(err.code==null?500:err.code).send({message:err.message}));
}
/**
 * @typedef Response_UserInfo
 * @property {string} message
 * @property {User.model} object
 */
/**
 * Get information user
 * @route GET /users/infor
 * @group User - API information user
 * @returns {Response_UserInfo.model} 200 - Information User
 * @returns {Error_401.model} 401 - Invalid Token
 * @security JWT
 */
function get_self(req, res, next) {
  userService
    .getSelf(req)
    .then((result) => res.json(result))
    .catch((err) => res.status(err.code==null?500:err.code).send({message:err.message}));
}
/**
 * @typedef Response_avatar
 * @property {string} message
 * @property {string} object
 */
/**
 * Update avatar
 * @route PUT /users/avatars
 * @group User - API information user
 * @file  image - a file jpg or png
 * @returns {Response_avatar.model} 200 - Update success
 * @returns {Error_401.model} 401 - Invalid Token
 * @security JWT
 */
function update_avatar(req, res, next) {
  userService.updateAvatar(req,res);
}
// function upload_file(req,res,next){
//     toolService.updateFileExpress(req,res)
//     .then((result)=>res.json({"result":result}))
//     .catch(err => next(err));
// }
