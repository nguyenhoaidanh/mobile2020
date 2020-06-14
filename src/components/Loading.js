import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button, Badge, ButtonGroup, Card, Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import cStyles from '../constants/common-styles';
const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: 'white',
    fontSize: 18,
  },
});
type Props = {};
class Footer extends Component<Props> {
  render() {
    const { show = true } = this.props;
    if (!show) return null;
    return <Spinner animation={'fade'} visible={true} textContent={this.props.loadingText || 'Đang tải'} textStyle={styles.spinnerTextStyle} />;
  }
}
export default Footer;
