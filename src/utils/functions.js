import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import appConfig from '../constants/config';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-community/async-storage';
import { list_screen_map, goolge_url } from '../constants/constants';
export const showImageInput = ({ multiple = false, useFrontCamera = false, picker, camera, cropping = false, callback = () => {} }) => {
  let func = ImagePicker.openPicker;
  if (camera) func = ImagePicker.openCamera;
  func({
    cropping,
    useFrontCamera,
    multiple,
  })
    .then((image) => {
      callback(image);
    })
    .catch((err) => {
      console.log('lỗi ', err);
    });
};
export const AXIOS = function (path, method = 'GET', data = {}, option = {}, token = '', isFile = false) {
  console.log('123456', 'call api', method, path);
  let url = appConfig.api_domain + path;
  let config = {
    method,
    url,
    data,
    timeout: 10 * 1000,
    headers: {
      Authorization: 'bearer ' + token,
    },
    ...option,
  };
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
export const changeTime = (str = '') => {
  //05:01 PM, 26-06-2020 => 1231231232312
  const hm = str.split(', ')[0];
  const dmy = str.split(', ')[1];
  const hour = +hm.split(':')[0] + (str.toLowerCase().includes('pm') ? 12 : 0);
  const min = +hm.split(':')[1].split(' ')[0];
  console.log(123456, dmy);
  const day = +dmy.split('-')[0];
  const mon = +dmy.split('-')[1];
  const year = +dmy.split('-')[2];
  return new Date(year, mon - 1, day, hour, min, 0, 0).getTime();
};
export const setAvatar = (image) => {
  // return require('../../img/default-avatar.jpg');
  if (typeof image == 'string') {
    return { uri: appConfig.api_domain + '/static' + image };
  }
  return image.path ? { uri: image.path } : require('../../img/default-avatar.jpg');
};
export const shorterString = (str = '', maxlength) => {
  return str.length > maxlength ? str.substring(0, maxlength) + '...' : str;
};
export const formatTime = (time, strFormat = 'hh:mm A, DD-MM-YYYY') => {
  if (!isNaN(+time)) {
    time = +time;
  }
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
export const uploadFileToServer = (listFile, token, path, method = 'POST', onUploadProgress = () => {}) => {
  var formData = new FormData();
  for (var i = 0; i < listFile.length; i++) {
    var file = listFile[i];
    const fileName = file.path.split('/').pop();
    formData.append(listFile.length > 1 ? 'images' : 'image', {
      uri: file.path,
      type: `image/${file.path.split('.').pop()}`,
      name: fileName,
    });
  }
  return AXIOS(path || '/users/images/uploadfile', method, formData, { onUploadProgress, timeout: 1000 * 30 * listFile.length }, token, true);
};
export const checkTokenExpire = (err, that) => {
  console.log('123456', 'errror axios');
  if (err.response && err.response.data) {
    console.log(123456, err.response.data);
    if (JSON.stringify(err.response.data).includes('token')) {
      AsyncStorage.removeItem('@userInfo');
      that.props.appActions.logout();
      that.props.appActions.setCurScreent({ currentScreent: list_screen_map.home });
      that.props.history.push('/');
    }
  } else console.log(123456, err.toString());
};
