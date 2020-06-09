import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input, Button, Card, Avatar, Divider } from 'react-native-elements';
import ImageInput from '../components/ImageInput';
import cStyles from '../constants/common-styles';
import { list_screen_map } from '../constants/constants';
import { AXIOS, uploadFileToServer } from '../utils/functions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import AsyncStorage from '@react-native-community/async-storage';
const styles = StyleSheet.create({
  login: {
    fontSize: 20,
    textAlign: 'center',
    color: 'red',
  },
});

type Props = {};
class Login extends Component<Props> {
  state = {};
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  login = () => {
    const { username, password, errorMessage = {}, image = {} } = this.state;
    if (image.path) {
      let msg;
      this.setState({ loading: true });
      uploadFileToServer([image], '', '/users/classify', 'POST')
        .then(({ data }) => {
          console.log('123456', 1, data);
          msg = 'Đăng nhập thành công';
          this.setState({ success: true });
        })
        .catch((err) => {
          msg = 'Đăng nhập thất bại';
          console.log(123456, err.toString());
          checkTokenExpire(err, this);
        })
        .finally(() => {
          this.setState({ loading: false });
          this.showAlert(msg);
        });
      return;
    }
    console.log('123456', 1, username, password);
    if (!username || !password) return;
    const user = { username, password };
    AXIOS('/users/authenticate', 'POST', user)
      .then(({ data }) => {
        console.log('123456', 1, data);
        this.props.history.push('/');
        this.props.appActions.setCurScreent({ currentScreent: list_screen_map.home });
        this.props.appActions.setUserInfo({ userInfo: data.object });
      })
      .catch((err) => {
        console.log('123456', 2, err.response.data);
        this.setState({ errorMessage: { password: 'Thông tin đăng nhập chưa đúng' } });
      });
  };
  setImage = (image) => {
    this.setState({ image });
  };
  showAlert = (msg) => {
    Alert.alert('Thông báo', msg, [
      {
        text: 'Đã hiểu',
      },
    ]);
  };
  toForgot = () => {
    this.props.history.push('/forgotpass');
    this.props.appActions.setCurScreent({ currentScreent: list_screen_map.forgotpass });
  };
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { errorMessage = {}, mode = 0, image = {}, loading = false } = this.state;
    if (!mode)
      return (
        <ScrollView style={cStyles.scroll}>
          <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 10 }}>
            <Input
              label="Số điện thoại hoặc Email"
              errorStyle={cStyles.errorStyle}
              errorMessage={errorMessage.username}
              leftIcon={<Icon name="user" size={iconSize} color={iconColor} />}
              onChangeText={(value) => this.onchange('username', value)}
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
            <Button containerStyle={cStyles.btnwrap} titleStyle={cStyles.btnText} buttonStyle={cStyles.btnPrimary} title="Đăng nhập" onPress={this.login} />
            {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: '100%', alignSelf: 'center' }}>
                <Text style={{ marginTop: 15, marginBottom: 10, fontSize: 15, alignSelf: 'center', color: 'grey' }}>Hoặc đăng nhập bằng</Text>
              </View>
            </View> */}
            {/* <Button
              containerStyle={cStyles.btnwrap}
              titleStyle={cStyles.btnText}
              buttonStyle={cStyles.btn}
              icon={<MaterialCommunityIcons style={{ marginRight: 10 }} name="face-recognition" size={iconSize} color={'white'} />}
              title="Gương mặt"
              onPress={() => this.setState({ mode: 1 }, this.openCamera)}
            /> */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: '100%', alignSelf: 'center' }}>
                <Text
                  onPress={this.toForgot}
                  style={{ marginTop: 15, marginBottom: 10, fontSize: 20, alignSelf: 'center', color: 'brown', fontStyle: 'italic', fontWeight: 'bold' }}
                >
                  Quên mật khẩu
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      );
    return (
      // face id
      <View>
        {/* <Text style={{ alignSelf: 'center', color: 'white', margin: 10, fontSize: 20 }}>Chạm để bật camera</Text> */}
        <ImageInput showAccessory={false} backgroundColor="white" image={image} picker={true} callback={this.setImage} />
        <Button
          loading={loading}
          containerStyle={cStyles.btnwrap}
          titleStyle={cStyles.btnText}
          buttonStyle={cStyles.btn}
          title="Đăng nhập"
          onPress={this.login}
        />
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
