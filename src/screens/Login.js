import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Link } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input, Button, Card, Avatar, Divider } from 'react-native-elements';
import ImageInput from '../components/ImageInput';
import cStyles from '../constants/common-styles';
const styles = StyleSheet.create({
  login: {
    fontSize: 20,
    textAlign: 'center',
    color: 'red',
  },
});

type Props = {};
export default class Home extends Component<Props> {
  state = {};
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  login = () => {
    const { username, password, errorMessage = {}, image = {} } = this.state;
    if (image.path) {
      console.log('ok login by face', user);
      return;
    }
    if (!username || !password) return;
    const user = { username, password };
    console.log('ok login', user);
  };
  setImage = (image) => {
    this.setState({ image });
  };
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { errorMessage = {}, mode = 0, image = {} } = this.state;
    if (!mode)
      return (
        <ScrollView style={cStyles.scroll}>
          <Input
            label="Số điện thoại hoặc email"
            errorStyle={cStyles.errorStyle}
            errorMessage={errorMessage.username}
            leftIcon={<Icon name="user" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('username', value)}
          />
          <Input
            label="Mật khẩu"
            errorStyle={cStyles.errorStyle}
            errorMessage={errorMessage.password}
            placeholder="Password"
            leftIcon={<Icon name="key" size={iconSize} color={iconColor} />}
            onChangeText={(value) => this.onchange('password', value)}
            secureTextEntry={true}
          />
          <Button containerStyle={cStyles.btnwrap} titleStyle={cStyles.btnText} buttonStyle={cStyles.btnPrimary} title="Đăng nhập" onPress={this.register} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: '100%', alignSelf: 'center' }}>
              <Text style={{ marginTop: 15, marginBottom: 10, fontSize: 20, alignSelf: 'center' }}>Hoặc đăng nhập bằng</Text>
            </View>
          </View>
          <Button
            containerStyle={cStyles.btnwrap}
            titleStyle={cStyles.btnText}
            buttonStyle={cStyles.btn}
            icon={<MaterialCommunityIcons style={{ marginRight: 10 }} name="face-recognition" size={iconSize} color={'white'} />}
            title="Face ID"
            onPress={() => this.setState({ mode: 1 }, this.openCamera)}
          />
        </ScrollView>
      );
    return (
      // face id
      <View>
        {/* <Text style={{ alignSelf: 'center', color: 'white', margin: 10, fontSize: 20 }}>Chạm để bật camera</Text> */}
        <ImageInput showAccessory={false} backgroundColor="white" image={image} camera={true} callback={this.setImage} />
        <Button containerStyle={cStyles.btnwrap} titleStyle={cStyles.btnText} buttonStyle={cStyles.btn} title="Đăng nhập" onPress={this.login} />
      </View>
    );
  }
}
