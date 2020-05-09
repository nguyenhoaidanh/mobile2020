import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button, ButtonGroup } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
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
  },
});
const iconSize = 24,
  iconColor = 'black';
const list = [
  { icon: 'home', text: 'Home', to: '/' },
  { icon: 'list', text: 'Rooms', to: '/list-room' },
  { icon: 'key', text: 'Hello', to: '/' },
  { icon: 'key', text: 'Hello', to: '/' },
  { icon: 'user', text: 'Account', to: '/account' },
];
type Props = {};
class Footer extends Component<Props> {
  state = {};
  updateIndex = (selectedIndex) => {
    this.setState({ selectedIndex });
    this.props.history.push(list[selectedIndex].to);
  };
  render() {
    const { selectedIndex = 0 } = this.state;
    const buttons = list.map((el) => ({
      element: () => (
        <View>
          <Icon name={el.icon} size={iconSize} color={iconColor} />
          <Text>{el.text}</Text>
        </View>
      ),
    }));
    return (
      <View style={styles.container}>
        <ButtonGroup onPress={this.updateIndex} selectedIndex={selectedIndex} buttons={buttons} />
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
//connect(mapStateToProps, mapDispatchToProps)
export default withRouter(Footer);
