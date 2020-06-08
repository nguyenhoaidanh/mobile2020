const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helper/db');
var formidable = require('formidable');
var fs = require('fs');
path = require('path');
const express = require('express');
const User = db.User;
var multer = require('multer');
var dirmain = path.join(__dirname, '../');
var fs = require('fs');
var Request = require('request');
const { v4: uuidv4 } = require('uuid');
const {detectFaces} = require('./../classify/detect-face')

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// var storage = require('@google-cloud/storage');

// Creates a client
// const storageClould = new Storage();
const csvWriter = createCsvWriter({
  append: true,
  path: dirmain + '/dataset/dataset.csv',
  header: [{ id: 'type' }, { id: 'link' }, { id: 'label' }],
});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dirmain + 'public/store/');
  },
  filename: async function (req, file, cb) {
    let file_new_name = req.user.sub + '-'+uuidv4() +'-'+ Date.now()+"."+file.originalname.split('.').pop();
    console.log(file_new_name)
    cb(null, file_new_name);

    //check type avatar
  },
});
var upload = multer({ storage: storage }).array('images', 10);

module.exports = {
  updateFileExpress,
  createBucket,
  // updateAvatar
};

async function updateFileExpress(req, res) {
  await upload(req, res, async function (err) {
    if (err) {
      throw err;
    }
    var records =[];
    var filenames = req.files.map((file)=>file.filename);
    var user = await User.findById(req.user.sub);
    if(!user){
      res.status(404);
      res.send({message:"Không tìm thấy user"});
      return;
    }else{
      for(let ind=0;ind<filenames.length;ind++){
        if(ind==0){
          records.push({
            type:"TEST",
            link:"gs://"+process.env.BUCKET_NAME+"/"+filenames[ind],
            label:req.user.label
          });
        } else if (ind == 1) {
          records.push({
            type:"VALIDATION",
            link:"gs://"+process.env.BUCKET_NAME+"/"+filenames[ind],
            label:req.user.label
          });
        } else {
          records.push({
            type:"TRAIN",
            link:"gs://"+process.env.BUCKET_NAME+"/"+filenames[ind],
            label:req.user.label
          });
        }
        await tranferToBucket('./public/store/'+filenames[ind],process.env.BUCKET_IMAGE_NAME);
        console.log("upload image to bucket: "+filenames[ind]);
      }
       csvWriter.writeRecords(records);
    }
    filenames = filenames.map((e) => '/static/store/' + e);
    user.list_images = [].concat(user.list_images, filenames);
    await user.save();
    for(let ind=0;ind<filenames.length;ind++){
        fs.unlink('./public/store/'+filenames[ind],(err)=>{
          if(err){
            console.log(err);
          }
        });
    }
    res.status(200);
    res.send({message:"Danh sách datataset",object:user.list_images})
  });
}
async function createBucket() {
  // Imports the Google Cloud client library
  const { Storage } = require('@google-cloud/storage');

  // Creates a client
  const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: dirmain + '/resource/' + process.env.CONFIG_GOOGLE_SERVICE,
  });
    return await storage.createBucket(process.env.BUCKET_NAME,{
      location:process.env.BUCKET_LOCATION
    });
}
async function tranferToBucket(path) {
    // Imports the Google Cloud client library
    const {Storage} = require('@google-cloud/storage');
    // Creates a client
    const storage = new Storage({
      projectId: process.env.PROJECT_ID,
      keyFilename: dirmain+'/resource/'+process.env.CONFIG_GOOGLE_SERVICE
  });
  await storage.bucket(process.env.BUCKET_NAME).upload(dirmain+'public/store/'+path,function(err,file){
    if(err)throw err;
    console.log("tranfer to Bucket"+path);
  });
}
// async function updateAvatar(req,res){
//   var user = await User.findById(req.user.sub);
//   if(!user){
//     res.status(404);
//     res.send({message:'Khong tim thay user'});
//   }else{
//     upload(req, res, async function (err) {
//     if(!req.files){
//       throw "Chon file upload";
//     }
//     var filename = req.files.map((file)=>file.filename)[0];
//     user.avatar_link=filename;
//     user.save();
//     });
//     var update_user = await User.findById(req.user.sub);
//     if(update_user){
//       console.log(update_user.avatar_link)
//       if(user.avatar_link!=update_user.avatar_link){
//         return update_user.avatar_link;
//       }else{
//         throw "Loi upload file";
//       }
//     }
//     throw "user khong duoc tim thay";
//   }
// }
