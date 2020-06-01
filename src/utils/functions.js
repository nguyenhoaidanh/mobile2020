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
export const AXIOS = function (path, method = 'GET', data = {}, option = {}, token = '', isFile = false) {
  let url = appConfig.api_domain + path;
  let config = {
    method,
    url,
    data,
    timeout: 2 * 60 * 1000,
    headers: {
      Authorization: 'bearer ' + token,
    },
    ...option,
  };
  if (isFile) config.headers['Content-Type'] = 'multipart/form-data';
  return axios(config);
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
export const shorterString = (str = '', maxlength) => {
  return str.length > maxlength ? str.substring(0, maxlength) + '...' : str;
};

export const uploadFileToServer = (listFile, token, onUploadProgress = () => {}) => {
  var formData = new FormData();
  for (var i = 0; i < listFile.length; i++) {
    var file = listFile[i];
    console.log(123456, 'hi', file);
    formData.append('images', {
      uri: file.path,
      type: `image/${file.path.split('.').pop()}`,
      name: file.path.split('/').pop(),
    });
    formData.append('images', {
      uri: file.path,
      type: `image/${file.path.split('.').pop()}2`,
      name: file.path.split('/').pop(),
    });
  }
  return AXIOS('/users/images/uploadfile', 'POST', formData, { onUploadProgress }, token, true);
};
