const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helper/db');
var formidable = require('formidable');
var fs = require('fs');
path = require('path')

const User = db.User;

module.exports = {
    upFile,
    updateImageForUser
}
async function upFile(req,res){
    var form = formidable.IncomingForm();
    form.parse(req);
    let dirmain = path.join(__dirname, '../');
    // old_list_array=user.list_images;
    // user.list_images=[]
    var old_list_array=[]
    form.on('fileBegin', function (name, file){
        file.name = new Date().getTime()+"."+file.name.split(".").pop();
        file.path = dirmain + '/public/store/' + file.name;
        old_list_array.push(process.env.HOST+"/static/store/"+file.name)
        // non rename file 
    });
    form.on('file',  function (name, file){
        console.log('Uploaded ' + file.name);   
    });
    // user.list_images=old_list_array;
    // await user.save()
    return old_list_array;
}
async function updateImageForUser(req,res){
    var user = await User.findOne({_id:req.user.sub});
    var old_list_images=[]
    old_list_images=user.list_images.map(x=>x);
    if(user){
        for(let index  = 0;index<req.body.length;index++){
            console.log(req.body[index])
            old_list_images.push(req.body[index]);
        }
        user.list_images=old_list_images;
        user.save();
        return "Da cap nhat anh"
    }
    throw "Not found user"
}