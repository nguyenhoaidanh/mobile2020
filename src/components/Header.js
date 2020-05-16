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
const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: 'transparent',
    paddingTop: 0,
  },
});
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
    const { title = '', icon = null, customIcon = null, to = '', showSearch = false } = currentScreent;
    if (showSearch)
      return (
        <View style={styles.header}>
          <SearchBar
            inputContainerStyle={{
              alignSelf: 'center',
              borderColor: 'transparent',
              borderRadius: 20,
              height: 40,
              width: '70%',
              margin: 0,
              backgroundColor: 'white',
            }}
            containerStyle={{
              borderTopColor: 'transparent',
              backgroundColor: 'transparent',
              alignSelf: 'center',
              borderRadius: 40,
              width: '100%',
              height: '100%',
              marginTop: 5,
              alignItems: 'center',
              padding: 0,
            }}
            placeholder="Tìm kiếm phòng"
            onChangeText={this.updateSearch}
            value={keyword}
          />
        </View>
      );
    return (
      <Header containerStyle={styles.header}>
        {!lastScreent ? null : <Icon onPress={this.back} name={'keyboard-backspace'} size={iconSize} color={iconColor} />}
        <Text style={{ color: iconColor, fontSize: 25 }}>{title}</Text>
        {icon}
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
