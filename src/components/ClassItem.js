import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button, Badge, ButtonGroup, Card, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import cStyles from '../constants/common-styles';
import { list_screen_map, ROLES } from '../constants/constants';
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
  render() {
    let { index = 0, data = {}, currentClass = {}, userInfo = {} } = this.props;
    const isTeacher = userInfo.role == ROLES.teacher;
    return (
      <ListItem
        onPress={this.props.clickFunc}
        chevron
        bottomDivider
        leftIcon={<Icon name={'graduation-cap'} size={30} color={'black'} />}
        title={isTeacher ? `${data.code_subject} - ${data.name_subject}` : `${data.class.code_subject} - ${data.class.name_subject}`}
        titleStyle={{ fontWeight: 'bold' }}
        subtitle={isTeacher ? `${data.code_class} ` : `${data.class.code_class} - ${data.teacher.fullname}`}
        bottomDivider
      />
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
