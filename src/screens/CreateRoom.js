import React, { Component } from 'react';
import { TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, StyleSheet, Text, View } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, CheckBox } from 'react-native-elements';
import cStyles from '../constants/common-styles';
import { AXIOS } from '../utils/functions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
const styles = StyleSheet.create({});
type Props = {};
class CreateRoom extends Component<Props> {
  state = {};
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  makeRoom = () => {
    let room = {
      class_id: '5ed509551c4fa731b41345f4',
      secret: '123456',
      secret_create_room: '123',
      location: {
        longtitude: 20.0,
        latitude: 20.0,
      },
    };
    AXIOS('/rooms', 'POST', room, {}, this.props.userInfo.token)
      .then(({ data }) => {
        console.log('123456', 1, data);
        // this.props.history.push('/login');
        //this.props.appActions.setCurScreent({ currentScreent: list_screen_map.login });
      })
      .catch((err) => console.log('123456', 2, err.response.data));
  };
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { date = '2016-05-15', errorMessage = {}, password = '', repPassword = '', name = '', number = 1 } = this.state;
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column' }}>
        <ScrollView style={cStyles.scroll}>
          <Input
            label="Tên phòng"
            errorStyle={cStyles.errorStyle}
            errorMessage={errorMessage.name}
            placeholder="Cơ sở dữ liệu - 11/2/2020"
            leftIcon={<Icon name="star" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('name', name)}
          />
          <Input
            label="Số lượng thành viên mỗi nhóm"
            errorStyle={cStyles.errorStyle}
            errorMessage={errorMessage.number}
            maxLength={10}
            keyboardType="numeric"
            defaultValue={'1'}
            leftIcon={<Icon name="group" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('number', number)}
          />

          <Input
            label="Mật khẩu"
            errorStyle={cStyles.errorStyle}
            errorMessage={errorMessage.password}
            placeholder="Password"
            leftIcon={<Icon name="key" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('password', value)}
            secureTextEntry={true}
          />
          <Input
            label="Nhập lại Mật khẩu"
            errorStyle={cStyles.errorStyle}
            errorMessage={errorMessage.repPassword}
            placeholder="Password"
            leftIcon={<Icon name="key" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('repPassword', value)}
            secureTextEntry={true}
          />
          <Text style={cStyles.label}>Thời gian bắt đầu </Text>
          <DatePicker
            style={{ width: '100%' }}
            mode="datetime"
            format="hh:mm DD-MM-YYYY"
            placeholder="Thời gian bắt đầu"
            onDateChange={(startTime) => {
              this.setState({ startTime });
            }}
            iconComponent={
              <Input
                errorStyle={cStyles.errorStyle}
                errorMessage={errorMessage.startTime}
                placeholder="Thời gian bắt đầu"
                disabled
                defaultValue={this.state.startTime}
                leftIcon={<Icon name="calendar" size={iconSize} color={iconColor} />}
              />
            }
            customStyles={{
              dateInput: {
                display: 'none',
              },
            }}
          />
          <Text style={cStyles.label}> Thời gian kết thúc</Text>
          <DatePicker
            style={{ width: '100%' }}
            mode="datetime"
            format="hh:mm DD-MM-YYYY"
            placeholder="Thời gian kết thúc"
            onDateChange={(endTime) => {
              this.setState({ endTime });
            }}
            iconComponent={
              <Input
                errorStyle={cStyles.errorStyle}
                errorMessage={errorMessage.endTime}
                placeholder="Thời gian bắt đầu"
                disabled
                defaultValue={this.state.endTime}
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
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateRoom));
