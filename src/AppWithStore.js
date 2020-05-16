import { AppRegistry } from 'react-native';
import App from './App';
import { Provider } from 'react-redux';
import appReducer from './reducers/index';
import { createStore } from 'redux';
import React, { Component } from 'react';
class AppWithStore extends Component<Props> {
  render() {
    const store = createStore(appReducer);
    console.log(111);
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
export default AppWithStore;
