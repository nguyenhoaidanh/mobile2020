import React, { Component } from 'react';
import { NativeRouter, Route, Link } from 'react-router-native';
import Home from './screens/Home';
import Login from './screens/Login';
export default class App extends Component<Props> {
  render() {
    return (
      <NativeRouter>
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={Home} />
      </NativeRouter>
    );
  }
}
