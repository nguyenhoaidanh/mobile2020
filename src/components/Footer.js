import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Keyboard } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button, ButtonGroup } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { list_screen } from '../constants/constants';
import * as appActions from '../actions/index';
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    padding: 0,
  },
  group: { width: '100%', height: '100%' },
  selected: { backgroundColor: 'lightblue' },
  selectedText: { color: 'green' },
});
const iconSize = 24,
  iconColor = 'white';
type Props = {};
class Footer extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { list: list_screen };
  }
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    this.props.history.listen((location, action) => {
      const { list = [] } = this.state;
      const indx = Object.values(list).findIndex((e) => {
        return e.to == location.pathname;
      });
      if (indx != -1) {
        this.setState({ selectedIndex: indx });
        this.props.appActions.setCurScreent({ currentScreent: list[indx] });
      }
    });
  }
  _keyboardDidShow(e) {
    this.setState({ hideFooter: 1 });
  }
  _keyboardDidHide() {
    this.setState({ hideFooter: 0 });
  }
  updateIndex = (selectedIndex) => {
    let { list = [] } = this.state;
    const { userInfo = {}, loggedIn = false, app = {} } = this.props;
    this.setState({ selectedIndex });
    this.props.history.push(list[selectedIndex].to);
    this.props.appActions.setCurScreent({ currentScreent: list[selectedIndex] });
  };
  componentWillReceiveProps(props) {
    const { userInfo = {} } = props;
    let list = [];
    if (userInfo.role) {
      list = list_screen.filter((e) => {
        return e.showRole.includes(userInfo.role);
      });
    }
    this.setState({ list });
  }
  render() {
    let { selectedIndex = 0, hideFooter = 0, list = [] } = this.state;
    const { userInfo = {}, loggedIn = false, app = {} } = this.props;
    const { currentScreent = {} } = app;
    let buttons = list.map((el, i) => ({
      element: () => {
        const isActive = i == selectedIndex;
        const color = isActive ? 'brown' : 'black';
        return (
          <View style={{ width: '100%', alignItems: 'center', backgroundColor: isActive ? 'lightblue' : 'white' }}>
            <Icon name={el.icon} size={iconSize} color={color} />
            <Text style={{ color }}>{el.text}</Text>
          </View>
        );
      },
    }));

    if (hideFooter || !loggedIn) return null;
    return (
      <View style={styles.container}>
        <ButtonGroup
          selectedButtonStyle={styles.selected}
          selectedTextStyle={styles.selectedText}
          containerStyle={styles.group}
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
        />
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    userInfo: state.user.userInfo,
    app: state.app,
    loggedIn: state.user.loggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Footer));
