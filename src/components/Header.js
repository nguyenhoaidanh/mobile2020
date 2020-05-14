import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView, Text } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button, Header, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
const iconSize = 30,
  iconColor = 'white';
type Props = {};
class Home extends Component<Props> {
  state = {};
  navigate = (url) => {
    this.props.history.push(url);
  };
  back = () => {
    this.props.history.goBack();
    this.props.appActions.setCurScreent({ currentScreent: this.props.app.lastScreent });
  };
  render() {
    const { keyword = '' } = this.state;
    const { currentScreent = {}, lastScreent = null } = this.props.app;
    const { title = '', icon = '', to = '' } = currentScreent;
    return (
      <Header
        containerStyle={{
          height: 50,
          backgroundColor: 'lightblue',
          paddingTop: 0,
        }}
      >
        {lastScreent && to !== '/list-room' ? <Icon onPress={this.back} name={'keyboard-backspace'} size={iconSize} color={iconColor} /> : null}
        {to == '/list-room' ? (
          <SearchBar
            inputContainerStyle={{ borderRadius: 20, height: '100%', margin: 0 }}
            containerStyle={{ borderRadius: 20, width: '100%', height: 30, padding: 0 }}
            placeholder="Tìm kiếm phòng"
            onChangeText={this.updateSearch}
            value={keyword}
          />
        ) : (
          <Text style={{ color: iconColor, fontSize: 25 }}>{title}</Text>
        )}

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
