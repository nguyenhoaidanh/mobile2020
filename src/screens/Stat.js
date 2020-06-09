import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Avatar, Divider, Card, ListItem, ButtonGroup } from 'react-native-elements';
import cStyles from '../constants/common-styles';
import ImageInput from '../components/ImageInput';
import { showImageInput, setAvatar, shorterString, AXIOS, uploadFileToServer } from '../utils/functions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import { list_screen_map, ROLES } from '../constants/constants';
import AsyncStorage from '@react-native-community/async-storage';
import { checkTokenExpire } from '../utils/functions';
import Loading from '../components/Loading';
const styles = StyleSheet.create({
  selected: { backgroundColor: 'transparent' },
  selectedText: { color: 'green' },
  group: { marginTop: 10 },
});
list = [{ text: 'Tất cả' }, { text: 'Đã điểm danh' }, { text: 'Chưa điểm danh' }];

const MODES = { ALL: 'Danh sách sinh viên', NOT_CHECKIN: 'Chưa điểm danh', CHECKIN: 'Đã điểm danh' };
type Props = {};
class Home extends Component<Props> {
  state = {};
  componentDidMount = () => {
    const { currentRoom = {} } = this.props;
    const { room = {} } = currentRoom;
    this.setState({ loading: true });
    AXIOS(`/rooms/${currentRoom.id}/students`, 'GET', {}, {}, this.props.userInfo.token)
      .then(({ data }) => {
        console.log('123456', 1, data.object);
        this.setState({ listStudent: data.object.filter((e) => e.user.role != ROLES.teacher) });
      })
      .catch((err) => {
        checkTokenExpire(err, this);
      })
      .finally(() => this.setState({ loading: false }));
  };
  updateIndex = (selectedIndex) => {
    mode = selectedIndex == 0 ? MODES.ALL : selectedIndex == 1 ? MODES.CHECKIN : MODES.NOT_CHECKIN;
    this.setState({ selectedIndex, mode });
    console.log(123456, mode);
  };
  render() {
    let { listStudent = [], mode = MODES.ALL, selectedIndex = 0, loading = true } = this.state;
    let buttons = list.map((el, i) => ({
      element: () => (
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Text style={{ color: i == selectedIndex ? 'brown' : 'black' }}>{el.text}</Text>
        </View>
      ),
    }));
    switch (mode) {
      case MODES.NOT_CHECKIN:
        listStudent = listStudent.filter((e) => !e.isCheckin);
        break;
      case MODES.CHECKIN:
        listStudent = listStudent.filter((e) => e.isCheckin);
        break;
      default:
        break;
    }
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column' }}>
        <View style={styles.container}>
          <ButtonGroup
            selectedButtonStyle={styles.selected}
            selectedTextStyle={styles.selectedText}
            containerStyle={styles.group}
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
          />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Card
            title={
              <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10 }}>
                <View style={{ alignItems: 'center', width: '100%' }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                    <Text style={{ color: 'green' }}>{`${mode} - ${listStudent.length} sinh viên`} </Text>
                  </Text>
                </View>
              </View>
            }
            containerStyle={{ margin: 10, padding: 0, backgroundColor: '#E9EBEE' }}
          >
            {loading ? (
              <Loading />
            ) : (
              listStudent.map((l, i) => (
                <ListItem
                  rightElement={<Icon name={l.isCheckin ? 'check-circle' : 'close'} color={l.isCheckin ? 'green' : 'red'} size={20} />}
                  key={i}
                  leftAvatar={{ source: { uri: l.avatar_url } }}
                  title={l.user.fullname}
                  subtitle={l.user.mssv + ''}
                  bottomDivider
                />
              ))
            )}
          </Card>
          <View style={{ height: 65 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    currentRoom: state.app.currentRoom,
    userInfo: state.user.userInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
