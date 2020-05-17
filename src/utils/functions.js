import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import appConfig from '../constants/config';
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
export const AXIOS = function (path, method = 'GET', data = {}, option = {}) {
  let url = appConfig.api_domain + path;
  let config = {
    method,
    url,
    data,
    timeout: 2 * 60 * 1000,
    // headers: {
    //   Authorization: getCookie('access-token')
    // }
    ...option,
    //onUploadProgress
  };
  return axios(config).catch((err) => {
    console.log('[err when call axios]');
    console.log(err);
  });
};
export const shadow = () => ({
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 9,
  },
  shadowOpacity: 0.5,
  shadowRadius: 12.35,
  elevation: 19,
});

export const setAvatar = (image) => {
  return image.path ? { uri: image.path } : require('../../img/default-avatar.jpg');
};
