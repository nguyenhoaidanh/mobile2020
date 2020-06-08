const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helper/db');

const Room = db.Room;
const Session = db.Session;
const Class = db.Class;
module.exports = {
  getAll,
  getById,
  isPassRoom,
  create,
  update,
  close,
};

async function getAll(req) {
  let rooms = await Room.find({ class_id: req.params.id });
  let rs = [];
  for (const room of rooms) {
    var session_of_students = await Session.find({ room_id: room.id });
    rs.push({ room, num_checked: session_of_students.length });
  }
  return rs;
}

async function getById(id) {
  return {object:await Room.findById(id),message:"Thông tin phòng học"};
}

async function create(request) {
  // validate
  console.log(request.body);
  var class_object = await Class.findOne({ _id: request.body.class_id });
  if (class_object) {
    if (bcrypt.compareSync(request.body.secret_create_room, class_object.secret)) {
      const room = new Room(request.body);
      room.secret = bcrypt.hashSync(request.body.secret, 10);
      room.user_create = request.user.sub;
      return await room.save();
    }
    throw {code:400,message:"Xác thực không thành công"};;
  } else {
    throw {code:404,message:"Không tìm thấy lớp học"};;
  }
}
async function close(request) {
  var room = await Room.findOne({_id:request.body.room_id,isClosed:false});
  
  if(!room)throw {code:404,message:"Không tìm thấy phòng"};
  
  if(bcrypt.compareSync(request.body.room_secret,room.secret)){
    room.isClosed=true;
    console.log("debug close room 1");
    await room.save();
    
  }
  return {message:"Đã đóng lớp học",object:room}
}
async function update(id, userParam) {
 
}
async function isPassRoom(request) {
  const room = await Room.findOne({_id:request.body.room_id,isClosed:false,start_time:{$lte: new Date.now()},end_time:{$gte:new Date.now()}});
  // validate
  if (!room) throw {code:404,message:"Phòng này không còn khả dụng"};
  if (request.body.secret) {
    if (bcrypt.compareSync(request.body.secret, room.secret)) {
      return {object:"",message:"Xác thực thành công"};;
    }
    throw {code:400,message:"Xác thực không thành công"};
  }
}
