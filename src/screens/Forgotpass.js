import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input, Button, Card, Avatar, Divider } from 'react-native-elements';
import ImageInput from '../components/ImageInput';
import cStyles from '../constants/common-styles';
import { list_screen_map } from '../constants/constants';
import { AXIOS, checkTokenExpire, formatTime } from '../utils/functions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import AsyncStorage from '@react-native-community/async-storage';
const styles = StyleSheet.create({
  login: {
    fontSize: 20,
    textAlign: 'center',
    color: 'red',
  },
});

type Props = {};
class Login extends Component<Props> {
  state = {};
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  login = () => {
    const { username, password, errorMessage = {}, image = {} } = this.state;
    if (image.path) {
      console.log('ok login by face', user);
      return;
    }
    console.log('123456', 1, username, password);
    if (!username || !password) return;
    const user = { username, password };
    AXIOS('/users/authenticate', 'POST', user)
      .then(({ data }) => {
        console.log('123456', 1, data);
        this.props.history.push('/');
        this.props.appActions.setCurScreent({ currentScreent: list_screen_map.home });
        this.props.appActions.setUserInfo({ userInfo: data });
      })
      .catch((err) => {
        checkTokenExpire(err, this);
        this.setState({ errorMessage: { password: 'Thông tin đăng nhập chưa đúng' } });
      });
  };
  setImage = (image) => {
    this.setState({ image });
  };
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { errorMessage = {}, mode = 0, image = {} } = this.state;
    if (!mode)
      return (
        <ScrollView style={cStyles.scroll}>
          <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Input
                label="Nhập Email"
                errorStyle={cStyles.errorStyle}
                containerStyle={{ width: '80%' }}
                errorMessage={errorMessage.username}
                leftIcon={<Icon name="user" size={iconSize} color={iconColor} />}
                onChangeText={(value) => this.onchange('username', value)}
              />
              <Button containerStyle={{ marginTop: 27 }} title="Gửi OTP" />
            </View>
            <Input
              label="Nhập otp"
              errorStyle={cStyles.errorStyle}
              errorMessage={errorMessage.phone}
              placeholder="Otp được gửi qua email"
              maxLength={10}
              keyboardType="numeric"
              leftIcon={<Icon name="key" size={iconSize} color={iconColor} />}
              onChangeText={(value) => this.onchange('phone', value)}
            />
            <Input
              label="Mật khẩu"
              errorStyle={cStyles.errorStyle}
              errorMessage={errorMessage.password}
              placeholder="Password"
              leftIcon={<Icon name="key" size={iconSize} color={iconColor} />}
              onChangeText={(value) => this.onchange('password', value)}
              secureTextEntry={true}
            />
            <Input
              label="Xác nhận mật khẩu"
              errorStyle={cStyles.errorStyle}
              errorMessage={errorMessage.password}
              placeholder="Password"
              leftIcon={<Icon name="key" size={iconSize} color={iconColor} />}
              onChangeText={(value) => this.onchange('password', value)}
              secureTextEntry={true}
            />
            <Button containerStyle={cStyles.btnwrap} titleStyle={cStyles.btnText} buttonStyle={cStyles.btn} title="Lưu mật khẩu" />
          </View>
        </ScrollView>
      );
    return (
      // face id
      <View>
        {/* <Text style={{ alignSelf: 'center', color: 'white', margin: 10, fontSize: 20 }}>Chạm để bật camera</Text> */}
        <ImageInput showAccessory={false} backgroundColor="white" image={image} camera={true} callback={this.setImage} />
        <Button containerStyle={cStyles.btnwrap} titleStyle={cStyles.btnText} buttonStyle={cStyles.btn} title="Đăng nhập" onPress={this.login} />
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    app: state.app,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
