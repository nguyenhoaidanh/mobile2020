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
    this.props.appActions.setCurScreent({ currentScreent: { title: 'Điểm danh' } });
  };
  render() {
    const { index = 0, room = {}, currentClass = {}, userInfo = {} } = this.props;
    const isExpire = false; //   !(Date.now() >= +room.start_time && Date.now() <= +room.end_time);
    const isAuthor = room.user_create == userInfo.id;
    //console.log(123456, room.user_create, userInfo.id);
    return (
      <Card>
        <View style={styles.row}>
          <Text style={{ width: '100%', fontSize: 20, alignContent: 'center', fontWeight: 'bold' }}>
            {currentClass.name_subject} - {room.title}
          </Text>
          <Text style={styles.textLeft}>Sỉ số: 90/{currentClass.number_of_student}</Text>
        </View>
        {isAuthor ? (
          <Button containerStyle={cStyles.btnwrap} titleStyle={cStyles.btnText} buttonStyle={cStyles.btnPrimary} title="Chi tiết" />
        ) : !isExpire ? (
          <Button
            containerStyle={cStyles.btnwrap}
            titleStyle={cStyles.btnText}
            buttonStyle={cStyles.btnPrimary}
            title="Vào điểm danh"
            onPress={this.props.onClickFunc}
          />
        ) : (
          <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
            <Badge status="warning" />
            <Text style={{ marginLeft: 10, fontSize: 20, color: 'orange' }}>{'Đã hết hạn điểm danh'}</Text>
          </View>
        )}
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
