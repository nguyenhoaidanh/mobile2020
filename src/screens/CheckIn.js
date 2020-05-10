import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, CheckBox } from 'react-native-elements';
import ImageInput from '../components/ImageInput';
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
  checkin = () => {};
  validate = () => {
    this.setState({ valid: 1 });
  };
  setImage = (image) => {
    this.setState({ image });
  };
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { errorMessage = {}, valid = 0, image = {} } = this.state;
    if (!valid)
      return (
        <View>
          <Input
            errorStyle={styles.errorStyle}
            errorMessage={errorMessage.password}
            placeholder="Nhập mật khẩu"
            leftIcon={<Icon name="key" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('password', value)}
            secureTextEntry={true}
          />
          <Button style={styles.login} title="Vào phòng" onPress={this.validate} />
        </View>
      );
    return (
      <View>
        <ImageInput image={image} camera={true} callback={this.setImage} />
        <Button style={styles.login} title="Điểm danh" onPress={this.checkin} />
      </View>
    );
  }
}
