const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helper/db');

const Room = db.Room;

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
  return await Room.find({ class_id: req.params.id });
}

async function getById(req) {
  return await Room.findById(req.params.id);
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
    throw 'Secret of class incorrect';
  } else {
    throw 'Class not found';
  }
}
async function close(request) {
  const room = await Room.findById(request.query.id);
  if (!room) throw 'Room not found';
  room.isOpen = false;
  return room.save();
}
async function update(id, userParam) {
  const user = await User.findById(id);

  // validate
  if (!user) throw 'User not found';
  if (user.username !== userParam.username && (await User.findOne({ username: userParam.username }))) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  // hash password if it was entered
  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();
}
async function isPassRoom(request) {
  const room = await Room.findById(request.body.room_id);
  // validate
  if (!room) throw 'Room not found';
  if (request.body.secret) {
    if (bcrypt.compareSync(request.body.secret, room.secret)) {
      return 'Xac thuc thanh cong';
    }
    throw 'Xac thuc khong thanh cong';
  }
}
