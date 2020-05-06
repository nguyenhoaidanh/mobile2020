import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button, ButtonGroup } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withRouter } from 'react-router';
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
});

type Props = {};
class Home extends Component<Props> {
  state = {};
  navigate = (url) => {
    this.props.history.push(url);
  };
  updateIndex = (selectedIndex) => {
    this.setState({ selectedIndex });
  };
  render() {
    const { selectedIndex = 0 } = this.state;
    list = [
      { icon: '', text: 'Hello' },
      { icon: '', text: 'Hello' },
      { icon: '', text: 'Hello' },
      { icon: '', text: 'Hello' },
      { icon: '', text: 'Hello' },
    ];
    const buttons = list.map((el) => ({ element: () => <Text>Hello</Text> }));
    return (
      <View style={styles.container}>
        <ButtonGroup onPress={this.updateIndex} selectedIndex={selectedIndex} buttons={buttons} />
      </View>
    );
  }
}
export default withRouter(Home);
