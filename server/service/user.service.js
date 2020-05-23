const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helper/db');
const role =require('../helper/role')
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    createStudent,
    createTeacher,
    update,
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id,username:user.fullname,role:user.role }, process.env.SECRET);
        return {
            ...user.toJSON(),
            token
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
    console.log(userParam.username)

    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }
    console.log("username not find-create")
    userParam.role=role.Student;
    const user = new User(userParam);
    // hash password
    user.hash = bcrypt.hashSync(userParam.hash, 10);
    // save user
    await user.save();
}
async function createTeacher(userParam) {
    // validate
    console.log(userParam.username)

    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }
    console.log("username not find-create")
    userParam.role=role.Teacher;
    const user = new User(userParam);

    // hash password

        user.hash = bcrypt.hashSync(userParam.hash, 10);
    // save user
    await user.save();
}
async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
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
