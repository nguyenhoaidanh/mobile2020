const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helper/db');
const Errorhandler = require('../helper/error');

const Session = db.Session;

const Room = db.Room;

const User = db.User;
module.exports = {
    getAll,
    getById,
    create,
    update,
    getAllSelf
};


async function getAllSelf(req) {
    return await Session.find({create_user:req.user.sub});
}
async function getAll(req) {
    return await Session.find({room_id:req.params.id});
}


async function getById(req) {
    return await Session.findById(req.params.id);
}

async function create(request) {
    // validate
    console.log(request.body)
    var room = await Room.findOne({_id:request.body.room_id});
    if (room) {
        if(!room.isOpen)throw 'Room is closed';
        const user = await User.findById(request.user.sub);
        if(!user)throw 'User not found';
        if(!user.class_ids.filter(xid=>xid==room.class_id).length<0)throw new Error('User not in this class '+room.class_id);
        var session = await Session.findOne({user_create:request.user.sub,room_id:request.body.room_id});
        if(session&&session.isAccept) throw 'Session exist';
        if(bcrypt.compareSync(request.body.secret_of_room, room.secret)){
            if(!session)session = new Session(request.body);
            session.user_create = request.user.sub;
            return await session.save();
        }
        throw new Error('Secret of room incorrect');
    }else{
        throw new Error('Room not found');
    }
}

async function update(request,res) {
    const session = await Session.findById(request.body.session_id);
    // validate
    if (!session) throw 'Session not found';
    if(session.isAccept)throw ('Session exist');
    session.isAccept=true;
    session.user_create=request.user.sub
    // copy userParam properties to user
    await session.save();
}
