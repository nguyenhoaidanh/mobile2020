import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button, Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import cStyles from '../constants/common-styles';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },

  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
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
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/vi/thumb/c/cd/Logo-hcmut.svg/543px-Logo-hcmut.svg.png' }}
          style={{ width: 200, height: 200 }}
        />
        <Text style={styles.welcome}>Bach khoa Attendance Application</Text>
        <Button
          containerStyle={cStyles.btnwrap}
          titleStyle={cStyles.btnText}
          buttonStyle={cStyles.btn}
          title="Đăng kí"
          onPress={() => this.navigate('/register', { text: 'Đăng kí tài khoản' })}
        />
        <Button
          containerStyle={cStyles.btnwrap}
          titleStyle={cStyles.btnText}
          buttonStyle={cStyles.btn}
          title="Đăng nhập"
          onPress={() => this.navigate('/login', { text: 'Đăng nhập' })}
        />
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
