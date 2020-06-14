import React, { Component } from 'react';
import { ToastAndroid, TouchableOpacity, Platform, StyleSheet, View, Text, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Overlay, Input, Button, Avatar, Divider, Card, ListItem, ButtonGroup, Tooltip } from 'react-native-elements';
import cStyles from '../constants/common-styles';
import DatePicker from 'react-native-datepicker';
import ImageInput from '../components/ImageInput';
import { WheelPicker } from 'react-native-wheel-picker-android';
import { showImageInput, setAvatar, shorterString, AXIOS, uploadFileToServer, formatTime, changeTime } from '../utils/functions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import { list_screen_map, ROLES } from '../constants/constants';
import AsyncStorage from '@react-native-community/async-storage';
import { checkTokenExpire } from '../utils/functions';
import Loading from '../components/Loading';
const styles = StyleSheet.create({
  selected: { backgroundColor: 'lightblue' },
  selectedText: { color: 'green' },
  group: { marginTop: 10 },
  value: { fontWeight: 'bold', color: 'brown', fontSize: 15, alignSelf: 'center', alignItems: 'center', alignContent: 'center' },
});
const dataList = [];
for (let index = 1; index < 20; index++) {
  dataList.push(index + '');
}
list = [{ text: 'Tất cả' }, { text: 'Đã điểm danh' }, { text: 'Chưa điểm danh' }];
const iconSize = 24;
const iconColor = 'black';
const MODES = { ALL: 'Danh sách sinh viên', NOT_CHECKIN: 'Chưa điểm danh', CHECKIN: 'Đã điểm danh' };
type Props = {};
class Home extends Component<Props> {
  state = {};
  componentDidMount = () => {
    const { currentRoom = {} } = this.props;
    this.setState({
      loading: true,
      ...currentRoom,
      selectedIndex: currentRoom.number - 1,
      start_time: formatTime(currentRoom.start_time),
      end_time: formatTime(currentRoom.end_time),
    });
    AXIOS(`/rooms/${currentRoom.id}/students`, 'GET', {}, {}, this.props.userInfo.token)
      .then(({ data }) => {
        console.log('123456', 'found hs', data.object.length);
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
  };
  onItemSelected = (selectedItem) => {
    this.setState({ selectedItem });
  };
  renderPicker = () => {
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
                this.setState({ showPicker: false, number: dataList[this.state.selectedItem] });
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
  update = (isForgotPass = false) => {
    let { title, number, password, start_time, end_time, room_pass } = this.state;
    let data;
    if (isForgotPass) {
      if (!room_pass) return;
      data = { room_id: this.props.currentRoom.id, user_pass: password, secret: room_pass };
    } else {
      if (!title || !password || !number) return;
      start_time = changeTime(start_time);
      end_time = changeTime(end_time);
      if (Date.now() > end_time) return this.setState({ errorMessage: { end_time: 'Thời gian không hợp lệ' } });
      //if (Date.now() > start_time) return this.setState({ errorMessage: { start_time: 'Thời gian không hợp lệ' } });
      if (start_time > end_time) return this.setState({ errorMessage: { start_time: 'Thời gian không hợp lệ' } });
      data = { room_id: this.props.currentRoom.id, title, number, user_pass: password, start_time, end_time };
    }
    console.log(123456, data);
    AXIOS('/rooms', 'PUT', data, {}, this.props.userInfo.token)
      .then(({ data }) => {
        console.log(123456, data);
        ToastAndroid.show('Cập nhật thành công', ToastAndroid.LONG);
        this.props.appActions.setCurRoom({ currentRoom: data });
        this.setState({ showForm: false, password: '', forgotPass: false });
      })
      .catch((err) => {
        this.setState({ errorMessage: { password: 'Mật khẩu tài khoản chưa chính xác' } });
        checkTokenExpire(err);
      });
  };
  renderPopupPassword = () => {
    const { errorMessage = {}, password = '', forgotPass = false } = this.state;
    return (
      <Overlay overlayStyle={{ width: '90%' }} isVisible={this.state.showConfrimPass} onBackdropPress={() => this.setState({ showForm: false })}>
        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', alignSelf: 'center' }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 10, width: '100%', fontSize: 20, textAlign: 'center' }}>
            {forgotPass ? 'Reset mật khẩu phòng' : 'Đóng phòng'}
          </Text>
        </View>
        <View>
          <Input
            style={{ width: '100%' }}
            label="Nhập mật khẩu tài khoản của bạn"
            errorStyle={cStyles.errorStyle}
            errorMessage={errorMessage.password}
            placeholder="Password"
            keyboardType="numeric"
            leftIcon={<Icon name="key" size={20} color={'black'} />}
            onChangeText={(value) => this.onchange('password', value)}
            secureTextEntry={true}
          />
          {forgotPass ? (
            <Input
              style={{ width: '100%' }}
              label="Nhập mật mới cho phòng"
              errorStyle={cStyles.errorStyle}
              placeholder="Password"
              keyboardType="numeric"
              leftIcon={<Icon name="key" size={20} color={'black'} />}
              onChangeText={(value) => this.onchange('room_pass', value)}
              secureTextEntry={true}
            />
          ) : null}
          <View style={{ flexDirection: 'row' }}>
            <Button
              containerStyle={{ width: '50%' }}
              titleStyle={cStyles.btnText}
              loading={this.state.smallLoading}
              buttonStyle={{ alignSelf: 'center', width: '80%', borderRadius: 20, backgroundColor: '#f99a34' }}
              title="Hủy bỏ"
              onPress={() => this.setState({ showConfrimPass: false })}
            />
            <Button
              loading={this.state.smallLoading}
              containerStyle={{ width: '50%' }}
              titleStyle={cStyles.btnText}
              buttonStyle={{ alignSelf: 'center', width: '80%', borderRadius: 20 }}
              title={forgotPass ? 'Cập nhật' : 'Đồng ý'}
              onPress={forgotPass ? () => this.update(true) : this.closeRoom}
            />
          </View>
        </View>
      </Overlay>
    );
  };
  closeRoom = () => {
    const { password } = this.state;
    if (!password) return;
    const data = { room_id: this.props.currentRoom.id, user_pass: password };
    console.log(123456, data);
    AXIOS('/rooms', 'DELETE', data, {}, this.props.userInfo.token)
      .then(({ data }) => {
        console.log(123456, data);
        ToastAndroid.show('Đóng phòng thành công', ToastAndroid.LONG);
        this.props.appActions.setCurRoom({ currentRoom: { ...this.props.currentRoom, isClose: true } });
        this.setState({ showConfrimPass: false, isClose: true });
      })
      .catch((err) => {
        checkTokenExpire(err);
      });
  };
  reset = () => {
    const { currentRoom = {} } = this.props;
    this.setState({
      password: '',
      showForm: false,
      ...currentRoom,
      start_time: formatTime(currentRoom.start_time),
      end_time: formatTime(currentRoom.end_time),
    });
  };
  renderPopupEdit = () => {
    const { currentRoom = {} } = this.props;
    const { errorMessage = {}, password = '', number, start_time, end_time, title } = this.state;
    return (
      <Overlay overlayStyle={{ width: '90%' }} isVisible={this.state.showForm} onBackdropPress={() => this.setState({ showForm: false })}>
        <View>
          <Input
            label="Tên phòng"
            errorStyle={cStyles.errorStyle}
            errorMessage={errorMessage.title}
            placeholder="Vd: Cơ sở dữ liệu - 11/2/2020"
            value={title}
            leftIcon={<Icon name="star" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('title', value)}
          />
          {this.state.showPicker ? this.renderPicker() : null}
          <TouchableOpacity onPress={() => this.setState({ showPicker: true, keyPicker: 'faculty' })}>
            <Input
              label="Số lượng thành viên mỗi nhóm"
              errorStyle={cStyles.errorStyle}
              errorMessage={errorMessage.number}
              maxLength={10}
              keyboardType="numeric"
              disabled
              defaultValue={'1'}
              placeholder="Chạm để chọn"
              value={number}
              leftIcon={<Icon name="group" size={iconSize} color={iconColor} />}
            />
          </TouchableOpacity>
          <Text style={cStyles.label}>Thời gian bắt đầu điểm danh</Text>
          <DatePicker
            is24Hour
            style={{ width: '100%' }}
            mode="datetime"
            format="hh:mm A, DD-MM-YYYY"
            placeholder="Chạm để chọn thời gian"
            onDateChange={(start_time) => {
              this.setState({ start_time });
            }}
            iconComponent={
              <Input
                errorStyle={cStyles.errorStyle}
                errorMessage={errorMessage.start_time}
                placeholder="Chạm để chọn thời gian"
                defaultValue={start_time}
                disabled
                leftIcon={<Icon name="calendar" size={iconSize} color={iconColor} />}
              />
            }
            customStyles={{
              dateInput: {
                display: 'none',
              },
            }}
          />
          <Text style={cStyles.errorStyle}>{errorMessage.start_time}</Text>
          <Text style={cStyles.label}> Thời gian kết thúc điểm danh</Text>
          <DatePicker
            is24Hour
            style={{ width: '100%' }}
            mode="datetime"
            format="hh:mm A, DD-MM-YYYY"
            placeholder="Chạm để chọn thời gian"
            onDateChange={(end_time) => {
              this.setState({ end_time });
            }}
            iconComponent={
              <Input
                errorStyle={cStyles.errorStyle}
                errorMessage={errorMessage.end_time}
                placeholder="Chạm để chọn thời gian"
                disabled
                defaultValue={end_time}
                leftIcon={<Icon name="calendar" size={iconSize} color={iconColor} />}
              />
            }
            customStyles={{
              dateInput: {
                display: 'none',
              },
            }}
          />
          <Text style={cStyles.errorStyle}>{errorMessage.start_time}</Text>
          <Input
            style={{ width: '100%' }}
            label="Nhập mật khẩu của bạn"
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
              onPress={this.reset}
            />
            <Button
              loading={this.state.smallLoading}
              containerStyle={{ width: '50%' }}
              titleStyle={cStyles.btnText}
              buttonStyle={{ alignSelf: 'center', width: '80%', borderRadius: 20 }}
              title="Cập nhật"
              onPress={this.update}
            />
          </View>
        </View>
      </Overlay>
    );
  };
  renderSetting = () => {
    return (
      <Overlay overlayStyle={{ width: '90%' }} isVisible={this.state.edit} onBackdropPress={() => this.setState({ edit: false })}>
        <View>
          {!this.state.isClosed ? (
            <ListItem
              bottomDivider
              chevron
              title={'Đóng phòng'}
              onPress={() => {
                this.setState({ showConfrimPass: true, forgotPass: false, edit: false });
              }}
            />
          ) : null}
          <ListItem chevron bottomDivider title={'Chỉnh sửa thông tin'} onPress={() => this.setState({ showForm: true, edit: false })} />
          <ListItem
            chevron
            title={'Cập nhật mật khẩu phòng'}
            onPress={() => {
              this.setState({ forgotPass: true, showConfrimPass: true, edit: false });
            }}
          />
        </View>
      </Overlay>
    );
  };
  render() {
    let { start_time, end_time, title, isClosed = false, showForm = false, listStudent = [], mode = MODES.ALL, selectedIndex = 0, loading = true } = this.state;
    let buttons = list.map((el, i) => ({
      element: () => (
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Text style={{ color: i == selectedIndex ? 'brown' : 'black' }}>{el.text}</Text>
        </View>
      ),
    }));
    const all = listStudent.length,
      checkin = listStudent.filter((e) => e.isCheckin).length,
      notchecking = listStudent.filter((e) => !e.isCheckin).length;
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
    const { currentClass = {} } = this.props;
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column' }}>
        {showForm ? this.renderPopupEdit() : null}
        {this.state.showConfrimPass ? this.renderPopupPassword() : null}
        {this.state.edit ? this.renderSetting() : null}
        <Card
          containerStyle={{ margin: 0 }}
          title={
            <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10 }}>
              <View style={{ alignItems: 'center', width: '100%' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                  <Text>{'Thông tin lớp học'} </Text>
                  <MaterialCommunityIcons name={'settings'} onPress={() => this.setState({ edit: true })} color={'green'} size={25} />
                </Text>
              </View>
            </View>
          }
        >
          <Text style={{ fontSize: 15 }}>
            Môn học:
            <Text style={styles.value}>{` ${currentClass.code_subject} - ${currentClass.name_subject}`}</Text>
          </Text>
          <Text style={{ fontSize: 15 }}>
            Phòng:
            <Text style={styles.value}>{` ${currentClass.code_class} - ${title}`}</Text>
          </Text>
          <Text style={{ fontSize: 15 }}>Thời gian cho phép điểm danh:</Text>
          <Text style={styles.value}>
            {start_time} <Text style={{ color: 'black' }}> đến </Text> {end_time}
          </Text>
        </Card>

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
                    <Text style={{ color: 'green' }}>{`${mode} - ${listStudent.length} SV`} </Text>
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
                  leftAvatar={{ source: setAvatar(l.user.avatar_link || {}) }}
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
    currentClass: state.app.currentClass,
    userInfo: state.user.userInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
