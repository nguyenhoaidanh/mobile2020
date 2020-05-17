import React, { Component } from 'react';
import {
  TouchableOpacity,
  SectionList,
  Platform,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Avatar, Input, Button, CheckBox } from 'react-native-elements';
import cStyles from '../constants/common-styles';
import DatePicker from 'react-native-datepicker';
import Picker from 'react-native-picker';
import { showImageInput } from '../utils/functions';

const styles = StyleSheet.create({});
let facultys = ['KH & KT Máy tính', 'KH & KT Máy tính', 'KH & KT Máy tính', 'KH & KT Máy tính'];

type Props = {};
export default class Home extends Component<Props> {
  state = { male: true, username: '', phone: '', email: '', password: '', repPassword: '' };
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  showImageInput = () => {
    showImageInput({ picker: true, callback: this.setImage });
  };
  componentDidMount() {
    Picker.init({
      pickerData: facultys,
      selectedValue: ['KH & KT Máy tính'],
      onPickerConfirm: (faculty) => {
        console.log('Danh', faculty);
        this.setState({ faculty: faculty[0] });
      },
    });
  }
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
  };
  render() {
    const iconSize = 24,
      maxStep = 3;
    const iconColor = 'black';
    const { image = {}, step = 1, faculty, errorMessage = {}, male = true, felmale = false } = this.state;

    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column' }}>
        <ScrollView style={cStyles.scroll}>
          <View
            style={{
              alignItems: 'center',
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <Avatar
              onPress={this.showImageInput}
              onAccessoryPress={this.showImageInput}
              rounded
              size="xlarge"
              source={{
                uri: image.path ? image.path : 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
              }}
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
          {step == 1 ? (
            <View>
              <Input
                label="Họ và tên (Sử dụng tên thật để điểm danh)"
                errorStyle={cStyles.errorStyle}
                errorMessage={errorMessage.username}
                placeholder="Vd: Nguyễn Văn A"
                leftIcon={<Icon name="user" size={iconSize} color={iconColor} />}
                onChangeText={(value) => this.onchange('username', value)}
              />
              <Input
                label="Mssv"
                errorStyle={cStyles.errorStyle}
                errorMessage={errorMessage.mssv}
                placeholder="Vd: 1610391"
                maxLength={10}
                keyboardType="numeric"
                leftIcon={<Icon name="graduation-cap" size={iconSize} color={iconColor} />}
                onChangeText={(value) => this.onchange('mssv', value)}
              />
              <TouchableOpacity onPress={() => Picker.show()}>
                <Input
                  label="Khoa"
                  errorStyle={cStyles.errorStyle}
                  errorMessage={errorMessage.faculty}
                  disabled
                  placeholder="Vd: KH & KT Máy tính"
                  value={faculty}
                  leftIcon={<Icon name="graduation-cap" size={iconSize} color={iconColor} />}
                />
              </TouchableOpacity>
            </View>
          ) : null}
          {step == 2 ? (
            <View>
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
              <Text style={cStyles.label}>Ngày sinh </Text>
              <DatePicker
                style={{ width: '100%' }}
                mode="date"
                format="DD-MM-YYYY"
                onDateChange={(birthday) => {
                  this.setState({ birthday });
                }}
                iconComponent={
                  <Input
                    errorStyle={cStyles.errorStyle}
                    errorMessage={errorMessage.birthday}
                    placeholder="Ngày sinh "
                    disabled
                    defaultValue={this.state.birthday}
                    leftIcon={<Icon name="calendar" size={iconSize} color={iconColor} />}
                  />
                }
                customStyles={{
                  dateInput: {
                    display: 'none',
                  },
                }}
              />
            </View>
          ) : null}
          {step == 3 ? (
            <View>
              <Text style={cStyles.label}>Giới tính</Text>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <CheckBox
                  onPress={() => this.setState({ male: true, felmale: false })}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  center
                  title="Nam"
                  checked={male}
                  textStyle={{ fontSize: 20 }}
                  containerStyle={{ borderColor: 'transparent', backgroundColor: 'transparent', width: '50%', marginRight: 0 }}
                />
                <CheckBox
                  onPress={() => this.setState({ male: false, felmale: true })}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  center
                  title="Nữ"
                  checked={felmale}
                  textStyle={{ fontSize: 20 }}
                  containerStyle={{ width: '50%', marginLeft: 0, borderColor: 'transparent', backgroundColor: 'transparent' }}
                />
              </View>
            </View>
          ) : null}
          {step == 4 ? (
            <View>
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
            </View>
          ) : null}
          <View style={{ flexDirection: 'row' }}>
            {step != maxStep ? (
              <Button
                onPress={() => this.setState({ step: step + 1 })}
                containerStyle={cStyles.btnwrap}
                titleStyle={cStyles.btnText}
                buttonStyle={cStyles.btnPrimary}
                title="Tiếp tục"
              />
            ) : null}
          </View>
          {step == maxStep ? (
            <Button containerStyle={cStyles.btnwrap} titleStyle={cStyles.btnText} buttonStyle={cStyles.btnPrimary} title="Hoàn tất" onPress={this.register} />
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
