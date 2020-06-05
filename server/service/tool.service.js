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
var Request = require("request");
const { v4: uuidv4 } = require('uuid');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// var storage = require('@google-cloud/storage');

// Creates a client
// const storageClould = new Storage();
const csvWriter = createCsvWriter({
  append:true,
  path: dirmain+'/dataset/dataset.csv',
  header: [
    {id: 'type'},
    {id: 'link'},
    {id: 'label'},
  ]
});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dirmain + 'public/store/');
  },
  filename: async function (req, file, cb) {
    let file_new_name = req.user.sub + '-'+uuidv4() +'-'+ Date.now()+'.png';
    cb(null, file_new_name);
      try {
        fs.appendFile(dirmain + '/cache/'+req.user.sub, file_new_name + '\n', function (err) {
          if (err) throw err;
          
          console.log(file_new_name);
        });
      } catch (err) {
        throw err;
      }
    
  },
});
var upload = multer({ storage: storage }).array('images',11);

module.exports = {
  updateFileExpress,
  createBucket
};
async function updateFileExpress(req, res) {
  console.log(11, req.body);
  // if(!req.files || Object.keys(req.files).length==0){
  //     return res.status(400).send('No files were uploaded.');
  // }
  //muller
  upload(req, res, async function (err) {
    if(err){
      throw err;
    }
    //read bucket
    fs.readFile(dirmain + 'cache/' + req.user.sub, 'utf8', async function (err, data) {
      if (err) {
        return console.log(err);
      }
      var list_record=[];
      var paths = data
          .split('\n')
          .filter((el) => el != '');
      //upload bucket
      for (let ind = 0; ind<paths.length;ind++){
        var record = {
          type:"TRAIN",
        link:"gs://"+process.env.BUCKET_NAME+"/"+paths[ind],
        label:req.user.label}
        if(ind==0){
          record.type="TEST";
        }else if(ind==1){
          record.type="VALIDATION";
        }
        list_record.push(record);
        await tranferToBucket(paths[ind]);
      }
      //save
      csvWriter
        .writeRecords(list_record)
        .then(()=> console.log('The CSV file was written successfully'));

      var user = await User.findById(req.user.sub);
      user.list_images = [].concat(
        data
          .split('\n')
          .filter((el) => el != ''),
        user.list_images
      );
      //delete file image
      for (var ind=0;ind<paths.length;ind++){
        fs.unlink(dirmain + 'public/store/' +paths[ind], function (err) {
          if (err) throw err;
          console.log('File  '+paths[ind]+' deleted!');
        });
      }
      
      //delete cache
      fs.unlink(dirmain + 'cache/' + req.user.sub, function (err) {
        if (err) throw err;
        console.log('File deleted!');
      });
      await user.save();
      return user.list_images;
    });
    if (err instanceof multer.MulterError) {
      throw err;
    } else if (err) {
      throw err;
    }
  });
}
// async function updateImageForUser(req, res) {
//   var user = await User.findOne({ _id: req.user.sub });
//   var old_list_images = [];
//   old_list_images = user.list_images.map((x) => x);
//   if (user) {
//     for (let index = 0; index < req.body.length; index++) {
//       console.log(req.body[index]);
//       old_list_images.push(req.body[index]);
//     }
//     user.list_images = old_list_images;
//     user.save();
//     return 'Da cap nhat anh';
//   }
//   throw 'Not found user';
// }
// async function upFileToDrive(req,res){
//   var path = dirmain+'/public/store/1591029575425.jpg'
//   var formData = new FormData();
//   formData.append('images',fs.createReadStream(path));
//   formData.append('type','URL');
//   Request.get({
//     "headers": { "content-type": "application/json",
//   'Authorization':"Client-ID "+"bd57330c30c13d8"},
//     "url": "https://api.imgur.com/3/upload",
//     "body": formData
// }, (error, response, body) => {
//     if(error) {
//         return console.dir(error);
//     }
//     console.log(body);
//     console.log(error);
//     console.log("link");
// });
// }
async function createBucket(){
    // Imports the Google Cloud client library
    const {Storage} = require('@google-cloud/storage');

    // Creates a client
    const storage = new Storage({
      projectId: process.env.PROJECT_ID,
      keyFilename: dirmain+'/resource/'+process.env.CONFIG_GOOGLE_SERVICE
  });
    return await storage.createBucket("avatars"+"-mobileapp2020");
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
