import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button, Header, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const iconSize = 30,
  iconColor = 'white';

type Props = {};
class Home extends Component<Props> {
  navigate = (url) => {
    this.props.history.push(url);
  };
  back = () => {
    this.props.history.goBack();
    this.props.appActions.setCurScreent({ currentScreent: this.props.app.lastScreent });
  };
  render() {
    const { currentScreent = {}, lastScreent = null } = this.props.app;
    const { text = '', icon = '' } = currentScreent;
    return (
      // <View style={styles.container}>
      <Header
        containerStyle={{
          height: 50,
          backgroundColor: 'green',
          paddingTop: 0,
        }}
      >
        {lastScreent ? <Icon onPress={this.back} name={'keyboard-backspace'} size={iconSize} color={iconColor} /> : ''}
        <Text h4 style={{ color: iconColor }}>
          {text}
        </Text>
        {icon ? <Icon name={icon} size={iconSize} color={iconColor} /> : null}
      </Header>
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
