import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Card, Avatar } from 'react-native-elements';
import ImageInput from '../components/ImageInput';
const styles = StyleSheet.create({
  login: {
    fontSize: 20,
    textAlign: 'center',
    color: 'red',
  },
  errorStyle: { color: 'red' },
});

type Props = {};
export default class Home extends Component<Props> {
  state = {};
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  login = () => {
    console.log('ok login');
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
        <View>
          <Input
            errorStyle={styles.errorStyle}
            errorMessage={errorMessage.username}
            placeholder="Họ và tên"
            leftIcon={<Icon name="user" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('username', value)}
          />
          <Input
            errorStyle={styles.errorStyle}
            errorMessage={errorMessage.phone}
            placeholder="Số điện thoại"
            leftIcon={<Icon name="phone" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('phone', value)}
          />
          <Input
            errorStyle={styles.errorStyle}
            errorMessage={errorMessage.email}
            placeholder="Địa chỉ Email"
            leftIcon={<Icon name="paper-plane-o" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('phone', value)}
          />
          <Input
            errorStyle={styles.errorStyle}
            errorMessage={errorMessage.password}
            placeholder="Password"
            leftIcon={<Icon name="key" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('password', value)}
            secureTextEntry={true}
          />
          <Input
            errorStyle={styles.errorStyle}
            errorMessage={errorMessage.repPassword}
            placeholder="Nhập lại Password"
            leftIcon={<Icon name="key" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('repPassword', value)}
            secureTextEntry={true}
          />
          <Button style={styles.login} title="Đăng nhập" onPress={this.register} />
          <Button style={styles.login} title="Đăng bằng face" onPress={() => this.setState({ mode: 1 }, this.openCamera)} />
        </View>
      );
    return (
      // face id
      <View>
        <ImageInput image={image} camera={true} callback={this.setImage} />
        <Button style={styles.login} title="Đăng nhập" onPress={this.login} />
      </View>
    );
  }
}
