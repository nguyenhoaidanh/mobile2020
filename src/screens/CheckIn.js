import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Alert } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, CheckBox } from 'react-native-elements';
import ImageInput from '../components/ImageInput';
import cStyles from '../constants/common-styles';
import { AXIOS } from '../utils/functions';
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
  showConfirm = () =>
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
        this.setState({ success: true, message: 'Điểm danh thành công' });
      })
      .catch((err) => {
        console.log('123456', 2, err.response.data);
        this.setMessage('Điểm danh thất bại');
      });
  };
  setMessage = (message) => {
    this.setState({ message });
    setTimeout(() => {
      this.setState({ message: '' });
    }, 3000);
  };
  setImage = (image) => {
    this.setState({ image });
  };
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { message = '', valid = 1, image = {}, success = false } = this.state;
    if (success)
      return (
        <View>
          <ImageInput showAccessory={false} backgroundColor="white" image={image} camera={true} callback={this.setImage} />
          <View>
            <Text style={{ alignSelf: 'center', fontSize: 20, color: 'green' }}>{message}</Text>
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
    userInfo: state.user.userInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
