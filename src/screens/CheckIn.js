import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Alert, Image } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, CheckBox } from 'react-native-elements';
import ImageInput from '../components/ImageInput';
import cStyles from '../constants/common-styles';
import { AXIOS, checkTokenExpire, shadow, uploadFileToServer, setAvatar } from '../utils/functions';

import { list_screen_map } from '../constants/constants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import config from '../constants/config';
const styles = StyleSheet.create({});

type Props = {};
class Home extends Component<Props> {
  state = {};
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  checkin = () => {
    const { image = {} } = this.state;
    if (!image.path) return;
    if (!image.path.includes('.jpg') && !image.path.includes('.jpeg')) return this.showAlert('Định dạng file không được hỗ trợ');
    console.log(123456, 'start upload');
    this.setState({ loading: true });
    uploadFileToServer([image], this.props.userInfo.token, '/users/classify')
      .then(({ data }) => {
        this.showConfirm(data.result);
      })
      .catch((err) => {
        checkTokenExpire(err, this);
        this.showAlert('Điểm danh thất bại');
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };
  showConfirm = (data) => {
    const { num_faces, out_image, predict } = data;
    const { currentRoom = {} } = this.props;
    let { number: number_required } = currentRoom;
    if (!number_required) number_required = 1;
    if (num_faces == 0) return this.showAlert('Không có gương mặt nào trong ảnh, chụp lại');
    if (num_faces < number_required) return this.showAlert(`Số người cho phép là ${number_required}, chụp lại`);
    console.log(123456, 'num_faces', num_faces, 'predict', predict.length);
    console.log(123456, currentRoom, predict.length, out_image);
    predict.forEach((element) => {
      console.log(123456, element.label.fullname, element.prob);
    });
    let canCheckin = false;
    this.setState({ image: out_image });
    let str = predict.map((e) => `- ${e.label.fullname} - ${e.label.mssv}`);
    str = str.length ? str.join('\n') : '';
    if (num_faces > predict.length) {
      if (predict.length != 0) {
        str += `\nVà ${num_faces - predict.length} người chưa xác định`;
      } else {
        str += `\nHệ thống chưa nhận diện được họ.`;
      }
    } else {
      canCheckin = true;
    }
    let arrbtn;
    if (!canCheckin) {
      arrbtn = [
        {
          text: 'Chụp lại',
          onPress: () => this.setState({ image: {} }),
        },
      ];
    } else
      arrbtn = [
        {
          text: 'Chụp lại',
          onPress: () => this.setState({ image: {} }),
        },
        { text: 'Điểm danh', onPress: () => this.saveSession(predict) },
      ];
    Alert.alert('', `Phát hiện ${num_faces} người:\n${str}`, arrbtn);
  };
  showAlert = (msg, success = false, btnText = 'Đã hiểu') => {
    Alert.alert('Thông báo', msg, [
      {
        text: btnText,
        onPress: () => {
          this.setState({ success });
        },
      },
    ]);
  };
  saveSession = (predict = []) => {
    const { currentRoom = {} } = this.props;
    this.setState({ predict });
    const { image = {} } = this.state;
    const sessions = {
      session: {
        room_id: currentRoom.id,
        link_face: image,
        secret_of_room: currentRoom.secret || 123456,
        location: {
          longtitude: 20.0,
          lattitude: 20.0,
        },
      },
      list_users: predict.map((e) => e.label.id),
    };
    console.log(123456, sessions);
    AXIOS('/sessions/authorize', 'POST', sessions, {}, this.props.userInfo.token)
      .then(({ data }) => {
        this.showAlert('Điểm danh thành công', true);
      })
      .catch((err) => {
        checkTokenExpire(err, this);
        this.showAlert('Có lỗi xảy ra');
      });
  };
  checkRespondImage = (data) => {
    if (true) {
      this.showAlert('Số người không đủ như quy định cần chụp ba người');
    } else this.showConfirm();
  };
  setImage = (image) => {
    this.setState({ image });
  };
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { currentClass = {} } = this.props;
    const { message = '', valid = 1, image = {}, success = false, loading = false } = this.state;
    if (success)
      return (
        <View>
          <View style={{ backgroundColor: 'white', padding: 20, height: '100%' }}>
            <Image style={{ width: 100, height: 100, alignSelf: 'center' }} source={require('../../img/success.png')} />
            <Text style={{ fontSize: 20, color: 'green', alignSelf: 'center', marginBottom: 10, fontWeight: 'bold' }}>Điểm danh thành công:</Text>
            <Text style={{ fontSize: 20, color: 'black' }}>Môn học: </Text>
            <Text style={{ fontSize: 20, color: 'brown', alignSelf: 'center', fontWeight: 'bold' }}>{currentClass.name_subject} - 20/12/2020</Text>
            <Text style={{ fontSize: 20, color: 'black' }}>Sinh viên:</Text>
            {predict.map((e, i) => (
              <Text style={{ fontSize: 20, color: 'blue', alignSelf: 'center', fontWeight: 'bold' }}>
                - {e.label.fullname} - {e.label.mssv}
              </Text>
            ))}
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
        <ImageInput showAccessory={false} backgroundColor="white" image={image} picker={true} callback={this.setImage} />
        <Button
          loading={loading}
          containerStyle={cStyles.btnwrap}
          titleStyle={cStyles.btnText}
          buttonStyle={cStyles.btn}
          title="Điểm danh"
          onPress={this.checkin}
        />
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
