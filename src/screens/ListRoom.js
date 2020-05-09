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
        <Text style={styles.welcome}>Đây là trang ListRoom</Text>
        <Link to="/" underlayColor="#f0f4f7">
          <Text style={styles.login}>Click về Home</Text>
        </Link>

        <Button style={styles.login} title="Đăng kí" onPress={this.register} />
      </View>
    );
  }
}
