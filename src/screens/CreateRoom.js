import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, CheckBox } from 'react-native-elements';
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
  register = () => {};
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { errorMessage = {} } = this.state;
    return (
      <View>
        <Button style={styles.login} title="Tạo room" onPress={this.register} />
      </View>
    );
  }
}
