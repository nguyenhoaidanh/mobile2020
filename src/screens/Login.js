import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Card, Avatar, Divider } from 'react-native-elements';
import ImageInput from '../components/ImageInput';
const styles = StyleSheet.create({
  login: {
    fontSize: 20,
    textAlign: 'center',
    color: 'red',
  },
  errorStyle: { color: 'red' },
  btn: { borderRadius: 20, width: 300 },
  btnwrap: { marginTop: 10, width: '100%', alignItems: 'center' },
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
        <View>
          <Input
            label="Số điện thoại hoặc email"
            errorStyle={styles.errorStyle}
            errorMessage={errorMessage.username}
            leftIcon={<Icon name="user" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('username', value)}
          />
          <Input
            label="Mật khẩu"
            errorStyle={styles.errorStyle}
            errorMessage={errorMessage.password}
            placeholder="Password"
            leftIcon={<Icon name="key" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('password', value)}
            secureTextEntry={true}
          />
          <Button containerStyle={styles.btnwrap} buttonStyle={styles.btn} title="Đăng nhập" onPress={this.register} />
          <Divider style={{ backgroundColor: 'green', marginBottom: 20, marginTop: 20 }} />
          <Button
            containerStyle={styles.btnwrap}
            buttonStyle={styles.btn}
            title="Đăng nhập bằng gương mặt"
            onPress={() => this.setState({ mode: 1 }, this.openCamera)}
          />
        </View>
      );
    return (
      // face id
      <View>
        <ImageInput image={image} camera={true} callback={this.setImage} />
        <Button containerStyle={styles.btnwrap} buttonStyle={styles.btn} title="Đăng nhập" onPress={this.login} />
      </View>
    );
  }
}
