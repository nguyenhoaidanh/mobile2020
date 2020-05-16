const express = require('express');
const router = express.Router();
const sessionService = require('../service/session.service');
const authorize = require('../helper/authorize')
const role = require('../helper/role');

module.exports = router;


router.post('/authorize',authorize(role.Student),createSession);
router.put('/',authorize(role.Student), updateSession);
// router.delete('/',authorize(role.Teacher), removeSession);
router.get('/:id',authorize(role.Teacher), getOneSession);
router.get('/',authorize(role.Teacher),getAllSession)
router.get('/',authorize(role.Student),getAllSelfSession)

function createSession(req, res, next){
    sessionService.create(req)
    .then((result)=>res.json(result))
    .catch(err => res.status(400).json({message:err}));
}
function removeSession(){

}
function updateSession(req, res, next){
    sessionService.update(req,res)
    .then((result)=>res.json({"message":"Checkin thanh cong"}))
    .catch(err => res.status(400).json({message:err}));
}
function getOneSession(){

}
function getAllSession(){

}
function getAllSelfSession(){

}