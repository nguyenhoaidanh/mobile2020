import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import RoomItem from '../components/RoomItem';
import { itemHeight } from '../constants/constants';
const styles = StyleSheet.create({
  errorStyle: { color: 'red' },
  btn: { borderRadius: 20, width: 300 },
  btnwrap: { marginTop: 10, marginBottom: 10, width: '100%', alignItems: 'center' },
});

type Props = {};
class Home extends Component<Props> {
  state = {};
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  navigate = (url) => {
    this.props.history.push(url);
    this.props.appActions.setCurScreent({ currentScreent: { text: 'Tạo room' } });
  };
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { errorMessage = {}, listRoom = [1, 23, 32, 23, 45, 45, 3434] } = this.state;
    const itemHeight = 195;
    return (
      <View>
        <Button containerStyle={styles.btnwrap} buttonStyle={styles.btn} title="Tạo room" onPress={() => this.navigate('create-room')} />
        <ScrollView contentContainerStyle={{ height: listRoom.length * itemHeight, backgroundColor: 'blue', flexGrow: 1 }}>
          {listRoom.map((room, idx) => (
            <RoomItem room={room} key={idx} index={idx} />
          ))}
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    app: state.app,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
