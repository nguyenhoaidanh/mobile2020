import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Avatar, Divider, Card, ListItem, ButtonGroup } from 'react-native-elements';
import cStyles from '../constants/common-styles';
import ImageInput from '../components/ImageInput';
import { showImageInput, setAvatar, shorterString, AXIOS, uploadFileToServer } from '../utils/functions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import { list_screen_map } from '../constants/constants';
import AsyncStorage from '@react-native-community/async-storage';
const styles = StyleSheet.create({
  selected: { backgroundColor: 'transparent' },
  selectedText: { color: 'green' },
  group: { marginTop: 10 },
});
list = [{ text: 'Tất cả' }, { text: 'Đã điểm danh' }, { text: 'Chưa điểm danh' }];
list_default = [
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President',
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman',
    check: true,
  },
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President',
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman',
    check: true,
  },
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President',
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman',
    check: true,
  },
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President',
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman',
    check: true,
  },
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President',
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman',
    check: true,
  },
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President',
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman',
    check: true,
  },
];
const MODES = { ALL: 'Danh sách sinh viên', NOT_CHECKIN: 'Chưa điểm danh', CHECKIN: 'Đã điểm danh' };
type Props = {};
class Home extends Component<Props> {
  state = {};
  componentDidMount = () => {
    AXIOS('/users', 'POST', {}, {}, this.props.userInfo.token)
      .then((data) => {
        console.log('123456', 1, data);
        this.setState({ listStudent: [] });
      })
      .catch((err) => {
        console.log('123456', 2, err.response.data);
      });
  };
  updateIndex = (selectedIndex) => {
    mode = selectedIndex == 0 ? MODES.ALL : selectedIndex == 1 ? MODES.CHECKIN : MODES.NOT_CHECKIN;
    this.setState({ selectedIndex, mode });
  };
  render() {
    let { listStudent = list_default, mode = MODES.ALL, selectedIndex = 0 } = this.state;
    let buttons = list.map((el) => ({
      element: () => (
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Text style={{ color: 'black' }}>{el.text}</Text>
        </View>
      ),
    }));
    switch (mode) {
      case MODES.NOT_CHECKIN:
        listStudent = listStudent.filter((e) => !e.check);
        break;
      case MODES.CHECKIN:
        listStudent = listStudent.filter((e) => e.check);
        break;
      default:
        break;
    }
    return (
      <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column' }}>
        <View style={styles.container}>
          <ButtonGroup
            selectedButtonStyle={styles.selected}
            selectedTextStyle={styles.selectedText}
            containerStyle={styles.group}
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
          />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Card
            title={
              <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10 }}>
                <View style={{ alignItems: 'center', width: '100%' }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>
                    <Text style={{ color: 'green' }}>{`${mode} - ${listStudent.length} sinh viên`} </Text>
                  </Text>
                </View>
              </View>
            }
            containerStyle={{ margin: 10, padding: 0, backgroundColor: '#E9EBEE' }}
          >
            {listStudent.map((l, i) => (
              <ListItem
                rightElement={<Icon name={l.check ? 'check-circle' : 'close'} color={l.check ? 'green' : 'red'} size={20} />}
                key={i}
                leftAvatar={{ source: { uri: l.avatar_url } }}
                title={l.name}
                subtitle={l.subtitle}
                bottomDivider
              />
            ))}
          </Card>
          <View style={{ height: 65 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    app: state.app,
    userInfo: state.user.userInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
