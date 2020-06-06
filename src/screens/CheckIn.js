import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Alert, Image } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, CheckBox } from 'react-native-elements';
import ImageInput from '../components/ImageInput';
import cStyles from '../constants/common-styles';
import { AXIOS } from '../utils/functions';
import { list_screen_map } from '../constants/constants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
const styles = StyleSheet.create({});

type Props = {};
class Home extends Component<Props> {
  state = {};
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  checkin = () => {
    this.showConfirm();
  };
  showConfirm = () => {
    Alert.alert(
      '',
      `Phát hiện 3 người:
      - Nguyễn Văn A - 1610391
      - Nguyễn Văn A - 1610391
      - Nguyễn Văn A - 1610391`,
      [
        {
          text: 'Chụp lại',
        },
        { text: 'Điểm danh', onPress: this.saveSession },
      ],
      { cancelable: false }
    );
    const { currentRoom = {}, currentClass } = this.props;
  };
  showAlert = (msg, success = false) => {
    Alert.alert('Thông báo', msg, [
      {
        text: 'Đã hiểu',
        onPress: () => {
          this.setState({ success });
        },
      },
    ]);
  };
  saveSession = () => {
    const { currentRoom = {} } = this.props;
    const session = {
      room_id: currentRoom.id,
      secret_of_room: currentRoom.secret || 123456,
      location: {
        longtitude: 20.0,
        lattitude: 20.0,
      },
    };
    AXIOS('/sessions/authorize', 'POST', session, {}, this.props.userInfo.token)
      .then(({ data }) => {
        console.log(123456, data);
        this.showAlert('Điểm danh thành công', true);
      })
      .catch((err) => {
        console.log('123456', 2, err.response.data);
        this.showAlert('Điểm danh thất bại');
      });
  };
  setImage = (image) => {
    this.setState({ image });
  };
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { currentClass = {} } = this.props;
    const { message = '', valid = 1, image = {}, success = false } = this.state;
    console.log(123456, 'currentClass');
    if (success)
      return (
        <View>
          <View style={{ backgroundColor: 'white', padding: 20, height: '100%' }}>
            <Image style={{ width: 100, height: 100, alignSelf: 'center' }} source={require('../../img/success.png')} />
            <Text style={{ fontSize: 20, color: 'green', alignSelf: 'center', marginBottom: 10, fontWeight: 'bold' }}>Điểm danh thành công:</Text>
            <Text style={{ fontSize: 20, color: 'black' }}>Môn học: </Text>
            <Text style={{ fontSize: 20, color: 'brown', alignSelf: 'center', fontWeight: 'bold' }}>{currentClass.name_subject} - 20/12/2020</Text>
            <Text style={{ fontSize: 20, color: 'black' }}>Sinh viên:</Text>
            <Text style={{ fontSize: 20, color: 'blue', alignSelf: 'center', fontWeight: 'bold' }}>- Nguyễn Hoài Danh - 1610391</Text>
            <Text style={{ fontSize: 20, color: 'blue', alignSelf: 'center', fontWeight: 'bold' }}>- Nguyễn Hoài Danh - 1610391</Text>
            <Text style={{ fontSize: 20, color: 'blue', alignSelf: 'center', fontWeight: 'bold' }}>- Nguyễn Hoài Danh - 1610391</Text>
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
      <View>
        <ImageInput showAccessory={false} backgroundColor="white" image={image} camera={true} callback={this.setImage} />
        <Button containerStyle={cStyles.btnwrap} titleStyle={cStyles.btnText} buttonStyle={cStyles.btn} title="Điểm danh" onPress={this.checkin} />
        <View>
          <Text>{message}</Text>
        </View>
      </View>
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
