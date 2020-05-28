import React, { Component } from 'react';
import { NativeRouter, Route, Link } from 'react-router-native';
import { View, ImageBackground } from 'react-native';
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import RegisterFace from './screens/RegisterFace';
import ListRoom from './screens/ListRoom';
import CreateRoom from './screens/CreateRoom';
import CheckIn from './screens/CheckIn';
import History from './screens/History';
import Account from './screens/Account';
import Footer from './components/Footer';
import Header from './components/Header';
import { Provider, connect } from 'react-redux';
import appReducer from './reducers/index';
import { createStore, bindActionCreators } from 'redux';
import * as appActions from './actions/index';
import AsyncStorage from '@react-native-community/async-storage';

type Props = {};
class App extends Component<Props> {
  state = { loading: true };
  componentWillMount() {
    (async (value) => {
      try {
        let userInfo = await AsyncStorage.getItem('@userInfo');
        console.log(123456, 'old', userInfo);
        userInfo = userInfo ? JSON.parse(userInfo) : null;
        if (userInfo && Object.keys(userInfo).length != 0) this.props.appActions.setUserInfo({ userInfo });
      } catch (e) {
        console.log(123456, e);
      }
    })();
  }
  render() {
    return (
      <ImageBackground
        source={{
          uri: 'https://www.desktopbackground.org/download/720x1280/2011/02/01/150988_church-hill-middle-school-blue-abstract-backgrounds_2543x1553_h.jpg',
        }}
        style={{ flex: 1 }}
      >
        <NativeRouter>
          {true ? <Header /> : null}
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/register-face" component={RegisterFace} />
          <Route exact path="/list-room" component={ListRoom} />
          <Route exact path="/create-room" component={CreateRoom} />
          <Route exact path="/check-in" component={CheckIn} />
          <Route exact path="/history" component={History} />
          <Route exact path="/account" component={Account} />
          <Footer />
        </NativeRouter>
      </ImageBackground>
    );
  }
}
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    loggedIn: state.user.loggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
