import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withRouter } from 'react-router';
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu',
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

type Props = {};
class Home extends Component<Props> {
  navigate = (url) => {
    this.props.history.push(url);
  };
  render() {
    console.log('hihi');

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Native, this is Home page!</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Button style={styles.login} title="Đăng kí" onPress={() => this.navigate('/register')} />
        <Button style={styles.login} title="Đăng nhập" onPress={() => this.navigate('/login')} />
      </View>
    );
  }
}
export default withRouter(Home);
