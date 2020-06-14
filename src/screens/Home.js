import React, { Component } from 'react';
import { ScrollView, Platform, StyleSheet, Text, View, BackHandler, Dimensions, TouchableOpacity } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Divider, Card, Avatar, Button, Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import { setAvatar, shadow } from '../utils/functions';
import { list_screen_map, ROLES, imgBku, imgCheckin, imgDefaultAva, imgFace, imgHistory, imgRoom, imgTeacher } from '../constants/constants';
import cStyles from '../constants/common-styles';
import AsyncStorage from '@react-native-community/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    margin: 10,
    color: 'white',
  },
  ava: { flexDirection: 'row', width: '100%' },
});
const list = [
  { showRole: [ROLES.student], name: 'listRoom', to: '/list-room', text: 'Điểm danh', image: imgCheckin },
  { showRole: [ROLES.student, ROLES.teacher], name: 'listRoom', to: '/list-room', text: 'Phòng học', image: imgRoom },
  { showRole: [ROLES.student], name: 'registerFace', to: '/register-face', text: 'Gương mặt', image: imgFace },
  { showRole: [ROLES.student], name: 'history', to: '/history', text: 'Lịch sử', image: imgHistory },
  { showRole: [ROLES.teacher], text: 'Giáo viên', image: imgTeacher },
  { showRole: [ROLES.student, ROLES.teacher], name: 'account', to: '/account', text: 'Tài khoản', image: imgDefaultAva },
];
type Props = {};
class Home extends Component<Props> {
  state = {};
  navigate = (url, creent = null) => {
    if (!url) return;
    this.props.history.push(url);
    creent && this.props.appActions.setCurScreent({ currentScreent: creent });
  };
  componentWillReceiveProps(props) {
    this.setState({ loggedIn: props.loggedIn, userInfo: props.userInfo });
  }
  componentDidMount() {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.props.history.location.pathname == '/') return false;
      this.props.history.goBack();
      this.props.appActions.goBack({});
      return true;
    });
  }
  componentWillMount() {
    (async () => {
      try {
        let userInfo = await AsyncStorage.getItem('@userInfo');
        console.log(123456, userInfo);
        userInfo = userInfo ? JSON.parse(userInfo) : null;
        if (userInfo && Object.keys(userInfo).length != 0) {
          this.props.appActions.setUserInfo({ userInfo });
        }
        setTimeout(() => {
          this.setState({ loading: false });
        }, 500);
      } catch (e) {
        setTimeout(() => {
          this.setState({ loading: false });
        }, 500);
      }
    })();
  }
  componentWillUnmount() {
    global.loaded = true;
  }
  render() {
    let { loggedIn = false, userInfo = {} } = this.props;
    const { image = {}, mssv = '1610391', username = 'Nguyễn Hoài Danh', avatar_link } = userInfo;
    const avaSource = setAvatar(avatar_link || image);
    const { loading = !global.loaded } = this.state;
    const screenWidth = Math.round(Dimensions.get('window').width);
    const padding = 5;
    const numperrow = 3;
    const width = screenWidth / numperrow - numperrow * padding;
    // console.log(123456, 'home', userInfo.avatar_link);
    //AsyncStorage.removeItem('@userInfo');
    if (loading)
      return (
        <View style={styles.container}>
          {imgBku}
          <Text style={styles.welcome}>{`Ứng dụng điểm danh Bách Khoa`}</Text>
        </View>
      );
    if (!loggedIn)
      return (
        <View style={styles.container}>
          {imgBku}
          <Text style={styles.welcome}>{`Ứng dụng điểm danh Bách Khoa`}</Text>
          {/* <Button
            containerStyle={cStyles.btnwrap}
            titleStyle={cStyles.btnText}
            buttonStyle={cStyles.btn}
            title="Đăng kí"
            onPress={() => this.navigate('/register', list_screen_map.register)}
          /> */}
          <Button
            containerStyle={cStyles.btnwrap}
            titleStyle={cStyles.btnText}
            buttonStyle={cStyles.btn}
            title="Đăng nhập"
            onPress={() => this.navigate('/login', list_screen_map.login)}
          />
        </View>
      );
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.ava}>
          <View style={{ width: 100, padding: 10 }}>
            <Avatar onPress={this.showImageInput} rounded size="large" source={avaSource} />
          </View>
          <View style={{ padding: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>{username}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'white' }}>{mssv}</Text>
          </View>
        </View>

        <View>
          <Divider style={{ backgroundColor: 'white' }} />
          <Text style={{ fontStyle: 'italic', fontWeight: 'bold', paddingTop: 10, paddingLeft: 10, fontSize: 20, color: 'white' }}>Danh mục</Text>
        </View>
        <View style={{ flexDirection: 'row', padding, flexWrap: 'wrap', alignItems: 'center', alignContent: 'center' }}>
          {list.map((e, i) => {
            if (!e.showRole.includes(userInfo.role)) return null;
            const imageWidth = width - 40;
            return (
              <TouchableOpacity onPress={() => this.navigate(e.to, list_screen_map[e.name])}>
                <View key={i} style={{ ...shadow(), margin: 5, alignItems: 'center', backgroundColor: 'white', borderRadius: 10, height: width, width: width }}>
                  {/* <Avatar
                  onPress={() => this.navigate(e.to, list_screen_map[e.name])}
                  size="xlarge"
                  ImageComponent={() => e.image}
                  source={e.image}
                  containerStyle={{ marginTop: 10, alignSelf: 'center', width: imageWidth, height: imageWidth }}
                  avatarStyle={{ alignSelf: 'center', width: imageWidth, height: imageWidth }}
                /> */}
                  {e.image}
                  <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>{e.text}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ height: 65 }} />
      </ScrollView>
    );
  }
}
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    userInfo: state.user.userInfo,
    loggedIn: state.user.loggedIn,
    app: state.app,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
