import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, ToastAndroid, Image } from 'react-native';
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
  showToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.LONG);
  };
  sendOtp = () => {
    const { email } = this.state;
    console.log(123456, 'email', email);
    if (!email) return;
    if (!`${email}`.includes('@') || !`${email}`.includes('.')) return this.setState({ errorMessage: { email: 'Địa chỉ mail không hợp lệ' } });
    const data = { gmail: email };
    console.log(123456, data);
    this.setState({ otpLoading: true });
    AXIOS('/users/mails/reset', 'POST', data)
      .then(({ data }) => {
        this.showToast(`Hãy kiểm tra email: ${email} để nhận mã otp`);
        console.log('123456', 1, data);
        this.setState({ errorMessage: {} });
      })
      .catch((err) => {
        checkTokenExpire(err, this);
        this.setState({ errorMessage: { email: 'Địa chỉ mail không tồn tại' } });
      })
      .finally(() => this.setState({ otpLoading: false }));
  };
  resetPass = () => {
    const { username, password, repPassword, errorMessage = {}, image = {}, email, otp } = this.state;
    if (!email || !otp || !password || !repPassword) return;
    if (password !== repPassword) return this.setState({ errorMessage: { repPassword: 'Hai password không khớp' } });
    const data = {
      gmail: email,
      token: otp,
      new_password: password,
    };
    console.log(123456, data);
    this.setState({ loading: true });
    AXIOS('/users/passwords/restore', 'POST', data)
      .then(({ data }) => {
        this.setState({ success: true });
        console.log('123456', 1, data);
      })
      .catch((err) => {
        checkTokenExpire(err, this);
        this.showToast(`Có lỗi xảy ra.`);
      })
      .finally(() => this.setState({ loading: false, errorMessage: {} }));
  };
  toLogin = () => {
    this.props.history.push('/login');
    this.props.appActions.setCurScreent({ currentScreent: list_screen_map.login });
  };
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { errorMessage = {}, email = '', password = '', repPassword = '', mode = 0, image = {}, otp = -1 } = this.state;

    if (this.state.success)
      return (
        <View>
          <View style={{ backgroundColor: 'white', padding: 20, height: '100%' }}>
            <Image style={{ width: 200, height: 200, alignSelf: 'center', marginTop: 50 }} source={require('../../img/success.png')} />
            <Text style={{ fontSize: 20, color: 'green', alignSelf: 'center', marginBottom: 10, fontWeight: 'bold' }}>Đổi mật khẩu thành công</Text>
            <Button
              containerStyle={cStyles.btnwrap}
              titleStyle={cStyles.btnText}
              buttonStyle={cStyles.btnPrimary}
              title="Đăng nhập ngay"
              onPress={this.toLogin}
            />
          </View>
        </View>
      );
    return (
      <ScrollView style={cStyles.scroll}>
        <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <Input
              label="Nhập Email"
              errorStyle={cStyles.errorStyle}
              containerStyle={{ width: '80%' }}
              placeholder="Địa chỉ email"
              errorMessage={errorMessage.email}
              value={email}
              leftIcon={<Icon name="user" size={iconSize} color={iconColor} />}
              onChangeText={(value) => this.onchange('email', value)}
            />
            <Button onPress={this.sendOtp} loading={this.state.otpLoading} containerStyle={{ marginTop: 27, width: '25%' }} title="Gửi OTP" />
          </View>
          <Input
            label="Nhập otp"
            errorStyle={cStyles.errorStyle}
            errorMessage={errorMessage.otp}
            placeholder="Otp được gửi qua email"
            keyboardType="numeric"
            maxLength={10}
            leftIcon={<Icon name="key" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('otp', value)}
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
            errorMessage={errorMessage.repPassword}
            placeholder="Password"
            leftIcon={<Icon name="key" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('repPassword', value)}
            secureTextEntry={true}
          />
          <Button onPress={this.resetPass} containerStyle={cStyles.btnwrap} titleStyle={cStyles.btnText} buttonStyle={cStyles.btn} title="Lưu mật khẩu" />
        </View>
      </ScrollView>
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
