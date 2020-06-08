const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helper/db');
const { ObjectId } = require('mongodb');

const Class = db.Class;
const User = db.User;
module.exports = {
  getById,
  create,
  updateSecret,
  updateManyClassForUser,
  updateClassForManyUsers,
  getAllRoleTeacher,
  getAllRoleStudent,
};

async function getAllRoleTeacher(req) {
  return  { object:await Class.find({ teacher_id: req.params.id}),message: 'Thông tin tất cả lớp học' };
}
async function getAllRoleStudent(req) {
  const user = await User.findOne({ _id: req.params.id });
  if (!user)  throw { code:404,message: 'Không tìm thấy sinh viên' };;
  var list_class = [];
  for (let i = 0; i < user.class_ids.length; i++) {
    const class_object = await Class.findOne({ _id: user.class_ids[i]});
    if (!class_object) throw {message:"Không tìm thấy lớp học",code:404}
    const teacher = await User.findOne({ _id: class_object.teacher_id });
    list_class.push({class:class_object,teacher:teacher});
  }
  console.log(list_class);
  return { object:list_class,message: 'Thông tin tất cả lớp học' };
}
async function getById(id) {
  return {message:"Thông tin chi tiết lớp học",object:await Class.findById(id)};
}

async function create(request, res) {
  // validate
  console.log(request.body.code_subject);

  if (await Class.findOne({ code_subject: request.body.code_subject, code_class: request.body.code_class, semester: request.body.semester })) {
    throw  { code:400,message: 'Thông tin về lớp học đã tồn tại' };
  }
  var user = await User.findOne({_id:request.body.teacher_id});
  if (!user) {
    console.log(404);
    throw { code:404,message: 'Không tìm thấy giảng viên' };
  }
  const class_object = new Class(request.body);
  // hash password
  class_object.user_create = request.user.sub;
  class_object.secret = bcrypt.hashSync(request.body.secret, 10);
  // save user
  return {object:await class_object.save(),message:"Tạo lớp học thành công"};
}

async function updateSecret(req) {
  const class_object = await Class.findById(req.body.class_id);

  // validate
  if (!class_object) throw { code:404,message: 'Không tìm thấy lớp học' };
  // hash password if it was entered
  if (!req.body.new_secret&&!req.body.old_secret) throw {message:"Vui lòng nhập đầy đủ thông tin"}
  if (!bcrypt.compareSync(req.body.old_secret,class_object.secret)) throw {message:"Mật khẩu cũ sai"}
  class_object.secret = bcrypt.hashSync(req.body.new_secret, 10);
  // copy userParam properties to user
  // Object.assign(user, userParam);
  return {message:"Cập nhật mật khẩu thành công",object:await class_object.save()};
}
async function updateManyClassForUser(request) {
  const user = await User.findById(request.user.sub);
  if (!user) throw { code:404,message: 'Không tìm thấy sinh viên' };;
  var list_class = request.body.map((element) => element.class_id);
  console.log(list_class);
  var newArray = user.class_ids;

  newArray = [].concat(newArray, list_class);
  console.log(newArray);
  user.class_ids = [...new Set(newArray)];
  return {message:"Cập nhật thành công lớp học cho sinh viên",object:await user.save()};
}
async function updateClassForManyUsers(request, res) {
  var list_undifine_user = [];
  var list_user = request.body.users;
  var class_object = await Class.findOne({_id:request.body.class_id});
  if (!class_object) {
    throw { code:404,message: 'Không tìm thấy lớp học' };
  } else {
    for (var stu in list_user) {
      var user = await User.findOne({ mssv: list_user[stu] });
      if (!user) {
        list_undifine_user.push(list_user[stu]);
      } else {
        if(user.class_ids.length!=0&&!user.class_ids.includes(request.body.class_id)!=-1)throw {message:"Sinh viên "+user.mssv+" đã được thêm trước đó",code:400};
        user.class_ids = [...new Set([].concat([class_object._id], user.class_ids))];
        await user.save();
      }
    }
    return {message:"Thông tin cập nhật lớp học", object: {list_unupdate_user:list_undifine_user}};
  }
}
