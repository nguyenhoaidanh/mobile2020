import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Card, Avatar, Divider } from 'react-native-elements';
import ImageInput from '../components/ImageInput';
import cStyles from '../constants/common-styles';
const styles = StyleSheet.create({
  login: {
    fontSize: 20,
    textAlign: 'center',
    color: 'red',
  },
});

type Props = {};
export default class Home extends Component<Props> {
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
    if (!username || !password) return;
    const user = { username, password };
    console.log('ok login', user);
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
        <View style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10 }}>
          <Input
            label="Số điện thoại hoặc email"
            errorStyle={cStyles.errorStyle}
            errorMessage={errorMessage.username}
            leftIcon={<Icon name="user" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('username', value)}
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
          <Button containerStyle={cStyles.btnwrap} titleStyle={cStyles.btnText} buttonStyle={cStyles.btn} title="Đăng nhập" onPress={this.register} />
          <Button
            containerStyle={cStyles.btnwrap}
            titleStyle={cStyles.btnText}
            buttonStyle={cStyles.btn}
            title="Nhận diện gương mặt"
            onPress={() => this.setState({ mode: 1 }, this.openCamera)}
          />
        </View>
      );
    return (
      // face id
      <View>
        <ImageInput image={image} camera={true} callback={this.setImage} />
        <Button containerStyle={cStyles.btnwrap} titleStyle={cStyles.btnText} buttonStyle={cStyles.btn} title="Đăng nhập" onPress={this.login} />
      </View>
    );
  }
}
