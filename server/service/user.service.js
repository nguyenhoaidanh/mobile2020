const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helper/db');
const role = require('../helper/role');
const utils = require('../utils/string');
var multer = require('multer');

const User = db.User;

module.exports = {
  authenticate,
  getAll,
  getById,
  createStudent,
  createTeacher,
  update,
  update_password,
  updateAvatar,
};
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dirmain + 'public/store/avatar');
  },
  filename: async function (req, file, cb) {
    let file_new_name = req.user.sub + '-'+uuidv4() +'-'+ Date.now()+file.originalname.split('.').pop();
    console.log(file_new_name)
    cb(null, file_new_name);
    
    //check type avatar 
  },
});
var upload = multer({ storage: storage }).array('images',11);
async function authenticate({ username, password }) {
  let user = await User.findOne({ phone: username });
  if (!user) user = await User.findOne({ gmail: username });
  console.log(132, user);
  var label = utils.removeAccents(user.fullname.split(' ')[user.fullname.split(' ').length - 1]) + '_' + user.mssv;
  if (user && bcrypt.compareSync(password, user.hash)) {
    const token = jwt.sign(
      { sub: user.id, username: user.fullname, mssv: user.mssv, role: user.role, label: label, link_avatar: user.link_avatar },
      process.env.SECRET
    );
    return {
      ...user.toJSON(),
      token,
    };
  }
}
async function getAll() {
  return await User.find();
}

async function getById(id) {
  return await User.findById(id);
}

async function createStudent(userParam) {
  // validate
  // if (await User.findOne({ username: userParam.username })) {
  //   throw 'Tên đăng nhập đã được sử dụng';
  // }
  if (await User.findOne({ phone: userParam.phone })) {
    throw 'Số điện thoại đã được sử dụng';
  }
  if (await User.findOne({ gmail: userParam.gmail })) {
    throw 'Địa chỉ email đã được sử dụng';
  }
  if (await User.findOne({ mssv: userParam.mssv })) {
    throw 'Mssv đã được sử dụng';
  }
  userParam.role = role.Student;
  const user = new User(userParam);
  user.avatar_link = '5ed9e6f4ea0271b177435352-1591368306749.jpg';
  // hash password
  user.hash = bcrypt.hashSync(userParam.hash, 10);
  // save user
  await user.save();
}
async function createTeacher(userParam) {
  // validate
  console.log(userParam.username);

  if (await User.findOne({ username: userParam.username })) {
    throw 'Username "' + userParam.username + '" is already taken';
  }
  console.log('username not find-create');
  userParam.role = role.Teacher;
  const user = new User(userParam);
  user.link_avatar = '5ed9e6f4ea0271b177435352-1591368306749.jpg';

  // hash password

  user.hash = bcrypt.hashSync(userParam.hash, 10);
  // save user
  await user.save();
}
async function update(user_param) {
  const user = await User.findById(user_param.id);
  var user_clone = user;
  // validate
  if (!user) throw 'User not found';
  Object.assign(user, userParam);
  user.hash = user_clone.hash;
  user.gmail = user_clone.gmail;
  user.mssv = user_clone.mssv;
  user.username = user_clone.username;
  user.role = user_clone.role;
  user.class_ids = user_clone.class_ids;
  user.list_images = user_clone.list_images;
  // hash password if it was entered

  // copy userParam properties to user
  return await user.save();
}
async function updateAvatar(req,res){
  var user = await User.findById(req.user.sub);
  if(!user){
    res.status(404);
    res.send({message:'Khong tim thay user'});
  }else{
    upload(req, res, async function (err) {
    if(!req.files){
      throw "Chon file upload";
    }
    var filename = req.files.map((file)=>file.filename)[0];
    user.avatar_link="/store/avatar"+filename;
    user.save();
    });
    var update_user = await User.findById(req.user.sub);
    if(update_user){
      console.log(update_user.avatar_link)
      if(user.avatar_link!=update_user.avatar_link){
        return update_user.avatar_link;
      }else{
        throw "Loi upload file";
      }
    }
    throw "user khong duoc tim thay";
  }
}
async function update_password(user_param) {
  const user = await User.findById(user_param.id);
  if (!user) throw 'User not found';
  if (bcrypt.compareSync(user_param.old_password, user.hash)) {
    user.hash = bcrypt.hashSync(user_param.new_password, 10);
  }
  await user.save();
  return 'Doi mat khau thanh cong';
}
