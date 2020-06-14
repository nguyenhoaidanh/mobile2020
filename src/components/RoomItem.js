import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button, Badge, ButtonGroup, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import cStyles from '../constants/common-styles';
import { list_screen_map, ROLES } from '../constants/constants';
import { formatTime } from '../utils/functions';
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
const iconSize = 24,
  iconColor = 'black';
type Props = {};
class Footer extends Component<Props> {
  state = {};
  toStat = () => {
    this.props.history.push('/stat');
    this.props.appActions.setCurRoom({ currentRoom: this.props.data });
    this.props.appActions.setCurScreent({ currentScreent: list_screen_map.stat });
  };
  render() {
    let { index = 0, data = {}, currentClass = {}, userInfo = {} } = this.props;
    const { title, user_create, num_checked, isCheckIn, isClosed } = data;
    const curTime = Date.now();
    const isStudent = userInfo.role == ROLES.student;
    const notStart = curTime < +data.start_time;
    const isExpire = !notStart && !(curTime >= +data.start_time && curTime <= +data.end_time);
    const canCheckin = !isCheckIn && !isExpire && !isClosed && isStudent && !notStart;
    const isAuthor = user_create == userInfo.id;
    const iconSize = 20;
    return (
      <Card>
        <View>
          <Text style={{ width: '100%', fontSize: 20, alignContent: 'center', fontWeight: 'bold' }}>
            {currentClass.name_subject} - {title}
          </Text>
          <Text style={{ fontSize: 15 }}>Thời gian điểm danh:</Text>
          <Text style={{ fontWeight: 'bold', color: 'brown', fontSize: 15, alignSelf: 'center', alignItems: 'center', alignContent: 'center', width: '100%' }}>
            {formatTime(data.start_time)} <Text style={{ color: 'black' }}>đến</Text> {formatTime(data.end_time)}
          </Text>
        </View>

        {isCheckIn ? (
          <View style={styles.row}>
            <Icon name="check-circle" color="green" size={iconSize} style={{ marginRight: 5 }} />
            <Text style={{ fontStyle: 'italic', fontSize: 15, color: 'green' }}>{'Bạn đã điểm danh'}</Text>
          </View>
        ) : null}
        {isClosed && !isCheckIn ? (
          <View style={styles.row}>
            <Icon name="close" color="red" size={iconSize} style={{ marginRight: 5 }} />
            <Text style={{ fontStyle: 'italic', fontSize: 15, color: 'red' }}>Phòng đã đóng bởi {!isAuthor ? 'giáo viên' : 'bạn'}</Text>
          </View>
        ) : isExpire && !isCheckIn ? (
          <View style={styles.row}>
            <Icon name="timer-off" color="orange" size={iconSize} style={{ marginRight: 5 }} />
            <Text style={{ fontStyle: 'italic', fontSize: 15, alignSelf: 'center', alignContent: 'center', width: '100%', color: 'orange' }}>
              Đã hết hạn điểm danh
            </Text>
          </View>
        ) : notStart ? (
          <View style={styles.row}>
            <Icon name="close" color="#24a7cc" size={iconSize} style={{ marginRight: 5 }} />
            <Text style={{ fontStyle: 'italic', fontSize: 15, color: '#24a7cc' }}>Chưa đến hạn điểm danh</Text>
          </View>
        ) : null}
        {isAuthor ? (
          <Button onPress={this.toStat} containerStyle={cStyles.btnwrap} titleStyle={cStyles.btnText} buttonStyle={cStyles.btnPrimary} title="Xem thông tin" />
        ) : null}
        {canCheckin ? (
          <Button
            containerStyle={cStyles.btnwrap}
            titleStyle={cStyles.btnText}
            buttonStyle={cStyles.btnPrimary}
            title="Vào điểm danh"
            onPress={this.props.onClickFunc}
          />
        ) : null}
      </Card>
    );
  }
}
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    userInfo: state.user.userInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Footer));
