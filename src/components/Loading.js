import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button, Badge, ButtonGroup, Card, Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import cStyles from '../constants/common-styles';
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  start: { alignItems: 'flex-start', width: '30%' },
  end: { alignItems: 'flex-end', width: '70%' },
  textLeft: { fontSize: 20, color: 'grey' },
  textRight: { fontSize: 20, color: 'grey', fontWeight: 'bold' },
});
const iconSize = 24,
  iconColor = 'black';
type Props = {};
class Footer extends Component<Props> {
  render() {
    return (
      <View style={{ borderRadius: 10, paddingBottom: 0 }}>
        <Text style={{ marginTop: 100, alignSelf: 'center', fontSize: 20, color: 'white' }}>Đang tải ...</Text>
        {/* <Image source={require('../../img/loading.gif')} style={{ width: 200, height: 200 }} /> */}
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
