import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';
type Props = {};
export default class Home extends Component<Props> {
  render() {
    return (
      <View>
        <Text style={styles.welcome}>Đây là trang Login</Text>
        <Link to="/" underlayColor="#f0f4f7">
          <Text style={styles.login}>Click về Home</Text>
        </Link>
      </View>
    );
  }
}
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
});
