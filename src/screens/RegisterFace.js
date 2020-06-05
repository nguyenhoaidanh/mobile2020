import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ButtonGroup, Card, Button, CheckBox, Avatar } from 'react-native-elements';
import ImageInput from '../components/ImageInput';
import cStyles from '../constants/common-styles';
import { AXIOS } from '../utils/functions';
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
  addImage = () => {
    const { list = [] } = this.state;
    const length = list.length;
    list.push({ index: length + 1, image: {} });
    list.push({ index: length + 2, image: {} });
    this.setState({ list });
  };
  register = () => {
    let { list = [] } = this.state;
    let count = 0;
    list = list.filter((e) => e.image.path);
    // if (list.length < 10) return this.showAlert('Hãy chọn ít nhất 10 ảnh bạn nhé');
    this.setState({ loading: true });
    let msg = '';
    AXIOS('/users/test', 'POST', list)
      .then(({ data }) => {
        console.log('123456', 1, data);
        msg = 'Đăng kí gương mặt thành công';
      })
      .catch((err) => {
        console.log('123456', 2, err.response.data);
        msg = 'Có lỗi xảy ra';
      })
      .finally(() => {
        this.setState({ loading: false });
        this.showAlert(msg);
      });
  };
  setImage = (image, index) => {
    let { list = [] } = this.state;
    list[index].image = image;
    this.setState({ list });
  };
  showAlert = (msg) => {
    Alert.alert('Thông báo', msg, [
      {
        text: 'Đã hiểu',
      },
    ]);
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
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Text style={{ paddingLeft: 10, paddingRight: 10, marginBottom: 10, marginTop: 10, alignSelf: 'center', fontSize: 25, color: 'white' }}>
            Chọn ít nhất 10 ảnh chân dung khác nhau có mặt của bạn
          </Text>
        </View>
        {list.map((row, idx) => this.renderRow(row, idx))}

        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: '50%', alignItems: 'center' }}>
            <Button
              containerStyle={{ width: '90%' }}
              titleStyle={cStyles.btnText}
              buttonStyle={{ borderRadius: 20, backgroundColor: '#55d646' }}
              title={'Thêm ảnh'}
              icon={<MaterialCommunityIcons style={{ marginRight: 10 }} name="plus-circle" size={iconSize} color={'white'} />}
              onPress={this.addImage}
            />
          </View>
          <View style={{ width: '50%', alignItems: 'center' }}>
            <Button
              containerStyle={{ width: '90%' }}
              loading={loading}
              titleStyle={cStyles.btnText}
              buttonStyle={{ borderRadius: 20, width: '90%', backgroundColor: '#55d646' }}
              title={loading ? 'Đang xử lý' : 'Đăng kí '}
              onPress={this.register}
              iconRight
              icon={<MaterialCommunityIcons style={{ marginLeft: 10 }} name="face-recognition" size={iconSize} color={'white'} />}
            />
          </View>
        </View>
        <View style={{ height: 65 }} />
      </ScrollView>
    );
  }
}
