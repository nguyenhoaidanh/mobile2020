import React, { Component } from 'react';
import { NativeRouter, Route, Link } from 'react-router-native';
import { View } from 'react-native';
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import ListRoom from './screens/ListRoom';
import Account from './screens/Account';
import Footer from './components/Footer';
import Header from './components/Header';
import { Provider } from 'react-redux';
import appReducer from './reducers/index';
import { createStore } from 'redux';
export default class App extends Component<Props> {
  render() {
    const store = createStore(appReducer);
    console.log('231', appReducer);
    if (1) return <Footer />;
    return (
      <Provider store={store}>
        <NativeRouter>
          <Header />
          <Route exact path="/" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/list-room" component={ListRoom} />
          <Route exact path="/account" component={Account} />
          <Footer />
        </NativeRouter>
      </Provider>
    );
  }
}
