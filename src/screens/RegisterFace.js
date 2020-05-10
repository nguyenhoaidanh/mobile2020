import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageInput from '../components/ImageInput';
import { Card, Button, CheckBox, Avatar } from 'react-native-elements';
const styles = StyleSheet.create({
  errorStyle: { color: 'red' },
  card: { width: '45%', height: 150, backgroundColor: 'gray' },
  img: { width: '100%', height: '100%' },
  wrapAvatar: { width: '100%', height: '100%' },
});
const iconSize = 24;
const iconColor = 'black';
type Props = {};
export default class Home extends Component<Props> {
  state = {};
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  register = () => {};
  renderRow = (row) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {row.map((el, idx) => (
          <Card containerStyle={styles.card} key={idx}>
            <Avatar
              avatarStyle={styles.img}
              containerStyle={styles.wrapAvatar}
              source={{
                uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
              }}
              showAccessory
              accessory={{ name: 'plus-circle', type: 'font-awesome', color: 'blue', underlayColor: '#000', size: 30 }}
            />
          </Card>
        ))}
      </View>
    );
  };
  render() {
    const { errorMessage = {} } = this.state;
    const list = [
      [1, 2],
      [3, 3],
      [3, 3],
      [3, 3],
      [3, 3],
    ];
    const rowHeight = 200;
    return (
      <View>
        <ImageInput />
        <ScrollView contentContainerStyle={{ height: rowHeight * list.length }}>
          {list.map((row, idx) => (
            <View key={idx} style={{ flexDirection: 'column' }}>
              {this.renderRow(row)}
            </View>
          ))}
          <Button loading style={styles.login} title="Đăng kí gương mặt" onPress={this.register} />
        </ScrollView>
      </View>
    );
  }
}
