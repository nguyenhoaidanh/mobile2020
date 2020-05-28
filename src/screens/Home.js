import React, { Component } from 'react';
import { ScrollView, Platform, StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Divider, Card, Avatar, Button, Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import { setAvatar } from '../utils/functions';
import { list_screen_map } from '../constants/constants';
import cStyles from '../constants/common-styles';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
  ava: { flexDirection: 'row', width: '100%' },
});
const list = [
  { name: 'listRoom', to: '/list-room', text: 'Điểm danh', image: require('../../img/checkin.png') },
  { name: 'listRoom', to: '/list-room', text: 'Phòng học', image: require('../../img/room.png') },
  { name: 'registerFace', to: '/register-face', text: 'Gương mặt', image: require('../../img/face.png') },
  { name: 'history', to: '/history', text: 'Lịch sử', image: require('../../img/history.png') },
  { text: 'Giáo viên', image: require('../../img/teacher.png') },
  { name: 'account', to: '/account', text: 'Tài khoản', image: require('../../img/default-avatar.png') },
];
type Props = {};
class Home extends Component<Props> {
  state = {};
  navigate = (url, creent = null) => {
    if (!url) return;
    this.props.history.push(url);
    console.log(123456, creent);

    creent && this.props.appActions.setCurScreent({ currentScreent: creent });
  };
  componentWillReceiveProps(props) {
    this.setState({ loggedIn: props.loggedIn });
  }
  render() {
    let { loggedIn = false } = this.props;
    const { image = {}, mssv = '1610391', username = 'Nguyễn Hoài Danh' } = this.state;
    console.log(123456, 'loggedIn', loggedIn);
    if (!loggedIn)
      return (
        <View style={styles.container}>
          <Image source={require('../../img/bku.png')} style={{ width: 200, height: 200 }} />
          <Text style={styles.welcome}>Bach khoa Attendance Application</Text>
          <Button
            containerStyle={cStyles.btnwrap}
            titleStyle={cStyles.btnText}
            buttonStyle={cStyles.btn}
            title="Đăng kí"
            onPress={() => this.navigate('/register', list_screen_map.register)}
          />
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
            <Avatar onPress={this.showImageInput} rounded size="large" source={setAvatar(image)} />
          </View>
          <View style={{ padding: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>{username}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'white' }}>{mssv}</Text>
          </View>
        </View>

        <View>
          <Divider style={{ backgroundColor: 'white' }} />
          <Text style={{ fontStyle: 'italic', paddingTop: 10, paddingLeft: 10, fontSize: 20, color: 'white' }}>Danh mục</Text>
        </View>
        <View style={{ flexDirection: 'row', padding: 5, flexWrap: 'wrap', alignItems: 'center', alignContent: 'center' }}>
          {list.map((e, i) => (
            <View key={i} style={{ margin: 5, alignItems: 'center', backgroundColor: 'white', borderRadius: 10, height: 120, width: 120 }}>
              <Avatar
                onPress={() => this.navigate(e.to, list_screen_map[e.name])}
                size="xlarge"
                source={e.image}
                containerStyle={{ marginTop: 10, alignSelf: 'center', width: 80, height: 80 }}
                avatarStyle={{ alignSelf: 'center', width: 80, height: 80 }}
              />
              <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}>{e.text}</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 65 }} />
      </ScrollView>
    );
  }
}
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    app: state.app,
    loggedIn: state.user.loggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
