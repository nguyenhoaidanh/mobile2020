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
import { shadow, AXIOS } from '../utils/functions';
import cStyles from '../constants/common-styles';
import Loading from '../components/Loading';
const styles = StyleSheet.create({
  group: {
    ...shadow(),
    borderColor: 'transparent',
    width: '100%',
    height: 50,
    marginLeft: 0,
    marginTop: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
  btn: {
    alignSelf: 'center',
    width: 130,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRadius: 30,
    backgroundColor: '#F4F4F4',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    marginTop: 5,
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
      AXIOS('/classes/joined', 'GET', {}, {}, this.props.userInfo.token)
        .then(({ data }) => {
          console.log('123456', `found ${data.result.length} class`);
          this.props.appActions.setListClass({ listClass: data.result });
        })
        .catch((err) => {
          console.log('123456', 2, err.response.data);
        })
        .finally(() => this.setState({ loading: false }));
    }
  }
  onSort = () => {
    const { listRoom = [], listClass = [], sort = false } = this.state;
    const func = (x, y) => {
      if (x.name_subject) {
        return (sort ? -1 : 1) * x.name_subject.localeCompare(y.name_subject);
      }
      return 1;
    };
    this.setState({ sort: !sort, listRoom: listRoom.sort(func), listClass: listClass.sort(func) });
  };
  openListRoom = (_class) => {
    this.setState({ currentClass: _class, loading: true });
    AXIOS(`/rooms/classes/${_class.id}`, 'GET', {}, {}, this.props.userInfo.token)
      .then(({ data }) => {
        console.log('123456', `found ${data.result.length} room`);
        this.setState({ listRoom: data.result, isListClass: false });
      })
      .catch((err) => {
        console.log('123456', 2, err.response.data);
      })
      .finally(() => this.setState({ loading: false }));
  };
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  navigate = (url) => {
    this.props.history.push(url);
  };
  createRoom = () => {
    this.props.appActions.setCurScreent({ currentScreent: { title: 'Tạo phòng mới' } });
    this.navigate('/create-room');
  };

  validate = () => {
    const { currentRoom = {}, password } = this.state;
    this.props.appActions.setCurScreent({ currentScreent: { title: 'Điểm danh' } });
    this.props.appActions.setCurRoom({ currentRoom: { ...currentRoom, secret: password } });
    return this.navigate('/check-in');
    this.setState({ loading: true });
    AXIOS(`/rooms/validate`, 'POST', {}, {}, this.props.userInfo.token)
      .then(({ data }) => {
        console.log('123456', 11, data);
        this.props.appActions.setCurScreent({ currentScreent: { title: 'Điểm danh' } });
        this.navigate('/check-in');
      })
      .catch((err) => {
        console.log('123456', 2, err.response.data);
        this.setState({ errorMessage: { password: 'Mật khẩu chưa chính xác' } });
      })
      .finally(() => this.setState({ loading: false }));
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
              buttonStyle={{ alignSelf: 'center', width: '80%', borderRadius: 20, backgroundColor: '#f99a34' }}
              title="Hủy bỏ"
              onPress={() => this.setState({ showForm: false })}
            />
            <Button
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
    let { listClass = [], showForm = false, loading = true, errorMessage = {}, isListClass = true, listRoom = [] } = this.state;
    const itemHeight = 195;
    // if (listClass.length == 0) listClass = listClassDefault;
    //if (listRoom.length == 0) listRoom = listClassDefault;
    let buttons = [
      {
        element: () => (
          <View style={{ alignItems: 'center' }} onPress={() => this.navigate('/create-room')}>
            <Text onPress={this.createRoom} style={styles.btnText}>
              <Icon style={styles.btnIcon} name={'plus'} size={iconSize} color={iconColor} />
              <Text style={{ marginLeft: 30 }}>Tạo phòng</Text>
            </Text>
          </View>
        ),
      },
      {
        element: () => (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.btnText} onPress={this.onSort}>
              <Icon style={styles.btnIcon} name={'sort'} size={iconSize} color={iconColor} />
              <Text style={{ marginLeft: 30 }}> Sắp xếp</Text>
            </Text>
          </View>
        ),
      },
    ];
    if (this.props.userInfo.role !== ROLES.teacher) buttons = buttons.slice(1);
    return (
      <View>
        {showForm ? this.renderPopupPassword() : null}
        <ButtonGroup buttonStyle={styles.btn} containerStyle={styles.group} onPress={this.updateIndex} buttons={buttons} />
        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
          <View style={{ width: '100%', paddingTop: 10, paddingBottom: 10 }}>
            <Text style={{ fontStyle: 'italic', fontSize: 25, alignSelf: 'center', color: 'white' }}>{isListClass ? 'Danh sách lớp' : 'Danh sách phòng'}</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingLeft: 15, paddingRight: 15, marginTop: 10, paddingTop: 0 }}>
          {!isListClass
            ? listRoom.map((room, idx) => (
                <RoomItem
                  currentClass={this.state.currentClass}
                  onClickFunc={() => this.setState({ showForm: true, currentRoom: room })}
                  room={room}
                  key={idx}
                  index={idx}
                />
              ))
            : listClass.map((l, i) => (
                <ListItem
                  onPress={() => this.openListRoom(l)}
                  key={i}
                  chevron
                  bottomDivider
                  leftIcon={<Icon name={'graduation-cap'} size={30} color={'black'} />}
                  title={`${l.code_subject} - ${l.name_subject}`}
                  titleStyle={{ fontWeight: 'bold' }}
                  subtitle={l.code_class}
                  bottomDivider
                />
              ))}
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
