import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, CheckBox } from 'react-native-elements';
import ImageInput from '../components/ImageInput';
const styles = StyleSheet.create({
  btn: { borderRadius: 20, width: 300 },
  btnwrap: { marginTop: 10, width: '100%', alignItems: 'center' },
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
    //TODO: check pass is ok
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
            label="Mật khẩu"
            errorStyle={styles.errorStyle}
            errorMessage={errorMessage.password}
            placeholder="Password"
            keyboardType="numeric"
            leftIcon={<Icon name="key" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('password', value)}
            secureTextEntry={true}
          />
          <Button containerStyle={styles.btnwrap} buttonStyle={styles.btn} title="Vào phòng" onPress={this.validate} />
        </View>
      );
    return (
      <View>
        <ImageInput image={image} camera={true} callback={this.setImage} />
        <Button containerStyle={styles.btnwrap} buttonStyle={styles.btn} title="Điểm danh" onPress={this.checkin} />
      </View>
    );
  }
}
