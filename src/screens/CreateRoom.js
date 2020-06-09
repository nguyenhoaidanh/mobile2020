import React, { Component } from 'react';
import { TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, StyleSheet, Text, View, Image } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, CheckBox, Overlay } from 'react-native-elements';
import cStyles from '../constants/common-styles';
import { AXIOS, checkTokenExpire, formatTime, changeTime } from '../utils/functions';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { WheelPicker, TimePicker } from 'react-native-wheel-picker-android';
import * as appActions from '../actions/index';
import dayjs from 'dayjs';
const styles = StyleSheet.create({});
const dataList = [];
for (let index = 1; index < 20; index++) {
  dataList.push(index + '');
}
type Props = {};
class CreateRoom extends Component<Props> {
  state = {};
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  onItemSelected = (selectedItem) => {
    this.setState({ selectedItem });
  };
  makeRoom = () => {
    const { currentClass = {} } = this.props;
    let { start_time, end_time, title, password, repPassword, secret_create_room, number } = this.state;
    let valid = true;
    console.log(123456, this.state);
    if (!title) return this.setState({ errorMessage: { title: 'Trường ngày là bắt buộc' } });
    if (!secret_create_room) return this.setState({ errorMessage: { secret_create_room: 'Trường ngày là bắt buộc' } });
    if (!password) return this.setState({ errorMessage: { password: 'Trường ngày là bắt buộc' } });
    if (!repPassword) return this.setState({ errorMessage: { repPassword: 'Trường ngày là bắt buộc' } });
    if (!start_time) return this.setState({ errorMessage: { start_time: 'Trường ngày là bắt buộc' } });
    if (!end_time) return this.setState({ errorMessage: { end_time: 'Trường ngày là bắt buộc' } });
    start_time = changeTime(start_time);
    end_time = changeTime(end_time);
    if (password != repPassword) return this.setState({ errorMessage: { password: 'Hai password không khớp' } });
    if (Date.now() > end_time) return this.setState({ errorMessage: { end_time: 'Thời gian không hợp lệ' } });
    if (Date.now() > start_time) return this.setState({ errorMessage: { start_time: 'Thời gian không hợp lệ' } });
    if (start_time > end_time) return this.setState({ errorMessage: { start_time: 'Thời gian không hợp lệ' } });

    let room = {
      class_id: currentClass.id,
      secret: password,
      title,
      number,
      secret_create_room,
      location: {
        longtitude: 20.0,
        latitude: 20.0,
      },
      start_time: new Date(start_time),
      end_time: new Date(end_time),
    };
    AXIOS('/rooms', 'POST', room, {}, this.props.userInfo.token)
      .then(({ data }) => {
        console.log('123456', 1, data);
        this.setState({ respData: data.result, success: true });
      })
      .catch((err) => checkTokenExpire(err, this));
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
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const {
      respData = {},
      selectedItem = 1,
      success = false,
      date = '2016-05-15',
      errorMessage = {},
      password = '',
      repPassword = '',
      secret_create_room = '',
      name = '',
      number = '1',
    } = this.state;
    const { currentClass = {} } = this.props;
    console.log(123456, errorMessage);
    if (success)
      return (
        <View>
          <View style={{ backgroundColor: 'white', padding: 20, height: '100%' }}>
            <Image style={{ width: 100, height: 100, alignSelf: 'center' }} source={require('../../img/success.png')} />
            <Text style={{ fontSize: 20, color: 'green', alignSelf: 'center', marginBottom: 10, fontWeight: 'bold' }}>Tạo phòng thành công:</Text>
            <Text style={{ fontSize: 20, color: 'black' }}>Môn học: </Text>
            <Text
              style={{ fontSize: 20, color: 'brown', alignSelf: 'center', fontWeight: 'bold' }}
            >{`${currentClass.code_subject} - ${currentClass.name_subject}`}</Text>
            <Text style={{ fontSize: 20, color: 'black' }}>Tên phòng: </Text>
            <Text style={{ fontSize: 20, color: 'brown', alignSelf: 'center', fontWeight: 'bold' }}>{respData.title}</Text>
            <Text style={{ fontSize: 20, color: 'black' }}>Thời gian cho phép điểm danh:</Text>
            <Text style={{ fontSize: 20, color: 'blue', alignSelf: 'center', fontWeight: 'bold' }}>
              {formatTime(+respData.start_time)}
              <Text style={{ fontSize: 20, color: 'black' }}> đến </Text>
              {formatTime(+respData.end_time)}
            </Text>
            <Button
              containerStyle={cStyles.btnwrap}
              titleStyle={cStyles.btnText}
              buttonStyle={cStyles.btnPrimary}
              title="Về trang chủ"
              onPress={() => {
                this.props.history.push('/');
                this.props.appActions.setCurScreent({ currentScreent: list_screen_map.home });
              }}
            />
          </View>
        </View>
      );
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column' }}>
        <ScrollView style={cStyles.scroll}>
          <View>
            <Input
              label="Tên phòng"
              errorStyle={cStyles.errorStyle}
              errorMessage={errorMessage.title}
              placeholder="Vd: Cơ sở dữ liệu - 11/2/2020"
              leftIcon={<Icon name="star" size={iconSize} color={iconColor} />}
              onChangeText={(value) => this.onchange('title', value)}
            />
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
            {this.state.showPicker ? this.renderPicker() : null}
            <Input
              label="Mật khẩu tạo phòng"
              errorStyle={cStyles.errorStyle}
              errorMessage={errorMessage.secret_create_room}
              placeholder="Password"
              leftIcon={<Icon name="key" size={iconSize} color={iconColor} />}
              onChangeText={(value) => this.onchange('secret_create_room', value)}
              secureTextEntry={true}
            />
            <Input
              label="Mật khẩu phòng"
              errorStyle={cStyles.errorStyle}
              errorMessage={errorMessage.password}
              placeholder="Password"
              leftIcon={<Icon name="key" size={iconSize} color={iconColor} />}
              onChangeText={(value) => this.onchange('password', value)}
              secureTextEntry={true}
            />
            <Input
              label="Nhập lại Mật khẩu phòng"
              errorStyle={cStyles.errorStyle}
              errorMessage={errorMessage.repPassword}
              placeholder="Password"
              leftIcon={<Icon name="key" size={iconSize} color={iconColor} />}
              onChangeText={(value) => this.onchange('repPassword', value)}
              secureTextEntry={true}
            />
            <Text style={cStyles.label}>Thời gian bắt đầu điểm danh</Text>
            <DatePicker
              style={{ width: '100%' }}
              mode="datetime"
              format="hh:mm DD-MM-YYYY"
              placeholder="Chạm để chọn thời gian"
              onDateChange={(start_time) => {
                this.setState({ start_time });
              }}
              iconComponent={
                <Input
                  errorStyle={cStyles.errorStyle}
                  errorMessage={errorMessage.start_time}
                  placeholder="Chạm để chọn thời gian"
                  defaultValue={this.state.start_time}
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
            <Text style={cStyles.label}> Thời gian kết thúc điểm danh</Text>
            <DatePicker
              style={{ width: '100%' }}
              mode="datetime"
              format="hh:mm DD-MM-YYYY"
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
                  defaultValue={this.state.end_time}
                  leftIcon={<Icon name="calendar" size={iconSize} color={iconColor} />}
                />
              }
              customStyles={{
                dateInput: {
                  display: 'none',
                },
              }}
            />
            <Button containerStyle={cStyles.btnwrap} titleStyle={cStyles.btnText} buttonStyle={cStyles.btnPrimary} title="Tạo phòng" onPress={this.makeRoom} />
            <View style={{ height: 265 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    app: state.app,
    userInfo: state.user.userInfo,
    currentClass: state.app.currentClass,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateRoom));
