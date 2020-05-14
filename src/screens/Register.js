import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, CheckBox } from 'react-native-elements';
import cStyles from '../constants/common-styles';
const styles = StyleSheet.create({});

type Props = {};
export default class Home extends Component<Props> {
  state = { male: true, username: '', phone: '', email: '', password: '', repPassword: '' };
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  register = () => {
    let valid = true;
    const { username, male = true, phone, email, password, repPassword, errorMessage = {} } = this.state;
    Object.keys(this.state).forEach((key) => {
      if (['errorMessage', 'male', 'felmale'].includes(key)) return;
      if (!this.state[key]) {
        valid = false;
        errorMessage[key] = 'Không được để trống';
      } else {
        errorMessage[key] = '';
      }
    });
    if (!valid) {
      return this.setState({ errorMessage });
    }
    if (username.length < 6) {
      valid = false;
      errorMessage.username = 'Tên tài khoản quá ngắn';
    }
    if (phone.toString().length < 10) {
      valid = false;
      errorMessage.phone = 'Số điện thoại không hợp lệ';
    }
    if (!(email.includes('@') && email.includes('.'))) {
      valid = false;
      errorMessage.email = 'Email không hợp lệ';
    }
    if (password.length < 6) {
      valid = false;
      errorMessage.password = 'Mật khẩu quá ngắn';
    }
    if (password != repPassword) {
      valid = false;
      errorMessage.repPassword = 'Mật khẩu không trùng khớp';
    }
    if (!valid) return this.setState({ errorMessage });
    const user = { username, phone, email, password, male };
    console.log('Danh', user);
  };
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { errorMessage = {}, male = true, felmale = false } = this.state;
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column' }}>
        <ScrollView>
          <Input
            label="Họ và tên (Sử dụng tên thật để điểm danh)"
            errorStyle={cStyles.errorStyle}
            errorMessage={errorMessage.username}
            placeholder="Vd: Nguyễn Văn A"
            leftIcon={<Icon name="user" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('username', value)}
          />
          <Input
            label="Số điện thoại"
            errorStyle={cStyles.errorStyle}
            errorMessage={errorMessage.phone}
            placeholder="Vd: 0123456789"
            maxLength={10}
            keyboardType="numeric"
            leftIcon={<Icon name="phone" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('phone', value)}
          />
          <Input
            label="Địa chỉ Email"
            errorStyle={cStyles.errorStyle}
            errorMessage={errorMessage.email}
            placeholder="Vd: example@hcmut.edu.vn"
            keyboardType="email-address"
            leftIcon={<Icon name="paper-plane-o" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('email', value)}
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
            label="Nhập lại Mật khẩu"
            errorStyle={cStyles.errorStyle}
            errorMessage={errorMessage.repPassword}
            placeholder="Password"
            leftIcon={<Icon name="key" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('repPassword', value)}
            secureTextEntry={true}
          />
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '50%' }}>
              <CheckBox
                onPress={() => this.setState({ male: true, felmale: false })}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                center
                title="Nam"
                checked={male}
              />
            </View>
            <View style={{ width: '50%' }}>
              <CheckBox
                onPress={() => this.setState({ male: false, felmale: true })}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                center
                title="Nữ"
                checked={felmale}
              />
            </View>
          </View>
          <Button containerStyle={cStyles.btnwrap} buttonStyle={cStyles.btn} title="Đăng kí" onPress={this.register} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
