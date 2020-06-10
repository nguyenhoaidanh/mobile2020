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
  getAllSelf,
  getAllStudentInRoom,
};
async function getAllStudentInRoom(req,res){
  var result=[];  
  var session_of_students = await Session.find({room_id:req.params.id});
  // if(!session_of_students)throw {code:404,message:"Không tìm thấy phòng"};;
  var room = await Room.findById(req.params.id);
  if(!room)throw {code:404,message:"Không tìm thấy phòng"};;
  var class_obtain_room = await Class.findById(room.class_id);
  if(!class_obtain_room)throw {code:404,message:"Không tìm thấy lớp học"};
  console.log(class_obtain_room._id);
  var users_of_classes = await User.find({class_ids:{$all:[class_obtain_room._id]}},{list_images:0});
  console.log(users_of_classes);
  for(let ind=0;ind<users_of_classes.length;ind++){
    if(session_of_students.length>0 && session_of_students.includes(users_of_classes[ind])){
      result.push({
        user:users_of_classes[ind],
        isCheckin:true
      });
    }else{
      result.push({
        user:users_of_classes[ind],
        isCheckin:false
      });
    }
  }
  return {message:"Danh sách sinh viên trong phòng",object:result};
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
  return {object:collections,message:"Danh sách các phiên điểm danh"};
}
async function getAll(req) {
  return {message:"Danh sách điểm danh",object:await Session.find({ room_id: req.params.id})}
}

async function getById(req) {
  return {message:"Thông tin chi tiết về điểm danh",object:await Session.findById(req.params.id)}
}

async function create(request) {
  // validate
  console.log(request.body);
  const room = await Room.findOne({_id:request.body.room_id,isClosed:false,});
  if (!room) throw {code:404,message:"Phòng không còn khả dụng"};
    //if (!room.isOpen) throw 'Room is closed';
  if(req.body.list_users.length==0)throw {message:"Không có thông tin sinh viên",code:400};
  if (!bcrypt.compareSync(request.body.secret_of_room, room.secret)) throw {message:"Xác thực mã phòng học thất bại",code:400};
  for(let ind=0;ind<req.body.list_users.length;ind++){
    let user = await User.findById(req.body.list_users[ind]);
    if(!user)throw {code:404,message:"Không tìm thấy sinh viên"};
    if (!user.class_ids.filter((xid) => xid == room.class_id).length < 0) throw {message:"Phát hiện sinh viên "+user.fullname +" không nằm trong lớp học này",code:404};
    if(!await Session.findOne({ user_create: user._id, room_id: request.body.room_id }))throw {message:"Phát hiện sinh viên "+user.fullname +" đã điểm danh trước đó ",code:404};
    var session = new Session(request.body.session);
    session.user_create=req.user.sub;
    session.user_checkin_id=user._id;
    await session.save();
  }
  return {message:"Điểm danh thành công",object:null}
}