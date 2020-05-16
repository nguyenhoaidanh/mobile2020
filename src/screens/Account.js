import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Avatar, Divider, Card, ListItem } from 'react-native-elements';
import cStyles from '../constants/common-styles';
import ImageInput from '../components/ImageInput';
import { showImageInput } from '../utils/functions';
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  hr: { backgroundColor: 'blue' },
  ava: {
    backgroundColor: '#1885f9',
    height: 220,
    alignItems: 'center',
    paddingTop: 15,
  },
  start: { alignItems: 'flex-start', width: '30%' },
  end: { alignItems: 'flex-end', width: '70%' },
  textLeft: { fontSize: 20, color: 'grey' },
  textRight: { fontSize: 20, color: 'grey', fontWeight: 'bold' },
});

type Props = {};
export default class Home extends Component<Props> {
  state = {};
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  setImage = (image) => {
    this.setState({ image });
  };
  showImageInput = () => {
    showImageInput({ picker: true, callback: this.setImage });
  };
  update = () => {
    console.log('update');
  };
  renderItem = (key, value) => {
    const mapKey = { username: 'Tên', email: 'Địa chỉ email', male: 'Giới tính', birthday: 'Ngày sinh', faculty: 'Khoa' };
    const mapIcon = { username: 'user', male: 'male', faculty: 'graduation-cap', email: 'envelope-o', birthday: 'calendar' };
    return (
      <ListItem
        key={key}
        chevron
        bottomDivider
        leftIcon={<Icon name={mapIcon[key]} size={18} color={'black'} />}
        title={
          <View style={styles.row}>
            <View style={styles.start}>
              <Text>{mapKey[key]}</Text>
            </View>
            <View style={styles.end}>
              <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{value}</Text>
            </View>
          </View>
        }
        bottomDivider
      />
    );
  };
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { errorMessage = {}, edit = false, image = {} } = this.state;
    const userInfo = { username: 'Nguyễn Hoài Danh', male: 'male', birthday: '03/02/1998', faculty: 'KH & KT Máy tính', email: '1610391@hcmut.edu.vn' };
    const { username = '', mssv = '' } = userInfo;
    const infos = [];
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column' }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.ava}>
            <View>
              <Avatar
                onPress={this.showImageInput}
                onAccessoryPress={this.showImageInput}
                rounded
                size="xlarge"
                source={{
                  uri: image.path ? image.path : 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                }}
                showAccessory
                accessory={{
                  name: image.path ? 'mode-edit' : 'plus-circle',
                  type: image.path ? 'material' : 'font-awesome',
                  color: 'white',
                  underlayColor: 'gray',
                  size: 30,
                }}
              />
            </View>
            <Text style={{ fontSize: 30, color: 'white' }}>{username}</Text>
          </View>

          <Card
            title={
              <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10 }}>
                <View style={{ alignItems: 'center', width: '100%' }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                    <Text>{'Thông tin cá nhân' + '   '} </Text>
                    <Icon style={{ paddingLeft: 20, marginLeft: 10 }} name="edit" onPress={() => this.setState({ edit: !edit })} size={20} color={iconColor} />
                  </Text>
                </View>
              </View>
            }
            containerStyle={{ padding: 0, backgroundColor: 'lightblue' }}
          >
            {edit ? (
              <View>
                <Input
                  label="Họ và tên (Sử dụng tên thật để điểm danh)"
                  errorStyle={cStyles.errorStyle}
                  errorMessage={errorMessage.username}
                  placeholder="Vd: Nguyễn Văn A"
                  leftIcon={<Icon name="user" size={iconSize} color={iconColor} />}
                  onChangeText={(value) => this.onchange('username', value)}
                />
                <Button containerStyle={cStyles.btnwrap} titleStyle={cStyles.btnText} buttonStyle={cStyles.btn} title="Lưu" onPress={this.update} />
              </View>
            ) : (
              <View>{Object.keys(userInfo).map((key, i) => this.renderItem(key, userInfo[key]))}</View>
            )}
          </Card>
          <View style={{ height: 65 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
