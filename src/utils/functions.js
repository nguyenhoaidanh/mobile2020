import ImagePicker from 'react-native-image-crop-picker';
export const showImageInput = ({ picker, camera, width = 300, height = 400, cropping = false, callback = () => {} }) => {
  let func = ImagePicker.openPicker;
  if (camera) func = ImagePicker.openCamera;
  func({
    width,
    height,
    cropping,
  })
    .then((image) => {
      callback(image);
    })
    .catch((err) => {
      console.log('lỗi ', err);
    });
};
