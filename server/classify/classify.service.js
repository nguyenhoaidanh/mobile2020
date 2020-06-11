//TensorFlow.js is an open-source hardware-accelerated JavaScript library
//for training and deploying machine learning models.
const tf = require('@tensorflow/tfjs');
const automl = require("@tensorflow/tfjs-automl");
const express = require('express');
const router = express.Router();
var multer = require('multer');
const {detectFaces} = require('./detect-face')
const { v4: uuidv4 } = require('uuid');
const db = require('../helper/db');
const User = db.User;
//MobileNet : pre-trained model for TensorFlow.js
//The module provides native TensorFlow execution
//in backend JavaScript applications under the Node.js runtime.
const tfnode = require('@tensorflow/tfjs-node');
var propertiesReader = require('properties-reader');
var properties = process.env.ENV_NODE=="product"?propertiesReader('properties.product.file'):propertiesReader('properties.dev.file');
// const automl = require('@tensorflow/tfjs-automl');
//The fs module provides an API for interacting with the file system.
module.exports={
  uploadFile
}
const fs = require('fs');
const model_url = properties.get('server.host.name')+":"+properties.get('server.host.port')+"/models";
// const model_url = "http://localhost:9000/test";
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/store/checkin');
  },
  filename: async function (req, file, cb) {
    let file_new_name = req.user.sub + '-'+uuidv4() +'-'+ Date.now()+'.'+file.originalname.split('.').pop();
    console.log(file.originalname);
    cb(null, file_new_name);
    //check type avatar
  },
});
var upload = multer({ storage: storage }).single('image');

const readImage = path => {
  //reads the entire contents of a file.
  //readFileSync() is synchronous and blocks execution until finished.
  const imageBuffer = fs.readFileSync(path);
  //Given the encoded bytes of an image,
  //it returns a 3D or 4D tensor of the decoded image. Supports BMP, GIF, JPEG and PNG formats.
  const tfimage = tfnode.node.decodeImage(imageBuffer);
  return tfimage;
}
async function uploadFile(req,res){
  await upload(req,res,async function(err){
    if(!req.file){
      res.status(400);
      res.send({message:"Lỗi upload file"});
    }
    const path_in = './public/store/checkin/'+req.file.filename;
    const path_out= './public/store/output/'+req.file.filename;
    console.log(req.file.filename);
    var faces = await detectFaces(path_in,path_out);

    var predict = await imageClassification(path_in);
    console.log(predict);
    predict=predict.sort((x,y)=>-x.prob+y.prob).filter((x)=>x.label!="None");
    predict=predict.filter((x)=>{console.log(x.prob>=0.3); return x.prob>=0.3});

    for (let ind=0;ind<predict.length;ind++){
      var user = await User.findOne({mssv:predict[ind].label.split('_').pop()});
      if(user)predict[ind].label=user;
    }
    console.log(predict);
    res.status(200);
    res.send({result:{predict:predict,out_image:faces.out.replace("./public",""),num_faces:faces.num_face}});
    // console.log(faces);
  });
  // console.log(result);
}
async function imageClassification(path){
  const image = readImage(path);
  // Load the model.
  // const handler = tfnode.io.fileSystem(model_url);
  console.log("model loading...");
  const model = await automl.loadImageClassification(model_url);
  console.log(model);
  console.log("model loaded");
  const predictions = await model.classify(image);
  return predictions;
}

// if (process.argv.length !== 3) throw new Error('Incorrect arguments: node classify.js <IMAGE_FILE>');

// imageClassification(process.argv[2]);

