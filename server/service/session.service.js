const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helper/db');
const Errorhandler = require('../helper/error');

const Session = db.Session;

const Room = db.Room;

const Class = db.Class;

const User = db.User;
module.exports = {
  getAll,
  getById,
  create,
  update,
  getAllSelf,
  getAllStudentInRoom,
};
async function getAllStudentInRoom(req,res){
  var result=[];  
  var session_of_students = await Session.find({room_id:req.params.id});
  if(!session_of_students)throw "Khong tim thay phong hoc";
  var class_obtain_room = await Class.findById(session_of_students.class_id);
  if(!class_obtain_room)throw "Khong tim thay lop hoc";
  var users_of_classes = await User.find({class_ids:{$all:[class_obtain_room]}});
  for(let ind=0;ind<users_of_classes.length;ind++){
    if(session_of_students.find(users_of_classes[ind]>0)){
      result.push({
        user:users_of_classes,
        isCheckin:true
      });
    }else{
      result.push({
        user:users_of_classes,
        isCheckin:false
      });
    }
  }
}
async function getAllSelf(req) {
  var collections = [];
  var session = await Session.find({ user_create: req.user.sub }).sort({ create_date: -1 });
  for (let count = 0; count < session.length; count++) {
    if (session[count]) {
      var room = await Room.findById(session[count].room_id);
      if (room) {
        var class_var = await Class.findById(room.class_id);
        if (class_var) {
          var author = await User.findById(class_var.user_create);
          class_var.user_create = author.fullname;
          var session_item = session[count];
          collections.push({ class: class_var, session: session_item });
        }
      }
    }
  }
  return collections;
}
async function getAll(req) {
  return await Session.find({ room_id: req.params.id, isAccept: true });
}

async function getById(req) {
  return await Session.findById(req.params.id);
}

async function create(request) {
  // validate
  console.log(request.body);
  var room = await Room.findOne({ _id: request.body.room_id });
  if (room) {
    //if (!room.isOpen) throw 'Room is closed';
    const user = await User.findById(request.user.sub);
    if (!user) throw 'User not found';
    if (!user.class_ids.filter((xid) => xid == room.class_id).length < 0) throw new Error('User not in this class ' + room.class_id);
    var session = await Session.findOne({ user_create: request.user.sub, room_id: request.body.room_id });
    //if (session && session.isAccept) throw 'Session exist';
    if (bcrypt.compareSync(request.body.secret_of_room + '', room.secret)) {
      if (!session) session = new Session(request.body);
      session.user_create = request.user.sub;
      return await session.save();
    }
    throw new Error('Secret of room incorrect');
  } else {
    throw new Error('Room not found');
  }
}

async function update(request, res) {
  const session = await Session.findById(request.body.session_id);
  // validate
  if (!session) throw 'Session not found';
  if (session.isAccept) throw 'Session exist';
  session.isAccept = true;
  session.user_create = request.user.sub;
  // copy userParam properties to user
  await session.save();
}
