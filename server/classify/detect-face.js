// Copyright 2016 Google LLC
//

const vision = require('@google-cloud/vision');
// [END vision_face_detection_tutorial_imports]
// [START vision_face_detection_tutorial_client]
// Creates a client
const client = new vision.ImageAnnotatorClient();
module.exports={
    detectFaces
}
const fs = require('fs');
// [END vision_face_detection_tutorial_client]

/**
 * Uses the Vision API to detect faces in the given file.
 */
// [START vision_face_detection_tutorial_send_request]

async function _detectFaces(inputFile) {
  // Make a call to the Vision API to detect the faces
  const request = {image: {source: {filename: inputFile}}};
  const results = await client.faceDetection(request);
  const faces = results[0].faceAnnotations;
  const numFaces = faces.length;
  console.log(`Found ${numFaces} face${numFaces === 1 ? '' : 's'}.`);
  return faces;
}
// [END vision_face_detection_tutorial_send_request]

/**
 * Draws a polygon around the faces, then saves to outputFile.
 */
// [START vision_face_detection_tutorial_process_response]
async function highlightFaces(inputFile, faces, outputFile, PImage) {
  // Open the original image
  const stream = fs.createReadStream(inputFile);
  let promise;
 
  if (inputFile.match(/\.jpg$/)) {
    try{
        console.log("debug_0");
        promise = PImage.decodeJPEGFromStream(stream);
    }catch(e){
        console.log("LOi o day");
    }
    
  } else if (inputFile.match(/\.png$/)) {
    console.log("decode_lan_1");
    promise = PImage.decodePNGFromStream(stream);
    console.log("decode_lan_2");
  } else {
    throw new Error(`Unknown filename extension ${inputFile}`);
  }
  
  const img = await promise;
  console.log("decode_lan_3");
  const context = img.getContext('2d');
  context.drawImage(img, 0, 0, img.width, img.height, 0, 0);
  
  // Now draw boxes around all the faces
  context.strokeStyle = 'rgba(0,255,0,0.8)';
  context.lineWidth = '1';

  faces.forEach(face => {
    context.beginPath();
    let origX = 0;
    let origY = 0;
    face.boundingPoly.vertices.forEach((bounds, i) => {
      if (i === 0) {
        origX = bounds.x;
        origY = bounds.y;
        context.moveTo(bounds.x, bounds.y);
      } else {
        context.lineTo(bounds.x, bounds.y);
      }
    });
    context.lineTo(origX, origY);
    context.stroke();
  });

  // Write the result to a file
  console.log(`Writing to file ${outputFile}`);
  const writeStream = fs.createWriteStream(outputFile);
  await PImage.encodePNGToStream(img, writeStream);
}
// [END vision_face_detection_tutorial_process_response]

// Run the example
// [START vision_face_detection_tutorial_run_application]
async function detectFaces(inputFile, outputFile) {
  const PImage = require('pureimage');
  outputFile = outputFile || 'out.png';
  const faces = await _detectFaces(inputFile);
  console.log('Highlighting...');
  try{
    await highlightFaces(inputFile, faces, outputFile, PImage);
  }catch(err){
      console.log(err);
  }
  console.log('Finished!');
  return {num_face:faces.length,out:outputFile}
}
// [END vision_face_detection_tutorial_run_application]
// const args = process.argv.slice(2);
// main("./image/hehe.jpg","./image/hehe1.jpg")