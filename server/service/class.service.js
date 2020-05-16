const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helper/db');
const {ObjectId} = require('mongodb')

const Class = db.Class;
const User = db.User;
module.exports = {

    getById,
    create,
    update,
    updateClassForUser,
    getAllRoleTeacher,
    getAllRoleStudent
};


async function getAllRoleTeacher(req) {
    return await Class.find({user_create:req.user.sub});
}
async function getAllRoleStudent(req) {
    console.log(req.user.sub)
    const user = await User.findOne({_id:req.user.sub});
    if(!user) throw "User not found";
    var list_class = [];
    console.log(user.username);
    console.log(user.class_ids[1])
    for (let i=0;i<user.class_ids.length;i++){
        console.log(i)
        var object = await Class.findOne({_id:user.class_ids[i]});
        if(object)
            list_class.push(object);
    }
    console.log(list_class)
    return list_class;
}
async function getById(id) {
    return await Class.findById(id);
}

async function create(request) {
    // validate
    console.log(request.body.code_subject)

    if (await Class.findOne({ code_subject: request.body.code_subject,code_class:request.body.code_class,hocky:request.body.hocky})) {
        throw 'Class "' + request.body.code_subject + '" is already taken';
    }
    console.log("class not find-create")
    const class_object = new Class(request.body);

    // hash password
    class_object.user_create=request.user.sub
    class_object.secret = bcrypt.hashSync(request.body.secret, 10);
    // save user
    await class_object.save();
    return await Class.findOne({ code_subject: request.body.code_subject,code_class:request.body.code_class,hocky:request.body.hocky})
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
async function updateClassForUser(request){
    const user = await User.findById(request.user.sub);
    if(!user) throw "User not found";
    var list_class = request.body.map(element=>element.class_id);
    console.log(list_class)
    var newArray =user.class_ids;

    newArray=[].concat(newArray,list_class);
    console.log(newArray);
    user.class_ids=[...new Set(newArray)];
    return await user.save();
}
