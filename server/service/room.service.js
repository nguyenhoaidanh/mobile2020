const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helper/db');

const Room = db.Room;
const Session = db.Session;
const Class = db.Class;
const User = db.User;
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
   // var session_of_students = await Session.find({ room_id: room.id });
    rs.push({room});
  }
  return {message:"Danh sách các phòng",object:rs};
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
      room.start_time=request.body.start_time;
      room.end_time=request.body.end_time;
      room.user_create = request.user.sub;
      return {message:"Tạo phòng thành công",object:await room.save()};
    }
    throw {code:400,message:"Xác thực không thành công"};
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
    return {message:"Đã đóng phòng học",object:await room.save()};
    
  }else
  throw {code:400,message:"Xác thực không thành công"};
}
async function update(req) {
    if(!req.body.room_id||!req.body.user_pass)throw {code:400,message:"Vui lòng điền đầy đủ thông tin"};
    var user = await User.findById(req.user.sub);
    var room = await Room.findOne({_id:req.body.room_id,isClosed:false});
    if(!room) throw {code:404,message:"Phòng này không còn khả dụng"};
    if(!(room.user_create==req.user.sub))throw {code:404,message:"Bạn không có quyền chỉnh sửa phòng"};
    if(!bcrypt.compareSync(req.body.user_pass,user.hash))throw {code:404,message:"Xác thực không thành công"};
    if(req.body.title)
    room.title=req.body.title;
    if(req.body.start_time)
    room.start_time=req.body.start_time;
    if(req.body.end_time)
    room.end_time=req.body.end_time;
    if(req.body.number)
    room.number=req.body.number;
    if(req.body.secret){
      room.secret = bcrypt.hashSync(req.body.secret, 10);
    }
    return {message:"Cập nhật thành công",object:await room.save()}
}
async function isPassRoom(request) {
  const room = await Room.findOne({_id:request.body.room_id,isClosed:false});
  // validate
  //
  console.log(Date.now())
  console.log(Number(room.start_time))
  if (!room||Number(room.start_time)>Date.now()||Number(room.end_time)<Date.now()) throw {code:404,message:"Phòng này không còn khả dụng"};
  if (request.body.secret) {
    if (bcrypt.compareSync(request.body.secret, room.secret)) {
      return {object:"",message:"Xác thực thành công"};;
    }
    throw {code:400,message:"Xác thực không thành công"};
  }
}
