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
    backgroundColor: 'gray',
    height: 300,
    alignItems: 'center',
    paddingTop: 50,
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
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { errorMessage = {}, edit = false, image = {} } = this.state;
    const userInfo = { username: 'Nguyễn Hoài Danh', mssv: 1616123, email: '12312312323' };
    const { username = '', mssv } = userInfo;
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column' }}>
        <ScrollView>
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
              />
            </View>
            <Text style={{ fontSize: 30 }}>{username}</Text>
          </View>

          <Card title="Thông tin cá nhân" containerStyle={{ padding: 0, backgroundColor: 'lightblue' }}>
            <Icon name="user" onPress={() => this.setState({ edit: !edit })} size={iconSize} color={iconColor} />
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
                <Button containerStyle={cStyles.btnwrap} buttonStyle={cStyles.btn} title="Lưu" onPress={this.update} />
              </View>
            ) : (
              <View>
                <View style={styles.row}>
                  <View style={styles.start}>
                    <Text style={styles.textLeft}>Mssv</Text>
                  </View>
                  <View style={styles.end}>
                    <Text style={styles.textRight}>{mssv}</Text>
                  </View>
                </View>
                <Divider style={styles.hr} />
                <View style={styles.row}>
                  <View style={styles.start}>
                    <Text>Mssv</Text>
                  </View>
                  <View style={styles.end}>
                    <Text>{mssv}</Text>
                  </View>
                </View>
              </View>
            )}
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
