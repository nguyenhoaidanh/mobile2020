import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Keyboard } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button, ButtonGroup } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
});
const iconSize = 24,
  iconColor = 'black';
const list = [
  { icon: 'home', text: 'Home', to: '/' },
  { icon: 'view-list', text: 'Rooms', to: '/list-room' },
  { icon: 'face-recognition', text: 'Face', to: '/register-face' },
  { icon: 'history', text: 'History', to: '/history' },
  { icon: 'account', text: 'Account', to: '/account' },
];
type Props = {};
class Footer extends Component<Props> {
  state = {};
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }
  _keyboardDidShow(e) {
    this.setState({ hideFooter: 1 });
  }
  _keyboardDidHide() {
    this.setState({ hideFooter: 0 });
  }
  updateIndex = (selectedIndex) => {
    this.setState({ selectedIndex });
    this.props.history.push(list[selectedIndex].to);
    this.props.appActions.setCurScreent({ currentScreent: list[selectedIndex] });
  };
  componentWillReceiveProps(props) {
    console.log('Danh', this.props.app.lastScreent);
  }
  render() {
    const { selectedIndex = 0, hideFooter = 0 } = this.state;
    const buttons = list.map((el) => ({
      element: () => (
        <View style={{ alignItems: 'center' }}>
          <Icon name={el.icon} size={iconSize} color={iconColor} />
          <Text>{el.text}</Text>
        </View>
      ),
    }));
    if (hideFooter) return null;
    return (
      <View style={styles.container}>
        <ButtonGroup
          selectedButtonStyle={styles.selected}
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
    app: state.app,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Footer));
