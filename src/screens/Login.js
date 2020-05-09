import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
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
  register = () => {};
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { errorMessage = {} } = this.state;
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
      </View>
    );
  }
}
