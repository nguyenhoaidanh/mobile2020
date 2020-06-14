import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Overlay, Input, Button, ListItem, ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import RoomItem from '../components/RoomItem';
import { itemHeight, ROLES } from '../constants/constants';
import { AXIOS, checkTokenExpire, shadow } from '../utils/functions';
import cStyles from '../constants/common-styles';
import Loading from '../components/Loading';
import ClassItem from '../components/ClassItem';
const styles = StyleSheet.create({
  btn: {
    ...shadow(),
    width: '50%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#F4F4F4',
    paddingBottom: 10,
    paddingTop: 10,
  },
  btnText: { fontSize: 18, color: 'black' },
  btnIcon: { marginRight: 20, paddingRight: 10 },
  notify: { color: 'white', fontSize: 20, alignSelf: 'center' },
});
type Props = {};
class Home extends Component<Props> {
  state = {};
  componentWillReceiveProps(props) {
    this.setState({ listClass: props.listClass });
  }
  componentDidMount() {
    const { listClass = [] } = this.props;
    this.setState({ loading: listClass.length == 0 });
    if (listClass.length == 0) {
      const { role, token, id } = this.props.userInfo || {};
      const path = role == ROLES.teacher ? '/classes/teachers/' + id : '/classes/students/' + id;
      AXIOS(path, 'GET', {}, {}, token)
        .then(({ data }) => {
          console.log('123456', `found ${data.object.length} class`);
          this.props.appActions.setListClass({ listClass: data.object });
        })
        .catch((err) => {
          checkTokenExpire(err, this);
        })
        .finally(() => this.setState({ loading: false }));
    } else this.setState({ listClass });
    if (this.props.userInfo.role == ROLES.student)
      AXIOS('/sessions/checkins', 'GET', {}, {}, this.props.userInfo.token)
        .then(({ data }) => {
          console.log('123456', `found ${data.object.length} session`);
          this.setState({ history: data.object });
        })
        .catch((err) => {
          checkTokenExpire(err, this);
        });
  }
  onSort = () => {
    let { listRoom = [], listClass = [], sort = false, isListClass = true } = this.state;
    if (isListClass) {
      listClass = listClass.sort((x, y) => (sort ? -1 : 1) * x.name_subject.localeCompare(y.name_subject));
    } else {
      const funct = (room) => {
        const curTime = Date.now();
        const isExpire = !(curTime >= +room.start_time && curTime <= +room.end_time);
        return !isExpire && !room.isClosed;
      };
      listRoom = sort
        ? [...listRoom.filter((e) => funct(e)), ...listRoom.filter((e) => !funct(e))]
        : [...listRoom.filter((e) => !funct(e)), ...listRoom.filter((e) => funct(e))];
    }
    this.setState({ sort: !sort, listRoom, listClass });
  };
  openListRoom = (_class) => {
    const { history = [] } = this.state;
    const { userInfo = {} } = this.props;
    if (userInfo.role !== ROLES.teacher) _class = _class.class;
    this.setState({ currentClass: _class, loading: true });
    this.props.appActions.setCurClass({
      currentClass: _class,
    });
    AXIOS(`/rooms/classes/${_class.id}`, 'GET', {}, {}, this.props.userInfo.token)
      .then(({ data }) => {
        console.log('123456', `found ${data.object.length} room`);
        let listRoom = data.object.map((e) => {
          return { ...e, isCheckIn: history.find((hi) => e.id == hi.session.room_id) !== undefined };
        });
        // console.log('123456', listRoom);
        this.setState({ listRoom, isListClass: false });
        this.props.appActions.setCurScreent({
          currentScreent: {
            icon: 'view-list',
            title: 'Danh sách phòng',
          },
        });
      })
      .catch((err) => {
        checkTokenExpire(err, this);
      })
      .finally(() => this.setState({ loading: false }));
  };
  renderPicker = (key = 'faculty') => {
    let { selectedItem = 0 } = this.state;
    return (
      <Overlay overlayStyle={{ width: '90%' }} isVisible={this.state.showPicker} onBackdropPress={() => this.setState({ showPicker: false })}>
        <View>
          <View style={{ alignSelf: 'center' }}>
            <WheelPicker selectedItem={selectedItem} data={dataList} onItemSelected={this.onItemSelected} />
          </View>
          <View style={{ alignSelf: 'center', marginTop: 0, paddingTop: 0 }}>
            <Button
              containerStyle={{ width: '50%' }}
              titleStyle={cStyles.btnText}
              buttonStyle={{ alignSelf: 'center', width: '80%', borderRadius: 20 }}
              title="Xác nhận"
              onPress={() => {
                this.setState({ showPicker: false, [key]: dataList[this.state.selectedItem] });
              }}
            />
          </View>
        </View>
      </Overlay>
    );
  };
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  navigate = (url) => {
    this.props.history.push(url);
  };
  createRoom = () => {
    this.navigate('/create-room');
    this.props.appActions.setCurScreent({ currentScreent: { title: 'Tạo phòng mới' } });
  };

  validate = () => {
    const { currentRoom = {}, password } = this.state;
    this.props.appActions.setCurRoom({ currentRoom: { ...currentRoom, secret: password } });
    if (!password) return;
    this.setState({ smallLoading: true });
    let data = { room_id: currentRoom.id, secret: password };
    console.log(123456, data);

    AXIOS(`/rooms/authorize`, 'POST', data, {}, this.props.userInfo.token)
      .then(({ data }) => {
        this.props.appActions.setCurRoom({ currentRoom: { ...currentRoom, secret: password } });
        this.props.appActions.setCurScreent({ currentScreent: { title: 'Điểm danh' } });
        this.navigate('/check-in');
      })
      .catch((err) => {
        checkTokenExpire(err, this);
        this.setState({ errorMessage: { password: 'Mật khẩu chưa chính xác' } });
      })
      .finally(() => this.setState({ smallLoading: false }));
  };
  renderPopupPassword = () => {
    const { errorMessage = {}, password = '' } = this.state;
    return (
      <Overlay overlayStyle={{ width: '90%' }} isVisible={this.state.showForm} onBackdropPress={() => this.setState({ showForm: false })}>
        <View>
          <Input
            style={{ width: '100%' }}
            label="Nhập mật khẩu phòng"
            errorStyle={cStyles.errorStyle}
            errorMessage={errorMessage.password}
            placeholder="Password"
            keyboardType="numeric"
            leftIcon={<Icon name="key" size={20} color={'black'} />}
            onChangeText={(value) => this.onchange('password', value)}
            secureTextEntry={true}
          />
          <View style={{ flexDirection: 'row' }}>
            <Button
              containerStyle={{ width: '50%' }}
              titleStyle={cStyles.btnText}
              loading={this.state.smallLoading}
              buttonStyle={{ alignSelf: 'center', width: '80%', borderRadius: 20, backgroundColor: '#f99a34' }}
              title="Hủy bỏ"
              onPress={() => this.setState({ showForm: false })}
            />
            <Button
              loading={this.state.smallLoading}
              containerStyle={{ width: '50%' }}
              titleStyle={cStyles.btnText}
              buttonStyle={{ alignSelf: 'center', width: '80%', borderRadius: 20 }}
              title="Vào phòng"
              onPress={this.validate}
            />
          </View>
        </View>
      </Overlay>
    );
  };
  render() {
    const iconSize = 15;
    const iconColor = 'black';
    const { userInfo = {} } = this.props;
    let { listClass = [], showForm = false, loading = true, errorMessage = {}, isListClass = true, listRoom = [] } = this.state;
    const itemHeight = 195;
    return (
      <View>
        {showForm ? this.renderPopupPassword() : null}
        <View style={{ flexDirection: 'row', width: '100%', padding: 10, alignItems: 'center', alignContent: 'center' }}>
          {isListClass || userInfo.role == ROLES.student ? (
            <View style={{ width: '25%' }}></View>
          ) : (
            <View style={styles.btn}>
              <Text onPress={this.createRoom} style={styles.btnText}>
                <Icon style={styles.btnIcon} name={'plus'} size={iconSize} color={iconColor} />
                <Text style={{ marginLeft: 30 }}>Tạo phòng</Text>
              </Text>
            </View>
          )}
          <View style={styles.btn}>
            <Text style={styles.btnText} onPress={this.onSort}>
              <Icon style={styles.btnIcon} name={'sort'} size={iconSize} color={iconColor} />
              <Text style={{ marginLeft: 30 }}> Sắp xếp</Text>
            </Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingLeft: 10, paddingRight: 10, marginTop: 10, paddingTop: 0 }}>
          {!isListClass
            ? listRoom.map((room, idx) => (
                <RoomItem
                  currentClass={this.state.currentClass}
                  onClickFunc={() => {
                    this.setState({ showForm: true, currentRoom: room });
                  }}
                  data={room}
                  key={idx}
                  index={idx}
                />
              ))
            : listClass.map((l, i) => <ClassItem key={i} clickFunc={() => this.openListRoom(l)} data={l} />)}
          {loading ? (
            <Loading />
          ) : listClass.length === 0 || listRoom.length == 0 ? (
            <View>
              {isListClass && listClass.length == 0 ? <Text style={styles.notify}>Bạn chưa có môn học nào</Text> : null}
              {!isListClass && listRoom.length == 0 ? <Text style={styles.notify}>Không có phòng học nào</Text> : null}
            </View>
          ) : null}
          <View style={{ height: 265 }} />
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    listClass: state.app.listClass,
    userInfo: state.user.userInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
