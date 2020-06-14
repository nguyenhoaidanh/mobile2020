import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity, Overlay, Image } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button, Badge, ButtonGroup, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import { formatTime, setAvatar } from '../utils/functions';
import cStyles from '../constants/common-styles';
const styles = StyleSheet.create({
  textLeft: {
    fontSize: 20,
  },
});
const iconSize = 24,
  iconColor = 'black';
type Props = {};
class Footer extends Component<Props> {
  state = {};
  render() {
    const { index = 0, data = {} } = this.props;
    const { session = {} } = data;
    const _class = data.class;
    return (
      <View>
        <TouchableOpacity onPress={this.props.onClick}>
          <Card>
            <Text style={styles.textLeft}>
              Bạn đã điểm danh lớp
              <Text style={{ fontWeight: 'bold' }}>
                {_class.code_subject} - {_class.name_subject}
              </Text>
            </Text>
            <Text style={styles.textLeft}>
              Giảng viên: <Text style={{ fontWeight: 'bold' }}>{_class.teacher_id}</Text>
            </Text>
            <Text style={{ color: 'orange', fontSize: 20 }}>Chạm để xem hình</Text>
            <Text style={{ alignSelf: 'flex-end', color: 'green', fontSize: 15 }}>{formatTime(session.create_date)}</Text>
          </Card>
        </TouchableOpacity>
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
