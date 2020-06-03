import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ButtonGroup, Card, Button, CheckBox, Avatar } from 'react-native-elements';
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
      <ButtonGroup
        key={rowNum}
        buttons={row.map((el, idx) => ({
          element: () => <ImageInput key={idx} image={el.image} picker={true} callback={(img) => this.setImage(img, rowNum * 2 + idx)} height={'100%'} />,
        }))}
        buttonStyle={{ marginLeft: 15, marginRight: 15 }}
        containerStyle={{ height: 200, marginBottom: 10, marginTop: 10 }}
      />
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <Text style={{ paddingLeft: 10, paddingRight: 10, marginBottom: 10, marginTop: 10, alignSelf: 'center', fontSize: 25, color: 'white' }}>
            Chọn ít nhất 10 ảnh khác nhau có mặt của bạn để đăng ký gương mặt trên hệ thống
          </Text>
        </View>
        {list.map((row, idx) => this.renderRow(row, idx))}
        <Button
          loading={loading}
          containerStyle={cStyles.btnwrap}
          titleStyle={cStyles.btnText}
          buttonStyle={cStyles.btn}
          title={loading ? 'Đang xử lý' : 'Đăng kí gương mặt'}
          onPress={this.register}
        />
        <View style={{ height: 65 }} />
      </ScrollView>
    );
  }
}
