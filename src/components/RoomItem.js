import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button, ButtonGroup, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
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
  state = {};
  navigate = (url) => {
    this.props.history.push(url);
    this.props.appActions.setCurScreent({ currentScreent: { text: 'Điểm danh' } });
  };
  render() {
    const { index = 0, room = {} } = this.props;
    return (
      <Card>
        <View style={styles.row}>
          <Text style={{ width: '100%', fontSize: 25, alignContent: 'center', fontWeight: 'bold' }}>Đồ họa máy tính - 20/12/2020</Text>
          <Text style={styles.textLeft}>Giảng viên: Nguyễn Thị X</Text>
          <Text style={styles.textLeft}>Sỉ số: 90/100</Text>
          <Text style={styles.textLeft}>Lớp: L01</Text>
        </View>
        <Button containerStyle={cStyles.btnwrap} buttonStyle={cStyles.btn} title="Điểm danh" onPress={() => this.navigate('check-in')} />
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
