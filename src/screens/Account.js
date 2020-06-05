import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Avatar, Divider, Card, ListItem } from 'react-native-elements';
import cStyles from '../constants/common-styles';
import ImageInput from '../components/ImageInput';
import { showImageInput, setAvatar, shorterString, AXIOS, uploadFileToServer } from '../utils/functions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import { list_screen_map } from '../constants/constants';
import AsyncStorage from '@react-native-community/async-storage';
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  hr: { backgroundColor: 'blue' },
  ava: {
    backgroundColor: 'transparent',
    height: 220,
    alignItems: 'center',
    paddingTop: 15,
  },
  start: { alignItems: 'flex-start', width: '30%' },
  end: { alignItems: 'flex-end', width: '70%' },
  textLeft: { fontSize: 20, color: 'grey' },
  textRight: { fontSize: 20, color: 'grey', fontWeight: 'bold' },
});
const mapKey = {
  username: 'Tên',
  email: 'Email',
  gmail: 'Email',
  male: 'Giới tính',
  birthday: 'Ngày sinh',
  faculty: 'Khoa',
  phone: 'Điện thọai',
  mssv: 'Mssv',
  khoa: 'Khoa',
  nien_khoa: 'Niên khóa',
  role: 'Tài khoản',
};
const mapIcon = {
  phone: 'phone',
  username: 'user',
  male: 'male',
  faculty: 'graduation-cap',
  khoa: 'graduation-cap',
  mssv: 'graduation-cap',
  email: 'envelope-o',
  gmail: 'envelope-o',
  birthday: 'calendar',
  nien_khoa: 'calendar',
  role: 'user',
};
const account_map = { teacher: 'Giáo viên', student: 'Sinh viên' };
type Props = {};
class Home extends Component<Props> {
  state = {
    userInfo: this.props.userInfo,
  };
  logout = () => {
    AsyncStorage.removeItem('@userInfo');
    this.props.appActions.logout();
    this.props.appActions.setCurScreent({ currentScreent: list_screen_map.home });
    this.props.history.push('/');
  };
  onchange = (name, value) => {
    this.setState({ userInfo: { ...this.state.userInfo, [name]: value } });
  };
  setImage = (image) => {
    console.log(123456, image);
    uploadFileToServer([image], this.props.userInfo.token, (progressEvent) => {
      const { loaded, total } = progressEvent;
      let percent = Math.floor((loaded / total) * 100);
    })
      .then(({ data }) => {
        console.log('123456', 11, data);
        AXIOS('/users/images', 'POST', data.result, {}, this.props.userInfo.token)
          .then((resp) => {
            console.log('123456', 11, resp);
            const { list_images = [] } = this.props.userInfo;
            this.props.appActions.setUserInfo({ userInfo: { list_images: list_images.concat(data.result) } });
          })
          .catch((err) => {
            console.log('123456', 2, err.response.data);
          });
      })
      .catch((err) => {
        console.log('123456', 2, err.response.data);
      });
    this.setState({ image });
  };
  showImageInput = () => {
    showImageInput({ picker: true, callback: this.setImage });
  };
  update = () => {
    const { userInfo = {} } = this.state;
    const { phone = '' } = userInfo;
    if (!phone) return;
    if ((phone + '').length < 10) {
      return this.setState({ errorMessage: { phone: 'Số điện thoại không hợp lệ' } });
    }
    const user = { phone };
    console.log('123456', user);
    AXIOS('/users', 'PUT', user, {}, this.props.userInfo.token)
      .then((data) => {
        console.log('123456', 1, data);
        this.onchange('phone', phone);
        this.setState({ edit: false });
      })
      .catch((err) => {
        console.log('123456', 2, err.response.data);
        this.showAlert('Có lỗi xảy ra');
      });
  };
  showAlert = (msg) => {
    Alert.alert('Thông báo', msg, [
      {
        text: 'Đã hiểu',
      },
    ]);
  };
  cancel = () => {
    this.setState({ edit: false });
  };
  renderItem = (key, value) => {
    const keys = ['fullname', 'token', 'list_images', 'create_date', 'class_ids', 'id'];
    if (keys.includes(key)) return;
    value = key == 'role' ? account_map[value.toLowerCase()] : value;
    if (key == 'male') {
      value = value ? 'Nam' : 'Nữ';
    }
    return (
      <ListItem
        key={key}
        chevron
        bottomDivider
        leftIcon={<Icon name={mapIcon[key]} size={20} color={'black'} />}
        title={
          <View style={styles.row}>
            <View style={styles.start}>
              <Text style={{ fontSize: 18 }}>{mapKey[key]}</Text>
            </View>
            <View style={styles.end}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{shorterString(value, 16)}</Text>
            </View>
          </View>
        }
        bottomDivider
      />
    );
  };
  componentWillReceiveProps(props) {
    this.setState({ userInfo: props.userInfo });
  }
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { errorMessage = {}, edit = false, image = {}, userInfo = {} } = this.state;
    const { username = '', mssv = '', list_images = [], phone } = userInfo;
    const avaSource = list_images.length ? setAvatar(list_images.slice(-1)[0], true) : setAvatar(image);
    const infos = [];
    console.log(123456, userInfo);
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column' }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {edit ? null : (
            <View style={styles.ava}>
              <View>
                <Avatar
                  onPress={this.showImageInput}
                  onAccessoryPress={this.showImageInput}
                  rounded
                  size="xlarge"
                  source={avaSource}
                  showAccessory
                  accessory={{
                    name: 'plus-circle',
                    type: 'font-awesome',
                    color: 'white',
                    underlayColor: 'gray',
                    size: 30,
                  }}
                />
              </View>
              <Text style={{ fontSize: 30, color: 'white', fontWeight: 'bold' }}>{username}</Text>
            </View>
          )}
          <Card
            title={
              <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10 }}>
                <View style={{ alignItems: 'center', width: '100%' }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                    <Text style={{ color: 'green' }}>{!edit ? 'Thông tin cá nhân   ' : 'Chỉnh sửa thông tin'} </Text>
                    {edit ? null : (
                      <Icon style={{ paddingLeft: 20, marginLeft: 10 }} name="edit" onPress={() => this.setState({ edit: !edit })} size={20} color={'green'} />
                    )}
                  </Text>
                </View>
              </View>
            }
            containerStyle={{ margin: 10, padding: 0, backgroundColor: '#E9EBEE' }}
          >
            {edit ? (
              <View style={{ padding: 20 }}>
                <Input
                  label="Số điện thoại"
                  errorStyle={cStyles.errorStyle}
                  errorMessage={errorMessage.phone}
                  value={phone}
                  leftIcon={<Icon name="phone" size={iconSize} color={iconColor} />}
                  onChangeText={(value) => this.onchange('phone', value)}
                  maxLength={10}
                  keyboardType="numeric"
                />
                <View style={{ width: '100%', flexDirection: 'row' }}>
                  <Button
                    containerStyle={{ width: '50%', alignSelf: 'center' }}
                    titleStyle={cStyles.btnText}
                    buttonStyle={{ borderRadius: 20, backgroundColor: 'brown', width: '90%' }}
                    title="Hủy bỏ"
                    onPress={this.cancel}
                  />
                  <Button
                    containerStyle={{ width: '50%', alignSelf: 'center' }}
                    titleStyle={cStyles.btnText}
                    buttonStyle={{ borderRadius: 20, width: '90%' }}
                    title="Lưu"
                    onPress={this.update}
                  />
                </View>
              </View>
            ) : (
              <View>
                {Object.keys(userInfo).map((key, i) => this.renderItem(key, userInfo[key]))}
                <ListItem
                  containerStyle={{ backgroundColor: '#F5F5F5' }}
                  onPress={this.logout}
                  bottomDivider
                  title={
                    <View style={{ width: '100%' }}>
                      <Text style={{ fontWeight: 'bold', color: 'red', fontSize: 18, alignSelf: 'center' }}>Đăng xuất</Text>
                    </View>
                  }
                  bottomDivider
                />
              </View>
            )}
          </Card>
          <View style={{ height: 65 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    app: state.app,
    userInfo: state.user.userInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
