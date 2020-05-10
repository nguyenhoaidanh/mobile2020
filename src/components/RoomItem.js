import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button, ButtonGroup, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
const iconSize = 24,
  iconColor = 'black';
type Props = {};
class Footer extends Component<Props> {
  state = {};
  navigate = (url) => {
    this.props.history.push(url);
    this.props.appActions.setCurScreent({ currentScreent: { text: 'Điểm danh' } });
  };
  render() {
    const { index = 0 } = this.props;
    return (
      <Card title={`Room ${index}`}>
        <Text style={{ marginBottom: 10 }}>The idea about component structure than actual design.</Text>
        <Button onPress={() => this.navigate('check-in')} buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }} title="Điểm danh" />
      </Card>
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
