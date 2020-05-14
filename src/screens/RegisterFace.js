import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card, Button, CheckBox, Avatar } from 'react-native-elements';
import ImageInput from '../components/ImageInput';
import cStyles from '../constants/common-styles';
const styles = StyleSheet.create({});
const iconSize = 24;
const iconColor = 'black';
type Props = {};
export default class Home extends Component<Props> {
  state = {};
  componentDidMount() {
    let list = [];
    for (let i = 0; i < 10; i++) {
      list.push({ index: i, image: {} });
    }
    this.setState({ list });
  }
  register = () => {
    this.setState({ loading: true });
    console.log('ok đang xử lý');
  };
  setImage = (image, index) => {
    let { list = [] } = this.state;
    list[index].image = image;
    this.setState({ list });
  };
  renderRow = (row, rowNum) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {row.map((el, idx) => (
          <ImageInput key={idx} image={el.image} picker={true} callback={(img) => this.setImage(img, rowNum * 2 + idx)} height={150} width="45%" />
        ))}
      </View>
    );
  };
  parseList = (list) => {
    //[1,2,3,4]=>[[1,2],[3,4]]
    let rs = [];
    for (let i = 0; i < list.length; i += 2) {
      rs.push(list[i + 1] ? [list[i], list[i + 1]] : [list[i]]);
    }
    return rs;
  };
  render() {
    let { errorMessage = {}, list = [], loading = false } = this.state;
    const rowHeight = 200;
    list = this.parseList(list);
    return (
      <View>
        <ScrollView contentContainerStyle={{ height: rowHeight * list.length }}>
          {list.map((row, idx) => (
            <View key={idx} style={{ flexDirection: 'column' }}>
              {this.renderRow(row, idx)}
            </View>
          ))}
          <Button loading={loading} containerStyle={cStyles.btnwrap} buttonStyle={cStyles.btn} title="Đăng kí gương mặt" onPress={this.register} />
        </ScrollView>
      </View>
    );
  }
}
