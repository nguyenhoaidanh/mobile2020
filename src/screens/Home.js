import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
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
  btn: { borderRadius: 20, width: 300 },
  btnwrap: { marginTop: 10, width: '100%', alignItems: 'center' },
});

type Props = {};
class Home extends Component<Props> {
  navigate = (url, creent) => {
    this.props.history.push(url);
    this.props.appActions.setCurScreent({ currentScreent: creent });
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>This is Home page, style cho đẹp sau!!!</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Button
          containerStyle={styles.btnwrap}
          buttonStyle={styles.btn}
          title="Đăng kí"
          onPress={() => this.navigate('/register', { text: 'Đăng kí tài khoản' })}
        />
        <Button containerStyle={styles.btnwrap} buttonStyle={styles.btn} title="Đăng nhập" onPress={() => this.navigate('/login', { text: 'Đăng nhập' })} />
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    app: state.app,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
