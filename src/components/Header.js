import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withRouter } from 'react-router';
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type Props = {};
class Home extends Component<Props> {
  navigate = (url) => {
    this.props.history.push(url);
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>Header</Text>
      </View>
    );
  }
}
export default withRouter(Home);
