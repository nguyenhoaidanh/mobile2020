import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, KeyboardAvoidingView, ScrollView } from 'react-native';
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
  email: 'Địa chỉ email',
  gmail: 'Địa chỉ email',
  male: 'Giới tính',
  birthday: 'Ngày sinh',
  faculty: 'Khoa',
  phone: 'Số điện thọai',
  mssv: 'Mssv',
  khoa: 'Khoa',
  nien_khoa: 'Niên khóa',
  role: 'Loại tài khoản',
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
type Props = {};
class Home extends Component<Props> {
  state = {};
  logout = () => {
    AsyncStorage.removeItem('@userInfo');
    this.props.appActions.logout();
    this.props.appActions.setCurScreent({ currentScreent: list_screen_map.home });
    this.props.history.push('/');
  };
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  setImage = (image) => {
    console.log(123456, image);
    uploadFileToServer([image], this.props.userInfo.token, (progressEvent) => {
      const { loaded, total } = progressEvent;
      let percent = Math.floor((loaded / total) * 100);
      console.log(123456, 'percent', percent);
    })
      .then(({ data }) => {
        console.log('123456', 11, data);
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
    console.log('update');
  };
  renderItem = (key, value) => {
    const keys = ['fullname', 'token', 'list_images', 'create_date', 'class_ids', 'id'];
    if (keys.includes(key)) return;

    return (
      <ListItem
        key={key}
        chevron
        bottomDivider
        leftIcon={<Icon name={mapIcon[key]} size={18} color={'black'} />}
        title={
          <View style={styles.row}>
            <View style={styles.start}>
              <Text>{mapKey[key]}</Text>
            </View>
            <View style={styles.end}>
              <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{shorterString(value, 20)}</Text>
            </View>
          </View>
        }
        bottomDivider
      />
    );
  };
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { errorMessage = {}, edit = false, image = {} } = this.state;
    let { userInfo = {} } = this.props;
    if (!userInfo.username)
      userInfo = { username: 'Nguyễn Hoài Danh', male: 'male', birthday: '03/02/1998', faculty: 'KH & KT Máy tính', email: '1610391@hcmut.edu.vn' };
    const { username = '', mssv = '' } = userInfo;
    const infos = [];
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column' }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.ava}>
            <View>
              <Avatar
                onPress={this.showImageInput}
                onAccessoryPress={this.showImageInput}
                rounded
                size="xlarge"
                source={setAvatar(image)}
                showAccessory
                accessory={{
                  name: image.path ? 'mode-edit' : 'plus-circle',
                  type: image.path ? 'material' : 'font-awesome',
                  color: 'white',
                  underlayColor: 'gray',
                  size: 30,
                }}
              />
            </View>
            <Text style={{ fontSize: 30, color: 'white' }}>{username}</Text>
          </View>

          <Card
            title={
              <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10 }}>
                <View style={{ alignItems: 'center', width: '100%' }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                    <Text>{'Thông tin cá nhân' + '   '} </Text>
                    <Icon style={{ paddingLeft: 20, marginLeft: 10 }} name="edit" onPress={() => this.setState({ edit: !edit })} size={20} color={iconColor} />
                  </Text>
                </View>
              </View>
            }
            containerStyle={{ margin: 10, padding: 0, backgroundColor: '#E9EBEE' }}
          >
            {edit ? (
              <View>
                <Input
                  label="Họ và tên (Sử dụng tên thật để điểm danh)"
                  errorStyle={cStyles.errorStyle}
                  errorMessage={errorMessage.username}
                  placeholder="Vd: Nguyễn Văn A"
                  leftIcon={<Icon name="user" size={iconSize} color={iconColor} />}
                  onChangeText={(value) => this.onchange('username', value)}
                />
                <Button containerStyle={cStyles.btnwrap} titleStyle={cStyles.btnText} buttonStyle={cStyles.btn} title="Lưu" onPress={this.update} />
              </View>
            ) : (
              <View>
                {Object.keys(userInfo).map((key, i) => this.renderItem(key, userInfo[key]))}
                <ListItem
                  onPress={this.logout}
                  bottomDivider
                  title={
                    <View style={{ width: '100%' }}>
                      <Text style={{ fontWeight: 'bold', color: 'blue', fontSize: 18, alignSelf: 'center' }}>Đăng xuất</Text>
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
