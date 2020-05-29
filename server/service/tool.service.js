const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helper/db');
var formidable = require('formidable');
var fs = require('fs');
path = require('path')
const express = require('express');
const fileUpload = require('express-fileupload');
const User = db.User;
var multer  = require('multer')
var dirmain = path.join(__dirname, '../');
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, dirmain+'/public/store/');
    },
    filename: async function (req, file, cb) {
      let file_new_name = file.fieldname + '-' + Date.now()+'-'+file.filename+'.jpg';
      cb(null, file_new_name);
      let user = await User.findOne({_id:req.user.sub});
      if(user){
          let array_images = user.list_images;
          try{
            array_images=[].concat(array_images,[file_new_name])
            user.list_images=array_images;
            
            fs.appendFile(dirmain+"/cache/file"+'-'+req.user.sub, file_new_name+'\n', function (err) {
                if (err) throw err;
                console.log(file_new_name);
              });
          }catch(err){
            throw err;
          }
         
      }
    }
  })
var upload = multer({ storage:storage}).array("images")


module.exports = {
    upFile,
    updateImageForUser,
    updateFileExpress
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
async function updateFileExpress(req,res){
    console.log(req.body);
    // if(!req.files || Object.keys(req.files).length==0){
    //     return res.status(400).send('No files were uploaded.');
    // }
    upload(req,res,async function(agr,err){
        console.log(agr);
        fs.readFile(dirmain+"/cache/file-"+req.user.sub, 'utf8',async function (err,data) {
            if (err) {
              return console.log(err);
            }
            var user = await User.findById(req.user.sub);
            user.list_images=[].concat(data.split('\n').filter((el)=>el!='').map((el)=>process.env.HOST+"/static/store/"+el),user.list_images);
            // user.list_images=[];
            await user.save();
            fs.unlink(dirmain+"/cache/file-"+req.user.sub, function (err) {
                if (err) throw err;
                console.log('File deleted!');
              });
            console.log("save");
          });
        if (err instanceof multer.MulterError) {
           throw err;
          } else if (err) {
            throw err;
        }
    });
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