import React, { Component } from 'react';
import { NativeRouter, Route, Link } from 'react-router-native';
import { View } from 'react-native';
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import Footer from './components/Footer';
import Header from './components/Header';
export default class App extends Component<Props> {
  render() {
    return (
      <NativeRouter>
        <Header />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/" component={Register} />
        <Footer />
      </NativeRouter>
    );
  }
}
