import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Overlay, Input, Button, ListItem, ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import RoomItem from '../components/RoomItem';
import { itemHeight } from '../constants/constants';
import { shadow, AXIOS } from '../utils/functions';
import cStyles from '../constants/common-styles';
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
});
const listClassDefault = [
  {
    name: 'Cơ sở dữ liệu - L01',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Nguyễn Thị A - 18 phòng',
    _id: 1,
  },
  {
    name: 'Cơ sở dữ liệu - L01',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Nguyễn Thị A - 18 phòng',
    _id: 2,
  },
  {
    name: 'Cơ sở dữ liệu - L01',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Nguyễn Thị A - 18 phòng',
    _id: 3,
  },
  {
    name: 'Cơ sở dữ liệu - L01',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Nguyễn Thị A - 18 phòng',
    _id: 4,
  },
  {
    name: 'Cơ sở dữ liệu - L01',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Nguyễn Thị A - 18 phòng',
    _id: 5,
  },
  {
    name: 'Cơ sở dữ liệu - L01',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Nguyễn Thị A - 18 phòng',
    _id: 6,
  },
  {
    name: 'Cơ sở dữ liệu - L01',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Nguyễn Thị A - 18 phòng',
    _id: 7,
  },
  {
    name: 'Cơ sở dữ liệu - L01',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Nguyễn Thị A - 18 phòng',
    _id: 7,
  },
  {
    name: 'Cơ sở dữ liệu - L01',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Nguyễn Thị A - 18 phòng',
    _id: 7,
  },
];
type Props = {};
class Home extends Component<Props> {
  state = {};
  componentDidMount() {
    const { listClass = [] } = this.props;
    if (listClass.length == 0)
      AXIOS('/classes', 'GET', {}, {}, this.props.userInfo.token)
        .then(({ data }) => {
          console.log('123456', 1, data);
          this.props.appActions.setListClass({ listClass: data.result });
        })
        .catch((err) => {
          console.log('123456', 2, err.response.data);
          this.setState({ errorMessage: { password: 'Thông tin đăng nhập chưa đúng' } });
        });
  }
  sortListRoom() {
    const { listRoom = [] } = this.state;
    this.setState({ listRoom: listRoom.sort((x, y) => 1) });
  }
  openListRoom = (_class) => {
    AXIOS(`/rooms/classes/${_class._id}`, 'GET', {}, {}, this.props.userInfo.token)
      .then(({ data }) => {
        console.log('123456', 11, data);
        this.setState({ listRoom: data, isListClass: false });
      })
      .catch((err) => {
        console.log('123456', 2, err.response.data);
        this.setState({ errorMessage: { password: 'Thông tin đăng nhập chưa đúng' } });
      });
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
    const { currentRoom = {} } = this.state;
    //call api here
    this.props.appActions.setCurScreent({ currentScreent: { title: 'Điểm danh' } });
    this.navigate('/check-in');
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
    let { showForm = false, errorMessage = {}, isListClass = true } = this.state;
    const itemHeight = 195;
    let { listClass = [], listRoom = [] } = this.props;
    if (listClass.length == 0) listClass = listClassDefault;
    if (listRoom.length == 0) listRoom = listClassDefault;
    const buttons = [
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
            <Text style={styles.btnText}>
              <Icon style={styles.btnIcon} name={'sort'} size={iconSize} color={iconColor} />
              <Text style={{ marginLeft: 30 }}> Sắp xếp</Text>
            </Text>
          </View>
        ),
      },
    ];
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
            ? listRoom.map((room, idx) => <RoomItem onClick={() => this.setState({ showForm: true, currentRoom: room })} room={room} key={idx} index={idx} />)
            : listClass.map((l, i) => (
                <ListItem
                  onPress={() => this.openListRoom(l)}
                  key={i}
                  chevron
                  bottomDivider
                  leftIcon={<Icon name={'graduation-cap'} size={30} color={'black'} />}
                  title={l.name}
                  titleStyle={{ fontWeight: 'bold' }}
                  subtitle={l.subtitle}
                  bottomDivider
                />
              ))}
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
