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
import cStyles from '../constants/common-styles';
const styles = StyleSheet.create({
  group: { width: '100%', height: 50, marginLeft: 0, marginTop: 0, padding: 0, backgroundColor: 'transparent' },
  btn: { borderColor: 'transparent', borderRadius: 30, backgroundColor: 'white', marginLeft: 10, marginRight: 10, marginBottom: 5, marginTop: 5 },
  btnText: { fontSize: 15, color: 'blue' },
  btnIcon: { marginRight: 20 },
});

type Props = {};
class Home extends Component<Props> {
  state = {};
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  navigate = (url) => {
    this.props.history.push(url);
  };
  openListRoom = (_class) => {
    this.setState({ isListClass: false });
  };
  validate = () => {
    const { currentRoom = {} } = this.state;
    //call api here
    this.props.appActions.setCurScreent({ currentScreent: { text: 'Điểm danh' } });
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
              buttonStyle={{ width: '80%', borderRadius: 20, backgroundColor: '#f99a34' }}
              title="Hủy bỏ"
              onPress={() => this.setState({ showForm: false })}
            />
            <Button
              containerStyle={{ width: '50%' }}
              titleStyle={cStyles.btnText}
              buttonStyle={{ width: '80%', borderRadius: 20 }}
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
    const { showForm = false, errorMessage = {}, listRoom = [1, 23, 32, 23, 45, 45, 3434], isListClass = true } = this.state;
    const itemHeight = 195;
    const listClass = [
      {
        name: 'Cơ sở dữ liệu - L01',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'Nguyễn Thị A - 18 phòng',
      },
      {
        name: 'Cơ sở dữ liệu - L01',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'Nguyễn Thị A - 18 phòng',
      },
      {
        name: 'Cơ sở dữ liệu - L01',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'Nguyễn Thị A - 18 phòng',
      },
      {
        name: 'Cơ sở dữ liệu - L01',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'Nguyễn Thị A - 18 phòng',
      },
      {
        name: 'Cơ sở dữ liệu - L01',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'Nguyễn Thị A - 18 phòng',
      },
      {
        name: 'Cơ sở dữ liệu - L01',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'Nguyễn Thị A - 18 phòng',
      },
      {
        name: 'Cơ sở dữ liệu - L01',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'Nguyễn Thị A - 18 phòng',
      },
      {
        name: 'Cơ sở dữ liệu - L01',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'Nguyễn Thị A - 18 phòng',
      },
      {
        name: 'Cơ sở dữ liệu - L01',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'Nguyễn Thị A - 18 phòng',
      },
    ];
    const buttons = [
      {
        element: () => (
          <View style={{ alignItems: 'center' }} onPress={() => this.navigate('/create-room')}>
            <Text onPress={() => this.navigate('/create-room')} style={styles.btnText}>
              <Icon style={styles.btnIcon} name={'plus'} size={iconSize} color={iconColor} />
              Tạo phòng
            </Text>
          </View>
        ),
      },
      {
        element: () => (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.btnText}>
              <Icon style={styles.btnIcon} name={'sort'} size={iconSize} color={iconColor} />
              Sắp xếp
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
            <Text style={{ fontSize: 30, alignSelf: 'center', color: 'white' }}>{isListClass ? 'Danh sách lớp' : 'Danh sách phòng'}</Text>
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
    app: state.app,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
