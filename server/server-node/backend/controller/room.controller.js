const express = require('express');
const router = express.Router();
const roomService = require('../service/room.service');
const authorize = require('../helper/authorize')
const role = require('../helper/role');

module.exports = router;


router.post('/',authorize(role.Teacher),createRoom);
router.put('/',authorize(role.Teacher), updateRoom);
router.delete('/',authorize(role.Teacher), closeRoom);
router.get('/:id', getOneRoom);
router.get('/classes/:id',getAllRoom)

function createRoom(req, res, next){
    roomService.create(req)
    .then((result)=>res.json(result))
    .catch(err => next(err));
}
function closeRoom(){
    roomService.close(req)
    .then((result)=>res.json(result))
    .catch(err => next(err));
}
function updateRoom(){
    
}
function getOneRoom(req,res,next){

}
function getAllRoom(req,res,next){
    roomService.getAll(req)
    .then((result)=>res.json(result))
    .catch(err => next(err));
}