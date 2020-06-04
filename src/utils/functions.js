import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import appConfig from '../constants/config';
import dayjs from 'dayjs';
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
  console.log('123456', 'call api', path);
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

export const setAvatar = (image, fromUrl = false) => {
  if (fromUrl) return { uri: appConfig.api_domain + image };
  return image.path ? { uri: image.path } : require('../../img/default-avatar.jpg');
};
export const shorterString = (str = '', maxlength) => {
  return str.length > maxlength ? str.substring(0, maxlength) + '...' : str;
};
export const formatTime = (time, strFormat = 'hh:mm DD-MM-YYYY') => {
  let denta = Date.parse(new Date()) - Date.parse(time);
  denta /= 1000;
  let min = Math.floor(denta / 60);
  if (min < 1) return `Vừa xong`;
  if (min < 60) return `${min} phút trước`;
  let hour = Math.floor(denta / 3600);
  if (hour < 24) return `${hour} giờ trước`;
  let day = Math.floor(denta / (24 * 3600));
  if (day < 1) return `Hôm nay lúc ${dayjs(time).format('hh:mm')}`;
  if (day < 2) return `Hôm qua lúc ${dayjs(time).format('hh:mm')}`;
  return dayjs(time).format(strFormat);
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
  }
  return AXIOS('/users/images/uploadfile', 'POST', formData, { onUploadProgress }, token, true);
};
