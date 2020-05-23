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
router.get('/rooms/:id',authorize(role.Teacher),getAllSession)
router.get('/joined/class/:id',authorize(role.Student),getAllSelfSession)

function createSession(req, res, next){
    sessionService.create(req)
    .then((result)=>res.json({"result":result}))
    .catch(err => res.status(400).json({message:err}));
}
function removeSession(){

}
function updateSession(req, res, next){
    sessionService.update(req,res)
    .then((result)=>res.json({"result":result}))
    .catch(err => res.status(400).json({message:err}));
}
function getOneSession(req,res,next){
    sessionService.getById(req,res)
    .then((result)=>res.json({"result":result}))
    .catch(err => res.status(400).json({message:err}));
}
function getAllSession(req,res,next){
    sessionService.getAll(req,res)
    .then((result)=>res.json({"result":result}))
    .catch(err => res.status(400).json({message:err}));
}
function getAllSelfSession(){

}