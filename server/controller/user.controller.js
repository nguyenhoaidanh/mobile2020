const express = require('express');
const router = express.Router();
const toolService = require('../service/tool.service');
const authorize = require('../helper/authorize')
const role = require('../helper/role');

module.exports = router;


router.post('/uploadfile',authorize(role.Student),upload_file);
router.post('/',authorize(role.Student),update_image_for_user);
function upload_file(req,res,next){
    toolService.upFile(req,res)
    .then((result)=>res.json({"result":result}))
    .catch(err => next(err));   
}
function update_image_for_user(req,res,next){
    toolService.updateImageForUser(req,res)
    .then((result)=>res.json({"result":result}))
    .catch(err => next(err));   
}