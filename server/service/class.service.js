const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helper/db');
const { ObjectId } = require('mongodb');

const Class = db.Class;
const User = db.User;
module.exports = {
  getById,
  create,
  update,
  updateManyClassForUser,
  updateClassForManyUsers,
  getAllRoleTeacher,
  getAllRoleStudent,
};

async function getAllRoleTeacher(req) {
  return await Class.find({ user_create: req.user.sub });
}
async function getAllRoleStudent(req) {
  const user = await User.findOne({ _id: req.user.sub });
  if (!user) throw 'User not found';
  var list_class = [];
  for (let i = 0; i < user.class_ids.length; i++) {
    var object = await Class.findOne({ _id: user.class_ids[i] });
    if (object) {
      if (object.teacher_id) {
        const teacher = await User.findOne({ _id: object.teacher_id });
        object.teacher = teacher;
      }
      list_class.push(object);
    }
  }
  return list_class;
}
async function getById(id) {
  return await Class.findById(id);
}

async function create(request, res) {
  // validate
  console.log(request.body.code_subject);

  if (await Class.findOne({ code_subject: request.body.code_subject, code_class: request.body.code_class, semester: request.body.semester })) {
    throw 'Class "' + request.body.code_subject + '" is already taken';
  }
  if (!(await User.findById(request.body.teacher_id))) {
    res.status(404);
    res.send({ message: 'Teacher khong ton tai' });
  }
  const class_object = new Class(request.body);
  // hash password
  class_object.user_create = request.user.sub;
  class_object.secret = bcrypt.hashSync(request.body.secret, 10);
  // save user
  await class_object.save();
  return await Class.findOne({ code_subject: request.body.code_subject, code_class: request.body.code_class, semester: request.body.semester });
}

async function update(class_param) {
  const class_object = await Class.findById(class_param.id);

  // validate
  if (!class_object) throw 'User not found';
  // hash password if it was entered
  if (class_param.secret) {
    class_object.secret = bcrypt.hashSync(class_param.secret, 10);
  }
  // copy userParam properties to user
  // Object.assign(user, userParam);
  return await class_object.save();
}
async function updateManyClassForUser(request) {
  const user = await User.findById(request.user.sub);
  if (!user) throw 'User not found';
  var list_class = request.body.map((element) => element.class_id);
  console.log(list_class);
  var newArray = user.class_ids;

  newArray = [].concat(newArray, list_class);
  console.log(newArray);
  user.class_ids = [...new Set(newArray)];
  return await user.save();
}
async function updateClassForManyUsers(request, res) {
  var list_undifine_user = [];
  var list_user = request.body.users.map((stu) => stu.mssv);
  var class_object = await Class.findOne({ code_subject: request.body.code_subject, code_class: request.body.code_class, semester: request.body.semester });
  if (!class_object) {
    res.status(404);
    res.send({ message: 'Khong tim thay lop hoc' });
  } else {
    for (var stu in list_user) {
      var user = await User.findOne({ mssv: stu });
      if (!user) {
        list_undifine_user.push(stu);
      } else {
        user.class_ids = [...new Set([].concat([class_object._id], user.class_ids))];
        await user.save();
      }
    }
    return { list_undifine_user: list_undifine_user };
  }
}
